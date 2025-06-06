import { NextRequest, NextResponse } from "next/server";
import { checkr } from "../../../lib/checkr";
import { backgroundCheckService } from "../../../lib/background-check-service";
import { BackgroundCheckStatus } from "@prisma/client";

interface CheckrWebhookEvent {
  id: string;
  type: string;
  created_at: string;
  data: {
    object: any;
  };
  account_id?: string;
}

// Helper function to fetch candidate data when not included in payload
async function fetchCandidateIfMissing(reportOrInvitation: any) {
  try {
    // If candidate data is already included, return it
    if (reportOrInvitation.candidate && typeof reportOrInvitation.candidate === 'object') {
      console.log("[Checkr Webhook] Candidate data already included in payload");
      return reportOrInvitation.candidate;
    }

    // If we only have candidate_id, fetch the full candidate data
    if (reportOrInvitation.candidate_id) {
      console.log(`[Checkr Webhook] Fetching candidate data for ID: ${reportOrInvitation.candidate_id}`);
      const candidateResponse = await checkr.getCandidate(reportOrInvitation.candidate_id);
      
      if (candidateResponse.success && candidateResponse.data) {
        console.log("[Checkr Webhook] Successfully fetched candidate data");
        return candidateResponse.data;
      } else {
        console.warn("[Checkr Webhook] Failed to fetch candidate data:", candidateResponse.error);
        return null;
      }
    }

    console.warn("[Checkr Webhook] No candidate data or candidate_id found");
    return null;
  } catch (error) {
    console.error("[Checkr Webhook] Error fetching candidate data:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Checkr Webhook] Received webhook request");

    const body = await request.text();
    const signature = request.headers.get('checkr-signature') || '';

    // Verify webhook signature for security
    if (!checkr.verifyWebhookSignature(body, signature)) {
      console.error("[Checkr Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: CheckrWebhookEvent = JSON.parse(body);
    console.log(`[Checkr Webhook] Processing event: ${event.type} (${event.id})`);
    console.log(`[Checkr Webhook] Event data:`, JSON.stringify(event.data.object, null, 2));

    // Handle different event types based on Checkr integration requirements
    switch (event.type) {
      // Invitation events
      case 'invitation.created':
        await handleInvitationCreated(event.data.object);
        break;
      
      case 'invitation.completed':
        await handleInvitationCompleted(event.data.object);
        break;
      
      case 'invitation.expired':
        await handleInvitationExpired(event.data.object);
        break;
        
      case 'invitation.deleted':
        await handleInvitationDeleted(event.data.object);
        break;
      
      // Report events
      case 'report.completed':
        await handleReportCompleted(event.data.object);
        break;
      
      case 'report.pre_adverse_action':
        await handleReportPreAdverseAction(event.data.object);
        break;
        
      case 'report.post_adverse_action':
        await handleReportPostAdverseAction(event.data.object);
        break;
        
      case 'report.engaged':
        await handleReportEngaged(event.data.object);
        break;
        
      case 'report.suspended':
        await handleReportSuspended(event.data.object);
        break;
        
      case 'report.resumed':
        await handleReportResumed(event.data.object);
        break;
      
      case 'report.disputed':
        await handleReportDisputed(event.data.object);
        break;

      case 'report.canceled':
        await handleReportCanceled(event.data.object);
        break;

      case 'report.updated':
        await handleReportUpdated(event.data.object);
        break;

      // Legacy events for backwards compatibility
      case 'report.upgraded':
        await handleReportUpgraded(event.data.object);
        break;
      
      default:
        console.log(`[Checkr Webhook] Unhandled event type: ${event.type}`);
    }

    console.log(`[Checkr Webhook] Successfully processed event: ${event.type}`);
    return NextResponse.json({ success: true, processed: event.type });

  } catch (error) {
    console.error("[Checkr Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { 
        error: "Webhook processing failed",
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      },
      { status: 500 }
    );
  }
}

// CHECKR "ASSESS" SUPPORT - Required implementation
// First look at "assessment" field, if no value exists, use "result" field
function determineReportStatus(report: any): {
  finalResult: string | null;
  displayStatus: BackgroundCheckStatus;
  displayLabel: string;
} {
  const assessment = report.assessment;
  const result = report.result; 
  const adjudication = report.adjudication;
  const status = report.status;
  const includesCanceled = report.includes_canceled || false;

  console.log(`[Checkr Assess] Determining status for report: ${report.id}`);
  console.log(`[Checkr Assess] Assessment: ${assessment}, Result: ${result}, Adjudication: ${adjudication}, Status: ${status}, Includes Canceled: ${includesCanceled}`);

  // REQUIRED: First look at assessment field, if no value exists, use result field
  const finalResult = assessment || result;
  
  console.log(`[Checkr Assess] Final result (assessment priority): ${finalResult}`);

  // Implement all webhook scenarios from Checkr requirements table
  if (status === 'complete' && includesCanceled === true && !result) {
    // Scenario: Canceled - partially completed with no completed reportable screenings
    return {
      finalResult: null,
      displayStatus: 'CANCELED',
      displayLabel: 'Canceled'
    };
  }

  if (status === 'complete' && includesCanceled === true && result === 'clear') {
    // Scenario: Clear w Canceled (SMB) / Pending (Larger customers)
    return {
      finalResult: 'clear',
      displayStatus: 'PARTIAL_COMPLETE',
      displayLabel: 'Clear w Canceled'
    };
  }

  if (status === 'complete' && includesCanceled === true && result === 'consider') {
    // Scenario: Needs Review (SMB) / Pending (Larger customers) - partially completed with charges
    return {
      finalResult: 'consider',
      displayStatus: 'CONSIDER',
      displayLabel: 'Needs Review'
    };
  }

  if (status === 'complete' && includesCanceled === false && result === 'clear' && assessment === 'eligible') {
    // Scenario: Clear - no charges found
    return {
      finalResult: 'eligible',
      displayStatus: 'CLEAR',
      displayLabel: 'Clear'
    };
  }

  if (status === 'complete' && includesCanceled === false && result === 'consider' && assessment === 'eligible') {
    // Scenario: Clear - charges found but marked eligible by Assess
    return {
      finalResult: 'eligible',
      displayStatus: 'CLEAR',
      displayLabel: 'Clear'
    };
  }

  if (status === 'complete' && includesCanceled === false && result === 'consider' && (assessment === 'review' || assessment === 'escalated')) {
    // Scenario: Clear, Needs Review (SMB) / Pending (Larger customers) - charges found
    return {
      finalResult: assessment,
      displayStatus: 'CONSIDER',
      displayLabel: 'Clear, Needs Review'
    };
  }

  if (adjudication === 'pre_adverse_action') {
    // Scenario: Pre Adverse Action
    return {
      finalResult: finalResult,
      displayStatus: 'PRE_ADVERSE_ACTION',
      displayLabel: 'Pre Adverse Action'
    };
  }

  if (adjudication === 'post_adverse_action') {
    // Scenario: Not Eligible - post adverse action
    return {
      finalResult: finalResult,
      displayStatus: 'POST_ADVERSE_ACTION',
      displayLabel: 'Not Eligible'
    };
  }

  if (adjudication === 'engaged') {
    // Scenario: Clear - report has been engaged
    return {
      finalResult: finalResult,
      displayStatus: 'CLEAR',
      displayLabel: 'Clear'
    };
  }

  if (status === 'suspended') {
    // Scenario: Suspended
    return {
      finalResult: null,
      displayStatus: 'SUSPENDED',
      displayLabel: 'Suspended'
    };
  }

  if (status === 'pending') {
    // Scenario: Pending - resumed from suspension
    return {
      finalResult: null,
      displayStatus: 'IN_PROGRESS',
      displayLabel: 'Pending'
    };
  }

  if (status === 'dispute') {
    // Scenario: Disputed
    return {
      finalResult: finalResult,
      displayStatus: 'DISPUTED',
      displayLabel: 'Disputed'
    };
  }

  if (status === 'canceled') {
    // Scenario: Canceled - all screenings canceled before processing
    return {
      finalResult: null,
      displayStatus: 'CANCELED',
      displayLabel: 'Canceled'
    };
  }

  // Default cases based on final result
  if (finalResult === 'clear' || finalResult === 'eligible') {
    return {
      finalResult: finalResult,
      displayStatus: 'CLEAR',
      displayLabel: 'Clear'
    };
  }

  if (finalResult === 'consider' || finalResult === 'review' || finalResult === 'escalated') {
    return {
      finalResult: finalResult,
      displayStatus: 'CONSIDER',
      displayLabel: 'Needs Review'
    };
  }

  // Fallback
  return {
    finalResult: finalResult,
    displayStatus: 'IN_PROGRESS',
    displayLabel: 'Pending'
  };
}

// Invitation event handlers
async function handleInvitationCreated(invitation: any) {
  try {
    console.log(`[Checkr Webhook] Processing invitation created: ${invitation.id}`);

    const backgroundCheck = await backgroundCheckService.findByInvitationId(invitation.id);
    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for invitation: ${invitation.id}`);
      return;
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'INVITATION_SENT',
      {
        checkrStatus: 'invitation_sent',
        invitationStatus: 'created',
        reportData: { ...backgroundCheck.reportData, displayLabel: 'Invitation Sent' }
      }
    );

    console.log(`[Checkr Webhook] Updated status to INVITATION_SENT for invitation: ${invitation.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling invitation created:", error);
    throw error;
  }
}

async function handleInvitationCompleted(invitation: any) {
  try {
    console.log(`[Checkr Webhook] Processing invitation completed: ${invitation.id}`);

    const backgroundCheck = await backgroundCheckService.findByInvitationId(invitation.id);
    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for invitation: ${invitation.id}`);
      return;
    }

    // Update status to IN_PROGRESS when invitation is completed
    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'IN_PROGRESS',
      {
        checkrStatus: 'pending',
        invitationStatus: 'completed',
        reportData: { ...backgroundCheck.reportData, displayLabel: 'Pending' }
      }
    );

    console.log(`[Checkr Webhook] Updated background check to IN_PROGRESS for invitation: ${invitation.id}`);

    // If there's a report ID associated, fetch and process the report
    if (invitation.report_id) {
      console.log(`[Checkr Webhook] Report ID found, fetching report: ${invitation.report_id}`);
      try {
        const report = await checkr.getReport(invitation.report_id);
        await processReportWithAssessSupport(report, backgroundCheck);
      } catch (reportError) {
        console.error(`[Checkr Webhook] Error fetching report ${invitation.report_id}:`, reportError);
      }
    }
  } catch (error) {
    console.error("[Checkr Webhook] Error handling invitation completed:", error);
    throw error;
  }
}

async function handleInvitationExpired(invitation: any) {
  try {
    console.log(`[Checkr Webhook] Processing invitation expired: ${invitation.id}`);

    const backgroundCheck = await backgroundCheckService.findByInvitationId(invitation.id);
    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for invitation: ${invitation.id}`);
      return;
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'EXPIRED',
      {
        checkrStatus: 'expired',
        invitationStatus: 'expired',
        reportData: { ...backgroundCheck.reportData, displayLabel: 'Invitation Expired' }
      }
    );

    console.log(`[Checkr Webhook] Updated status to EXPIRED for invitation: ${invitation.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling invitation expired:", error);
    throw error;
  }
}

async function handleInvitationDeleted(invitation: any) {
  try {
    console.log(`[Checkr Webhook] Processing invitation deleted: ${invitation.id}`);

    const backgroundCheck = await backgroundCheckService.findByInvitationId(invitation.id);
    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for invitation: ${invitation.id}`);
      return;
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'CANCELED',
      {
        checkrStatus: 'canceled',
        invitationStatus: 'deleted',
        reportData: { ...backgroundCheck.reportData, displayLabel: 'Invitation Canceled' }
      }
    );

    console.log(`[Checkr Webhook] Updated status to CANCELED for invitation: ${invitation.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling invitation deleted:", error);
    throw error;
  }
}

// Report event handlers with Assess support
async function handleReportCompleted(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing report completed: ${report.id}`);

    // Find background check by candidate ID or report ID
    let backgroundCheck = await backgroundCheckService.findByReportId(report.id);
    if (!backgroundCheck) {
      backgroundCheck = await backgroundCheckService.findByCandidateId(report.candidate_id);
    }

    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for report: ${report.id} / candidate: ${report.candidate_id}`);
      return;
    }

    await processReportWithAssessSupport(report, backgroundCheck);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report completed:", error);
    throw error;
  }
}

async function processReportWithAssessSupport(report: any, backgroundCheck: any) {
  try {
    console.log(`[Checkr Webhook] Processing report with Assess support for report: ${report.id}`);
    
    // Use Checkr Assess Support to determine status
    const { finalResult, displayStatus, displayLabel } = determineReportStatus(report);
    
    console.log(`[Checkr Webhook] Determined status: ${displayStatus}, label: ${displayLabel}, result: ${finalResult}`);

    // Check for includes_canceled field (required by Checkr integration guide)
    const includesCanceled = report.includes_canceled || false;
    console.log(`[Checkr Webhook] Report includes canceled screenings: ${includesCanceled}`);

    // Handle cancellation reasons for larger customers
    let cancellationReasons: string[] = [];
    if (includesCanceled && report.screenings && Array.isArray(report.screenings)) {
      const canceledScreenings = report.screenings.filter((s: any) => s.status === 'canceled');
      
      if (canceledScreenings.length > 0) {
        console.log(`[Checkr Webhook] Found ${canceledScreenings.length} canceled screenings, fetching reasons...`);
        
        try {
          const screeningDetails = await Promise.allSettled(
            canceledScreenings.map((s: any) => checkr.getScreening(s.id))
          );
          
          cancellationReasons = screeningDetails
            .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
            .map(result => result.value.cancellation_reason_description)
            .filter(Boolean);
            
          console.log(`[Checkr Webhook] Cancellation reasons:`, cancellationReasons);
        } catch (reasonError) {
          console.warn(`[Checkr Webhook] Could not fetch cancellation reasons:`, reasonError);
        }
      }
    }

    // Update background check with Assess-determined status
    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      displayStatus,
      {
        checkrStatus: report.status,
        reportId: report.id,
        reportData: {
          ...report,
          finalResult,
          displayLabel,
          includesCanceled,
          cancellationReasons: cancellationReasons.length > 0 ? cancellationReasons : undefined,
          processedWithAssess: true
        },
        completedAt: displayStatus !== 'IN_PROGRESS' ? new Date() : undefined
      }
    );

    // Mark user as verified if status is CLEAR
    if (displayStatus === 'CLEAR' && backgroundCheck.candidateUserId) {
      try {
        await backgroundCheckService.markUserAsVerified(backgroundCheck.candidateUserId);
        console.log(`[Checkr Webhook] User ${backgroundCheck.candidateUserId} marked as verified`);
      } catch (verifyError) {
        console.warn(`[Checkr Webhook] Could not mark user as verified:`, verifyError);
      }
    }

    console.log(`[Checkr Webhook] Report processed successfully with status: ${displayStatus}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error processing report with Assess support:", error);
    throw error;
  }
}

