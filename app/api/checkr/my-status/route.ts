import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { checkr } from '@/app/lib/checkr';
import { BackgroundCheckService } from '@/app/lib/background-check-service';

export async function GET() {
  try {
    // Get the authenticated user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to check your background check status',
      }, { status: 401 });
    }

    console.log('[MyStatus] Checking background check status for user:', user.email);

    const backgroundCheckService = new BackgroundCheckService();
    let invitation: any = null;
    let candidate: any = null;
    let report: any = null;
    let dbRecord: any = null;

    // First, try to find database record by email
    try {
      dbRecord = await backgroundCheckService.findByEmail(user.email);
      console.log('[MyStatus] Database record found by email:', dbRecord?.id);
      
      if (dbRecord?.invitationId) {
        try {
          invitation = await checkr.getInvitation(dbRecord.invitationId);
          console.log('[MyStatus] Invitation found:', invitation.id, 'Status:', invitation.status);
        } catch (error) {
          console.warn('[MyStatus] Could not fetch invitation:', error);
        }
      }
      
      if (dbRecord?.candidateId) {
        try {
          candidate = await checkr.getCandidate(dbRecord.candidateId);
          console.log('[MyStatus] Candidate found:', candidate.id);
        } catch (error) {
          console.warn('[MyStatus] Could not fetch candidate:', error);
        }
      }
    } catch (error) {
      console.warn('[MyStatus] Database lookup error:', error);
    }

    // If no database record found, search Checkr API directly
    if (!dbRecord && !candidate) {
      console.log('[MyStatus] No database record found, searching Checkr API for email:', user.email);
      try {
        const candidatesResponse = await checkr.getCandidates({ per_page: 100 });
        const matchingCandidate = candidatesResponse.data?.find((c: any) => c.email === user.email);
        
        if (matchingCandidate) {
          candidate = matchingCandidate;
          console.log('[MyStatus] Found candidate in Checkr by email:', candidate.id, 'Name:', candidate.first_name, candidate.last_name);
        } else {
          console.log('[MyStatus] No candidate found in Checkr with email:', user.email);
        }
      } catch (checkrError) {
        console.warn('[MyStatus] Failed to search Checkr API:', checkrError);
      }
    }

    // Get candidate from invitation if we have one but no candidate yet
    if (invitation?.candidate_id && !candidate) {
      try {
        candidate = await checkr.getCandidate(invitation.candidate_id);
        console.log('[MyStatus] Candidate found from invitation:', candidate.id);
      } catch (error) {
        console.warn('[MyStatus] Could not fetch candidate from invitation:', error);
      }
    }

    // Get report details if invitation has a report
    if (invitation?.report_id) {
      try {
        report = await checkr.getReport(invitation.report_id);
        console.log('[MyStatus] Report found:', report.id, 'Status:', report.status);
      } catch (error) {
        console.warn('[MyStatus] Could not fetch report:', error);
      }
    }

    // If no report from invitation, check all candidate reports
    if (!report && candidate?.report_ids && candidate.report_ids.length > 0) {
      console.log('[MyStatus] Checking candidate reports:', candidate.report_ids);
      
      const reports = await Promise.allSettled(
        candidate.report_ids.map((reportId: string) => checkr.getReport(reportId))
      );

      const completedReports = reports
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(r => r.status === 'complete')
        .sort((a, b) => new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime());

      if (completedReports.length > 0) {
        report = completedReports[0];
        console.log('[MyStatus] Found completed report from candidate:', report.id, 'Result:', report.result);
      } else {
        const allReports = reports
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map(result => result.value)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        if (allReports.length > 0) {
          report = allReports[0];
          console.log('[MyStatus] Using most recent report:', report.id, 'Status:', report.status);
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
        // User info
        user: {
          id: user.id,
          email: user.email,
          name: user.given_name && user.family_name ? `${user.given_name} ${user.family_name}` : user.email,
        },
        
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
          screenings: report.screenings?.slice(0, 5) || []
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
          message: getStatusMessage(status.overall, result, invitation?.status, user.email, !dbRecord && !invitation && !candidate)
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[MyStatus] Error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to check background check status',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

function getStatusMessage(overallStatus: string, result: string, invitationStatus?: string, userEmail?: string, noRecordsFound?: boolean): string {
  if (noRecordsFound && userEmail) {
    return `No background check found for your account (${userEmail}). Contact support if you believe this is an error.`;
  } else if (noRecordsFound) {
    return 'No background check found for your account.';
  } else if (overallStatus === 'complete') {
    if (result === 'clear') {
      return 'Your background check is complete - No issues found';
    } else if (result === 'consider') {
      return 'Your background check is complete - Items found that require review';
    } else {
      return 'Your background check is complete';
    }
  } else if (overallStatus === 'processing') {
    return 'You completed the application - Background check in progress';
  } else if (overallStatus === 'expired') {
    return 'Your invitation expired - Contact support to request a new one';
  } else if (invitationStatus === 'pending') {
    return 'Background check invitation sent - Please complete the application';
  } else {
    return 'Background check status unknown';
  }
} 