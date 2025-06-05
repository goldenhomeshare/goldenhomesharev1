import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkr } from '@/app/lib/checkr';
import { BackgroundCheckService } from '@/app/lib/background-check-service';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const CreateHostedCheckSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  zipcode: z.string().optional(),
  package: z.string().default('basic_for_golden_homeshare'),
  workLocation: z.object({
    country: z.string().default('US'),
    state: z.string().optional(),
    city: z.string().min(1, 'City is required'),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Kinde session
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to create a background check',
      }, { status: 401 });
    }

    // Parse and validate request body (optional overrides)
    const body = await request.json().catch(() => ({}));
    const requestData = CreateHostedCheckSchema.parse(body);

    // Use authenticated user's information as primary data
    const validatedData = {
      email: user.email, // Always use authenticated user's email
      firstName: requestData.firstName || user.given_name || '',
      lastName: requestData.lastName || user.family_name || '',
      phone: requestData.phone,
      zipcode: requestData.zipcode,
      package: requestData.package,
      workLocation: requestData.workLocation,
    };

    // Validate that we have required user information
    if (!validatedData.firstName || !validatedData.lastName) {
      return NextResponse.json({
        success: false,
        error: 'Missing user information',
        message: 'First name and last name are required. Please update your profile.',
        missingFields: {
          firstName: !validatedData.firstName,
          lastName: !validatedData.lastName,
        },
      }, { status: 400 });
    }

    const backgroundCheckService = new BackgroundCheckService();

    console.log('[CreateHostedCheck] Creating hosted background check for:', {
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
    });

    // Step 0: Check if there's already a completed background check for this email
    console.log('[CreateHostedCheck] Checking for existing background check...');
    
    try {
      // Skip database lookup for now due to model issues, go directly to Checkr API search
      console.log('[CreateHostedCheck] Checking Checkr API for existing completed background check...');
      
             // Use the same comprehensive search logic as check-status
       let existingCandidateId: string | undefined;
       let existingReportId: string | undefined;
       let existingResult: string | undefined;
       let existingCandidate: any;
       let existingReport: any;
      
             try {
         // Search Checkr API for existing candidate by email
         const candidatesResponse = await checkr.getCandidates({ per_page: 100 });
         const candidates = Array.isArray(candidatesResponse) ? candidatesResponse : candidatesResponse.data || candidatesResponse.candidates || [];
         existingCandidate = candidates.find((c: any) => c.email === validatedData.email);
         
         if (existingCandidate) {
           console.log('[CreateHostedCheck] Found existing candidate in Checkr:', existingCandidate.id);
           existingCandidateId = existingCandidate.id;
           
           // Check if candidate has any reports
           if (existingCandidate.report_ids && existingCandidate.report_ids.length > 0) {
             // Get the most recent report
             const reports = existingCandidate.report_ids;
             existingReportId = reports[reports.length - 1]; // Most recent
             
             try {
               if (existingReportId) {
                 existingReport = await checkr.getReport(existingReportId);
                 console.log('[CreateHostedCheck] Retrieved report:', existingReportId, 'Status:', existingReport.status, 'Result:', existingReport.result);
                 
                 if (existingReport.status === 'complete') {
                   existingResult = existingReport.result;
                   
                   if (existingResult === 'clear') {
                     console.log('[CreateHostedCheck] Found existing complete and clear background check');
                     
                     // Return the existing completed check
                     return NextResponse.json({
                       success: true,
                       data: {
                         candidateId: existingCandidate.id,
                         invitationId: null,
                         invitationUrl: null,
                         status: 'completed',
                         result: 'clear',
                         isExisting: true,
                         completedAt: existingReport.completed_at,
                         reportId: existingReportId,
                         reportData: existingReport,
                         candidate: {
                           name: `${existingCandidate.first_name} ${existingCandidate.last_name}`,
                           email: existingCandidate.email,
                         },
                       },
                       message: 'Found existing completed and clear background check for this email',
                     });
                   }
                 }
               }
             } catch (reportError) {
               console.log('[CreateHostedCheck] Error fetching report:', reportError);
             }
           }
         }
       } catch (candidateError) {
         console.log('[CreateHostedCheck] Error searching for existing candidate:', candidateError);
       }
      
      console.log('[CreateHostedCheck] No existing completed background check found, creating new one...');
      
    } catch (checkError) {
      console.log('[CreateHostedCheck] Error checking existing records (continuing with new check):', checkError);
      // Continue with creating a new check if there's an error checking existing ones
    }

    // Step 1: Create candidate in Checkr
    const candidateData = {
      email: validatedData.email,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      phone: validatedData.phone,
      zipcode: validatedData.zipcode,
      custom_id: user.id, // Auto-generated unique ID for cross-reference
      work_locations: [validatedData.workLocation], // REQUIRED: Work location for candidate
    };

    // Generate idempotency key to prevent duplicate candidates (RECOMMENDED)
    const idempotencyKey = `candidate-${user.id}-${Date.now()}`;
    const candidateHeaders = {
      'Idempotency-Key': idempotencyKey,
    };

    const candidate = await checkr.createCandidate(candidateData, candidateHeaders);
    console.log('[CreateHostedCheck] Candidate created:', candidate.id);

    // Step 2: Create invitation for hosted flow
    const invitationData = {
      candidate_id: candidate.id,
      package: validatedData.package,
      work_locations: [validatedData.workLocation],
    };

    const invitation = await checkr.createInvitation(invitationData);
    console.log('[CreateHostedCheck] Invitation created:', invitation.id);

    // Step 3: Store in our database (optional, for tracking)
    try {
      const userId = user.id; // Use authenticated user's ID
      
      await backgroundCheckService.createBackgroundCheck({
        candidateUserId: userId,
        candidateId: candidate.id,
        invitationId: invitation.id,
        candidateEmail: validatedData.email,
        candidateName: `${validatedData.firstName} ${validatedData.lastName}`,
        candidatePhone: validatedData.phone,
        candidateZipcode: validatedData.zipcode,
        invitationUrl: invitation.invitation_url,
        packageName: validatedData.package,
      });
      console.log('[CreateHostedCheck] Background check record created in database');
    } catch (dbError) {
      console.warn('[CreateHostedCheck] Failed to save to database (continuing):', dbError);
      // Continue even if database save fails
    }

    // Return success response with invitation URL
    return NextResponse.json({
      success: true,
      data: {
        candidateId: candidate.id,
        invitationId: invitation.id,
        invitationUrl: invitation.invitation_url,
        status: invitation.status,
        expiresAt: invitation.expires_at,
      },
      message: 'Background check invitation created successfully',
    });

  } catch (error) {
    console.error('[CreateHostedCheck] Full error object:', error);
    console.error('[CreateHostedCheck] Error name:', error?.constructor?.name);
    console.error('[CreateHostedCheck] Error message:', error instanceof Error ? error.message : 'Non-Error object');

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      }, { status: 400 });
    }

    // Better Checkr API error handling
    if ((error as any)?.name === 'CheckrAPIError' || (error instanceof Error && error.message.includes('CheckrAPIError'))) {
      return NextResponse.json({
        success: false,
        error: 'Checkr API error',
        details: (error as any).message || 'Checkr API error occurred',
        checkrStatus: (error as any).statusCode || 'unknown',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create background check invitation',
      details: error instanceof Error ? error.message : 'Unknown error',
      errorType: error?.constructor?.name || 'unknown',
    }, { status: 500 });
  }
} 