async function handleReportPreAdverseAction(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing report pre-adverse action: ${report.id}`);

    let backgroundCheck = await backgroundCheckService.findByReportId(report.id);
    if (!backgroundCheck) {
      backgroundCheck = await backgroundCheckService.findByCandidateId(report.candidate_id);
    }

    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for report: ${report.id}`);
      return;
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'PRE_ADVERSE_ACTION',
      {
        checkrStatus: 'complete',
        reportData: { ...report, displayLabel: 'Pre Adverse Action' }
      }
    );

    console.log(`[Checkr Webhook] Updated status to PRE_ADVERSE_ACTION for report: ${report.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report pre-adverse action:", error);
    throw error;
  }
}

async function handleReportPostAdverseAction(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing report post-adverse action: ${report.id}`);

    let backgroundCheck = await backgroundCheckService.findByReportId(report.id);
    if (!backgroundCheck) {
      backgroundCheck = await backgroundCheckService.findByCandidateId(report.candidate_id);
    }

    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for report: ${report.id}`);
      return;
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'POST_ADVERSE_ACTION',
      {
        checkrStatus: 'complete',
        reportData: { ...report, displayLabel: 'Not Eligible' }
      }
    );

    console.log(`[Checkr Webhook] Updated status to POST_ADVERSE_ACTION for report: ${report.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report post-adverse action:", error);
    throw error;
  }
}

