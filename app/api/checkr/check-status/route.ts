import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkr } from '@/app/lib/checkr';
import { BackgroundCheckService } from '@/app/lib/background-check-service';

const CheckStatusSchema = z.object({
  invitationId: z.string().optional(),
  candidateId: z.string().optional(),
  email: z.string().email().optional(),
}).refine(data => data.invitationId || data.candidateId || data.email, {
  message: "Either invitationId, candidateId, or email must be provided"
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = CheckStatusSchema.parse(body);

    const backgroundCheckService = new BackgroundCheckService();

    console.log('[CheckStatus] Checking background check status for:', validatedData);

    let invitation: any = null;
    let candidate: any = null;
    let report: any = null;
    let dbRecord: any = null;

    // Handle email-based lookup first
    if (validatedData.email && !validatedData.invitationId && !validatedData.candidateId) {
      try {
        // Find database record by email
        dbRecord = await backgroundCheckService.findByEmail(validatedData.email);
        console.log('[CheckStatus] Database record found by email:', dbRecord?.id);
        
        if (dbRecord?.invitationId) {
          validatedData.invitationId = dbRecord.invitationId;
        }
        if (dbRecord?.candidateId) {
          validatedData.candidateId = dbRecord.candidateId;
        }
      } catch (error) {
        console.warn('[CheckStatus] Database lookup error:', error);
      }
      
      // If no database record found (either error or null result), search Checkr API directly
      if (!dbRecord && !validatedData.invitationId && !validatedData.candidateId) {
        console.log('[CheckStatus] No database record found, searching Checkr API for email:', validatedData.email);
        try {
          // Fetch candidates from Checkr and find by email
          const candidatesResponse = await checkr.getCandidates({ per_page: 100 });
          console.log('[CheckStatus] Fetched candidates count:', candidatesResponse.data?.length);
          console.log('[CheckStatus] Looking for email:', validatedData.email);
          
          const matchingCandidate = candidatesResponse.data?.find((c: any) => c.email === validatedData.email);
          
          if (matchingCandidate) {
            validatedData.candidateId = matchingCandidate.id;
            console.log('[CheckStatus] Found candidate in Checkr by email:', matchingCandidate.id, 'Name:', matchingCandidate.first_name, matchingCandidate.last_name);
          } else {
            console.log('[CheckStatus] No candidate found in Checkr with email:', validatedData.email);
            console.log('[CheckStatus] First 5 emails in response:', candidatesResponse.data?.slice(0, 5).map((c: any) => c.email));
          }
        } catch (checkrError) {
          console.warn('[CheckStatus] Failed to search Checkr API:', checkrError);
        }
      }
    }

    // Get invitation details
    if (validatedData.invitationId) {
      try {
        invitation = await checkr.getInvitation(validatedData.invitationId);
        console.log('[CheckStatus] Invitation found:', invitation.id, 'Status:', invitation.status);
        
        // Get database record if not already found
        if (!dbRecord) {
          dbRecord = await backgroundCheckService.findByInvitationId(validatedData.invitationId);
        }
      } catch (error) {
        console.warn('[CheckStatus] Could not fetch invitation:', error);
      }
    }

    // Get candidate details
    const candidateId = validatedData.candidateId || invitation?.candidate_id;
    if (candidateId) {
      try {
        candidate = await checkr.getCandidate(candidateId);
        console.log('[CheckStatus] Candidate found:', candidate.id);
        console.log('[CheckStatus] Candidate report_ids:', candidate.report_ids);
        
        // Get database record if not found by invitation or email
        if (!dbRecord) {
          dbRecord = await backgroundCheckService.findByCandidateId(candidateId);
        }
      } catch (error) {
        console.warn('[CheckStatus] Could not fetch candidate:', error);
      }
    }

    // Get report details if invitation has a report
    if (invitation?.report_id) {
      try {
        report = await checkr.getReport(invitation.report_id);
        console.log('[CheckStatus] Report found:', report.id, 'Status:', report.status);
      } catch (error) {
        console.warn('[CheckStatus] Could not fetch report:', error);
      }
    }

    // If no report from invitation, check all candidate reports
    if (!report && candidate?.report_ids && candidate.report_ids.length > 0) {
      console.log('[CheckStatus] Checking candidate reports:', candidate.report_ids);
      
      // Fetch all reports for the candidate and find the most recent/complete one
      const reports = await Promise.allSettled(
        candidate.report_ids.map((reportId: string) => checkr.getReport(reportId))
      );

      const completedReports = reports
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(r => r.status === 'complete')
        .sort((a, b) => new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime());

      if (completedReports.length > 0) {
        report = completedReports[0]; // Use the most recent completed report
        console.log('[CheckStatus] Found completed report from candidate:', report.id, 'Result:', report.result);
      } else {
        // If no completed reports, get the most recent report regardless of status
        const allReports = reports
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map(result => result.value)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        if (allReports.length > 0) {
          report = allReports[0];
          console.log('[CheckStatus] Using most recent report:', report.id, 'Status:', report.status);
        }
      }
    }

    // Determine overall status and result
    const status = {
      invitation: invitation?.status || 'unknown',
      report: report?.status || (invitation?.status === 'completed' ? 'pending' : 'not_started'),
      overall: 'pending'
    };

    let result = 'pending';
    let adjudication = null;

    if (report) {
      result = report.result || 'pending';
      adjudication = report.adjudication;
      
      if (report.status === 'complete') {
        status.overall = 'complete';
      } else if (report.status === 'disputed') {
        status.overall = 'disputed';
      }
    } else if (invitation?.status === 'completed') {
      status.overall = 'processing';
    } else if (invitation?.status === 'expired') {
      status.overall = 'expired';
    }

    // Build response
    const response = {
      success: true,
      data: {
        // Status information
        status,
        result,
        adjudication,
        
        // IDs for reference
        invitationId: invitation?.id,
        candidateId: candidate?.id,
        reportId: report?.id,
        
        // Candidate info
        candidate: candidate ? {
          name: `${candidate.first_name} ${candidate.last_name}`,
          email: candidate.email,
          createdAt: candidate.created_at,
          reportIds: candidate.report_ids || []
        } : null,
        
        // Invitation info
        invitation: invitation ? {
          status: invitation.status,
          createdAt: invitation.created_at,
          completedAt: invitation.completed_at,
          expiresAt: invitation.expires_at,
          invitationUrl: invitation.invitation_url,
          package: invitation.package
        } : null,
        
        // Report info
        report: report ? {
          status: report.status,
          result: report.result,
          adjudication: report.adjudication,
          createdAt: report.created_at,
          completedAt: report.completed_at,
          upgradedeAt: report.upgraded_at,
          package: report.package,
          // Include some screening results if available
          screenings: report.screenings?.slice(0, 5) || [] // Limit to first 5 for display
        } : null,
        
        // Database record
        dbRecord: dbRecord ? {
          id: dbRecord.id,
          status: dbRecord.status,
          checkrStatus: dbRecord.checkrStatus,
          createdAt: dbRecord.createdAt,
          updatedAt: dbRecord.updatedAt
        } : null,
        
        // Human-readable summary
        summary: {
          isComplete: status.overall === 'complete',
          isClear: result === 'clear',
          isConsider: result === 'consider',
          isPending: status.overall === 'pending' || status.overall === 'processing',
          isExpired: status.overall === 'expired',
          message: getStatusMessage(status.overall, result, invitation?.status, validatedData.email, !dbRecord && !invitation && !candidate)
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[CheckStatus] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to check background check status',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

function getStatusMessage(overallStatus: string, result: string, invitationStatus?: string, searchedEmail?: string, noRecordsFound?: boolean): string {
  if (noRecordsFound && searchedEmail) {
    return `No background check found for email ${searchedEmail}. Please check the email address or contact support if you believe this is an error.`;
  } else if (noRecordsFound) {
    return 'No background check found for the provided information.';
  } else if (overallStatus === 'complete') {
    if (result === 'clear') {
      return 'Background check completed - No issues found';
    } else if (result === 'consider') {
      return 'Background check completed - Items found that require review';
    } else {
      return 'Background check completed';
    }
  } else if (overallStatus === 'processing') {
    return 'Candidate completed the application - Background check in progress';
  } else if (overallStatus === 'expired') {
    return 'Invitation expired - Candidate did not complete within 7 days';
  } else if (invitationStatus === 'pending') {
    return 'Invitation sent - Waiting for candidate to complete';
  } else {
    return 'Status unknown';
  }
} 