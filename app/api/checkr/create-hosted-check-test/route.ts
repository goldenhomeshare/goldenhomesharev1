import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkr } from '@/app/lib/checkr';
import { BackgroundCheckService } from '@/app/lib/background-check-service';

const CreateHostedCheckTestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  zipcode: z.string().optional(),
  package: z.string().default('basic_for_golden_homeshare'),
  workLocation: z.object({
    country: z.string().default('US'),
    state: z.string().optional(),
    city: z.string().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateHostedCheckTestSchema.parse(body);

    const backgroundCheckService = new BackgroundCheckService();

    console.log('[CreateHostedCheckTest] Creating hosted background check for:', {
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
    });

    // Step 0: Check if there's already a completed background check for this email
    console.log('[CreateHostedCheckTest] Checking for existing background check...');
    
    try {
      // Skip database lookup for now due to model issues, go directly to Checkr API search
      console.log('[CreateHostedCheckTest] Checking Checkr API for existing completed background check...');
      
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
          console.log('[CreateHostedCheckTest] Found existing candidate in Checkr:', existingCandidate.id);
          existingCandidateId = existingCandidate.id;
          
          // Check if candidate has any reports
          if (existingCandidate.report_ids && existingCandidate.report_ids.length > 0) {
            // Get the most recent report
            const reports = existingCandidate.report_ids;
            existingReportId = reports[reports.length - 1]; // Most recent
            
            try {
              if (existingReportId) {
                existingReport = await checkr.getReport(existingReportId);
                console.log('[CreateHostedCheckTest] Retrieved report:', existingReportId, 'Status:', existingReport.status, 'Result:', existingReport.result);
                
                if (existingReport.status === 'complete') {
                  existingResult = existingReport.result;
                  
                  if (existingResult === 'clear') {
                    console.log('[CreateHostedCheckTest] Found existing complete and clear background check');
                    
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
              console.log('[CreateHostedCheckTest] Error fetching report:', reportError);
            }
          }
        }
      } catch (candidateError) {
        console.log('[CreateHostedCheckTest] Error searching for existing candidate:', candidateError);
      }
      
      console.log('[CreateHostedCheckTest] No existing completed background check found, creating new one...');
      
    } catch (checkError) {
      console.log('[CreateHostedCheckTest] Error checking existing records (continuing with new check):', checkError);
      // Continue with creating a new check if there's an error checking existing ones
    }

    // Step 1: Create candidate in Checkr
    const candidateData = {
      email: validatedData.email,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      phone: validatedData.phone,
      zipcode: validatedData.zipcode,
      custom_id: `test-${validatedData.email}-${Date.now()}`, // REQUIRED: Unique ID for cross-reference  
      work_locations: [validatedData.workLocation || { 
        country: 'US', 
        state: 'CA',
        city: 'San Francisco' // RECOMMENDED: City for US checks
      }], // REQUIRED: Work location for candidate
    };

    // Generate idempotency key to prevent duplicate candidates (RECOMMENDED)
    const idempotencyKey = `test-candidate-${validatedData.email}-${Date.now()}`;
    const candidateHeaders = {
      'Idempotency-Key': idempotencyKey,
    };

    const candidate = await checkr.createCandidate(candidateData, candidateHeaders);
    console.log('[CreateHostedCheckTest] Candidate created:', candidate.id);

    // Step 2: Create invitation for hosted flow
    const invitationData = {
      candidate_id: candidate.id,
      package: validatedData.package,
      work_locations: [validatedData.workLocation || { country: 'US' }],
    };

    const invitation = await checkr.createInvitation(invitationData);
    console.log('[CreateHostedCheckTest] Invitation created:', invitation.id);

    // Step 3: Store in our database (optional, for tracking)
    try {
      await backgroundCheckService.createBackgroundCheck({
        candidateUserId: 'test-user', // Use test user ID for testing
        candidateId: candidate.id,
        invitationId: invitation.id,
        candidateEmail: validatedData.email,
        candidateName: `${validatedData.firstName} ${validatedData.lastName}`,
        candidatePhone: validatedData.phone,
        candidateZipcode: validatedData.zipcode,
        invitationUrl: invitation.invitation_url,
        packageName: validatedData.package,
      });
      console.log('[CreateHostedCheckTest] Background check record created in database');
    } catch (dbError) {
      console.warn('[CreateHostedCheckTest] Failed to save to database (continuing):', dbError);
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
    console.error('[CreateHostedCheckTest] Full error object:', error);
    console.error('[CreateHostedCheckTest] Error name:', error?.constructor?.name);
    console.error('[CreateHostedCheckTest] Error message:', error instanceof Error ? error.message : 'Non-Error object');

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