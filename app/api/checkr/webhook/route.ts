import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/app/lib/db";
import crypto from "crypto";

// Enhanced webhook signature verification
function verifyCheckrSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (error) {
    console.error("[Checkr Webhook] Signature verification error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Checkr Webhook] 📨 Received webhook request");
    console.log("[Checkr Webhook] Headers:", Object.fromEntries(request.headers.entries()));

    const body = await request.text();
    console.log("[Checkr Webhook] Raw body length:", body.length);
    
    let event;
    try {
      event = JSON.parse(body);
    } catch (parseError) {
      console.error("[Checkr Webhook] ❌ Failed to parse JSON:", parseError);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    console.log("[Checkr Webhook] 📋 Event type:", event.type);
    console.log("[Checkr Webhook] 📋 Event ID:", event.id);
    console.log("[Checkr Webhook] 📋 Event data:", JSON.stringify(event.data, null, 2));

    // Verify webhook signature if webhook secret is configured
    const webhookSecret = process.env.CHECKR_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('checkr-signature') || request.headers.get('x-checkr-signature');
      
      if (!signature) {
        console.error("[Checkr Webhook] ❌ No signature header found");
        return NextResponse.json({ error: "Missing signature" }, { status: 401 });
      }
      
      console.log("[Checkr Webhook] 🔐 Verifying signature...");
      
      if (!verifyCheckrSignature(body, signature, webhookSecret)) {
        console.error("[Checkr Webhook] ❌ Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
      
      console.log("[Checkr Webhook] ✅ Signature verified");
    } else {
      console.warn("[Checkr Webhook] ⚠️ No webhook secret configured - skipping signature verification");
    }

    // Handle different event types with enhanced logging
    let result;
    switch (event.type) {
      case 'invitation.completed':
        console.log("[Checkr Webhook] 🎯 Processing invitation.completed event");
        result = await handleInvitationCompleted(event.data);
        break;
      
      case 'report.completed':
        console.log("[Checkr Webhook] 🎯 Processing report.completed event");
        result = await handleReportCompleted(event.data);
        break;
      
      case 'invitation.canceled':
      case 'invitation.cancelled': // Handle both spellings
        console.log("[Checkr Webhook] 🎯 Processing invitation canceled event");
        result = await handleBackgroundCheckCanceled(event.data);
        break;
      
      case 'report.canceled':
      case 'report.cancelled': // Handle both spellings
        console.log("[Checkr Webhook] 🎯 Processing report canceled event");
        result = await handleBackgroundCheckCanceled(event.data);
        break;
      
      case 'invitation.expired':
        console.log("[Checkr Webhook] 🎯 Processing invitation.expired event");
        result = await handleBackgroundCheckExpired(event.data);
        break;
      
      case 'report.disputed':
        console.log("[Checkr Webhook] 🎯 Processing report.disputed event");
        result = await handleReportDisputed(event.data);
        break;
      
      default:
        console.log(`[Checkr Webhook] ⚠️ Unhandled event type: ${event.type}`);
        result = { success: true, message: `Event type ${event.type} acknowledged but not processed` };
    }

    console.log("[Checkr Webhook] ✅ Event processed successfully:", result);

    return NextResponse.json({ 
      success: true, 
      eventType: event.type,
      eventId: event.id,
      result: result
    });

  } catch (error) {
    console.error("[Checkr Webhook] ❌ Error processing webhook:", error);
    console.error("[Checkr Webhook] ❌ Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function handleInvitationCompleted(data: any) {
  try {
    console.log("[Checkr Webhook] 🔍 Processing invitation completion for invitation:", data.id);

    // Find the background check record
    const backgroundCheck = await findBackgroundCheckRecord(data);

    if (!backgroundCheck) {
      console.error("[Checkr Webhook] ❌ Background check record not found for invitation:", data.id);
      return { success: false, message: "Background check record not found" };
    }

    console.log("[Checkr Webhook] ✅ Found background check record:", backgroundCheck.id);

    // Check if already completed
    if (backgroundCheck.status === 'COMPLETED') {
      console.log("[Checkr Webhook] ℹ️ Background check already marked as completed");
      return { success: true, message: "Already completed" };
    }

    // Update background check status
    const updateData: any = {
      status: "COMPLETED" as const,
      updatedAt: new Date(),
      completedAt: new Date(),
      invitationStatus: data.status || "completed"
    };

    // If report data is available, include it
    if (data.report) {
      updateData.reportId = data.report.id;
      updateData.checkrStatus = data.report.result || "clear";
    } else {
      updateData.checkrStatus = "clear"; // Default for completed invitations
    }

    const updatedCheck = await prisma.background_checks.update({
      where: { id: backgroundCheck.id },
      data: updateData
    });

    console.log("[Checkr Webhook] ✅ Background check updated to COMPLETED");

    // Update user verification status
    if (backgroundCheck.candidateUserId) {
      await prisma.user.update({
        where: { id: backgroundCheck.candidateUserId },
        data: { isVerified: true }
      });

      console.log("[Checkr Webhook] ✅ User verification updated for user:", backgroundCheck.candidateUserId);
    } else {
      console.warn("[Checkr Webhook] ⚠️ No candidateUserId found - skipping user verification update");
    }

    return { 
      success: true, 
      message: "Invitation completion processed successfully",
      backgroundCheckId: updatedCheck.id,
      userVerified: !!backgroundCheck.candidateUserId
    };

  } catch (error) {
    console.error("[Checkr Webhook] ❌ Error handling invitation completion:", error);
    throw error;
  }
}

async function handleReportCompleted(data: any) {
  try {
    console.log("[Checkr Webhook] 🔍 Processing report completion for report:", data.id);

    // Find the background check record by report ID or candidate ID
    const backgroundCheck = await findBackgroundCheckRecord(data);

    if (!backgroundCheck) {
      console.error("[Checkr Webhook] ❌ Background check record not found for report:", data.id);
      return { success: false, message: "Background check record not found" };
    }

    console.log("[Checkr Webhook] ✅ Found background check record:", backgroundCheck.id);

    // Check if already completed
    if (backgroundCheck.status === 'COMPLETED') {
      console.log("[Checkr Webhook] ℹ️ Background check already marked as completed");
      return { success: true, message: "Already completed" };
    }

    // Update background check status with report details
    const updatedCheck = await prisma.background_checks.update({
      where: { id: backgroundCheck.id },
      data: {
        status: "COMPLETED",
        updatedAt: new Date(),
        completedAt: new Date(data.completed_at || new Date()),
        checkrStatus: data.result || data.status || "clear",
        reportId: data.id
      }
    });

    console.log("[Checkr Webhook] ✅ Background check updated with report completion");

    // Update user verification status
    if (backgroundCheck.candidateUserId) {
      await prisma.user.update({
        where: { id: backgroundCheck.candidateUserId },
        data: { isVerified: true }
      });

      console.log("[Checkr Webhook] ✅ User verification updated for user:", backgroundCheck.candidateUserId);
    }

    return { 
      success: true, 
      message: "Report completion processed successfully",
      backgroundCheckId: updatedCheck.id,
      reportResult: data.result || data.status
    };

  } catch (error) {
    console.error("[Checkr Webhook] ❌ Error handling report completion:", error);
    throw error;
  }
}

async function handleBackgroundCheckCanceled(data: any) {
  try {
    console.log("[Checkr Webhook] 🔍 Processing cancellation for:", data.id);

    const backgroundCheck = await findBackgroundCheckRecord(data);

    if (backgroundCheck) {
      await prisma.background_checks.update({
        where: { id: backgroundCheck.id },
        data: {
          status: "DECLINED",
          updatedAt: new Date(),
          checkrStatus: "cancelled"
        }
      });

      console.log("[Checkr Webhook] ✅ Background check marked as DECLINED");
      return { success: true, message: "Cancellation processed successfully" };
    } else {
      console.warn("[Checkr Webhook] ⚠️ Background check record not found for cancellation");
      return { success: true, message: "Record not found but acknowledged" };
    }

  } catch (error) {
    console.error("[Checkr Webhook] ❌ Error handling cancellation:", error);
    throw error;
  }
}

async function handleBackgroundCheckExpired(data: any) {
  try {
    console.log("[Checkr Webhook] 🔍 Processing expiration for:", data.id);

    const backgroundCheck = await findBackgroundCheckRecord(data);

    if (backgroundCheck) {
      await prisma.background_checks.update({
        where: { id: backgroundCheck.id },
        data: {
          status: "EXPIRED",
          updatedAt: new Date(),
          checkrStatus: "expired"
        }
      });

      console.log("[Checkr Webhook] ✅ Background check marked as EXPIRED");
      return { success: true, message: "Expiration processed successfully" };
    } else {
      console.warn("[Checkr Webhook] ⚠️ Background check record not found for expiration");
      return { success: true, message: "Record not found but acknowledged" };
    }

  } catch (error) {
    console.error("[Checkr Webhook] ❌ Error handling expiration:", error);
    throw error;
  }
}

async function handleReportDisputed(data: any) {
  try {
    console.log("[Checkr Webhook] 🔍 Processing dispute for report:", data.id);

    const backgroundCheck = await findBackgroundCheckRecord(data);

    if (backgroundCheck) {
      await prisma.background_checks.update({
        where: { id: backgroundCheck.id },
        data: {
          status: "DISPUTE",
          updatedAt: new Date(),
          checkrStatus: "disputed"
        }
      });

      console.log("[Checkr Webhook] ✅ Background check marked as DISPUTE");
      return { success: true, message: "Dispute processed successfully" };
    } else {
      console.warn("[Checkr Webhook] ⚠️ Background check record not found for dispute");
      return { success: true, message: "Record not found but acknowledged" };
    }

  } catch (error) {
    console.error("[Checkr Webhook] ❌ Error handling dispute:", error);
    throw error;
  }
}

async function findBackgroundCheckRecord(data: any) {
  try {
    // Try multiple strategies to find the background check record
    const searchCriteria = [];
    
    // Strategy 1: Match by invitation ID
    if (data.id && data.object === 'invitation') {
      searchCriteria.push({ invitationId: data.id });
    }
    
    // Strategy 2: Match by report ID
    if (data.id && data.object === 'report') {
      searchCriteria.push({ reportId: data.id });
    }
    
    // Strategy 3: Match by candidate ID
    if (data.candidate_id || data.candidate?.id) {
      const candidateId = data.candidate_id || data.candidate?.id;
      searchCriteria.push({ candidateId: candidateId });
    }
    
    // Strategy 4: Match by invitation ID from nested data
    if (data.invitation?.id) {
      searchCriteria.push({ invitationId: data.invitation.id });
    }

    console.log("[Checkr Webhook] 🔍 Searching with criteria:", searchCriteria);

    if (searchCriteria.length === 0) {
      console.error("[Checkr Webhook] ❌ No valid search criteria found in webhook data");
      return null;
    }

    // Try each search strategy
    for (const criteria of searchCriteria) {
      const result = await prisma.background_checks.findFirst({
        where: criteria
      });
      
      if (result) {
        console.log("[Checkr Webhook] ✅ Found record using criteria:", criteria);
        return result;
      }
    }

    // If no direct match, try OR query
    const result = await prisma.background_checks.findFirst({
      where: { OR: searchCriteria }
    });

    if (result) {
      console.log("[Checkr Webhook] ✅ Found record using OR query");
    } else {
      console.error("[Checkr Webhook] ❌ No background check record found with any criteria");
    }

    return result;

  } catch (error) {
    console.error("[Checkr Webhook] ❌ Error finding background check record:", error);
    return null;
  }
} 