async function handleReportEngaged(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing report engaged: ${report.id}`);

    let backgroundCheck = await backgroundCheckService.findByReportId(report.id);
    if (!backgroundCheck) {
      backgroundCheck = await backgroundCheckService.findByCandidateId(report.candidate_id);
    }

    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for report: ${report.id}`);
      return;
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'CLEAR',
      {
        checkrStatus: 'complete',
        reportData: { ...report, displayLabel: 'Clear' }
      }
    );

    // Mark user as verified when report is engaged
    if (backgroundCheck.candidateUserId) {
      try {
        await backgroundCheckService.markUserAsVerified(backgroundCheck.candidateUserId);
        console.log(`[Checkr Webhook] User ${backgroundCheck.candidateUserId} marked as verified after engagement`);
      } catch (verifyError) {
        console.warn(`[Checkr Webhook] Could not mark user as verified:`, verifyError);
      }
    }

    console.log(`[Checkr Webhook] Updated status to CLEAR for engaged report: ${report.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report engaged:", error);
    throw error;
  }
}

async function handleReportSuspended(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing report suspended: ${report.id}`);

    let backgroundCheck = await backgroundCheckService.findByReportId(report.id);
    if (!backgroundCheck) {
      backgroundCheck = await backgroundCheckService.findByCandidateId(report.candidate_id);
    }

    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for report: ${report.id}`);
      return;
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'SUSPENDED',
      {
        checkrStatus: 'suspended',
        reportData: { ...report, displayLabel: 'Suspended' }
      }
    );

    console.log(`[Checkr Webhook] Updated status to SUSPENDED for report: ${report.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report suspended:", error);
    throw error;
  }
}

async function handleReportResumed(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing report resumed: ${report.id}`);

    let backgroundCheck = await backgroundCheckService.findByReportId(report.id);
    if (!backgroundCheck) {
      backgroundCheck = await backgroundCheckService.findByCandidateId(report.candidate_id);
    }

    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for report: ${report.id}`);
      return;
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'IN_PROGRESS',
      {
        checkrStatus: 'pending',
        reportData: { ...report, displayLabel: 'Pending' }
      }
    );

    console.log(`[Checkr Webhook] Updated status to IN_PROGRESS for resumed report: ${report.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report resumed:", error);
    throw error;
  }
}

async function handleReportDisputed(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing report disputed: ${report.id}`);

    let backgroundCheck = await backgroundCheckService.findByReportId(report.id);
    if (!backgroundCheck) {
      backgroundCheck = await backgroundCheckService.findByCandidateId(report.candidate_id);
    }

    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for report: ${report.id}`);
      return;
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'DISPUTED',
      {
        checkrStatus: 'dispute',
        reportData: { ...report, displayLabel: 'Disputed' }
      }
    );

    console.log(`[Checkr Webhook] Updated status to DISPUTED for report: ${report.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report disputed:", error);
    throw error;
  }
}

async function handleReportCanceled(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing report canceled: ${report.id}`);

    let backgroundCheck = await backgroundCheckService.findByReportId(report.id);
    if (!backgroundCheck) {
      backgroundCheck = await backgroundCheckService.findByCandidateId(report.candidate_id);
    }

    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for report: ${report.id}`);
      return;
    }

    // Fetch cancellation reasons from individual screenings
    let cancellationReasons: string[] = [];
    if (report.screenings && Array.isArray(report.screenings)) {
      console.log(`[Checkr Webhook] Fetching cancellation reasons for ${report.screenings.length} screenings...`);
      
      try {
        const screeningDetails = await Promise.allSettled(
          report.screenings.map((s: any) => checkr.getScreening(s.id))
        );
        
        cancellationReasons = screeningDetails
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map(result => result.value.cancellation_reason_description)
          .filter(Boolean);
          
        console.log(`[Checkr Webhook] Cancellation reasons:`, cancellationReasons);
      } catch (reasonError) {
        console.warn(`[Checkr Webhook] Could not fetch cancellation reasons:`, reasonError);
      }
    }

    await backgroundCheckService.updateStatus(
      backgroundCheck.id,
      'CANCELED',
      {
        checkrStatus: 'canceled',
        reportData: { 
          ...report, 
          displayLabel: 'Canceled',
          cancellationReasons: cancellationReasons.length > 0 ? cancellationReasons : undefined
        }
      }
    );

    console.log(`[Checkr Webhook] Updated status to CANCELED for report: ${report.id}`);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report canceled:", error);
    throw error;
  }
}

async function handleReportUpdated(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing report updated: ${report.id}`);

    let backgroundCheck = await backgroundCheckService.findByReportId(report.id);
    if (!backgroundCheck) {
      backgroundCheck = await backgroundCheckService.findByCandidateId(report.candidate_id);
    }

    if (!backgroundCheck) {
      console.error(`[Checkr Webhook] Background check not found for report: ${report.id}`);
      return;
    }

    // Check if this is an ETA update
    if (report.estimated_completion_time) {
      console.log(`[Checkr Webhook] ETA update received: ${report.estimated_completion_time}`);
      
      await backgroundCheckService.updateStatus(
        backgroundCheck.id,
        backgroundCheck.status, // Keep current status
        {
          reportData: { 
            ...backgroundCheck.reportData,
            ...report,
            eta: report.estimated_completion_time
          }
        }
      );

      console.log(`[Checkr Webhook] Updated ETA for report: ${report.id}`);
    } else {
      // Regular report update - use Assess support to determine status
      await processReportWithAssessSupport(report, backgroundCheck);
    }
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report updated:", error);
    throw error;
  }
}

// Legacy handler for backwards compatibility
async function handleReportUpgraded(report: any) {
  try {
    console.log(`[Checkr Webhook] Processing legacy report upgraded: ${report.id}`);
    await handleReportUpdated(report);
  } catch (error) {
    console.error("[Checkr Webhook] Error handling report upgraded:", error);
    throw error;
  }
} 