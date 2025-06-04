import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/app/lib/db";
import crypto from "crypto";

// Checkr webhook signature verification
function verifyCheckrSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Checkr Webhook] Received webhook request");

    const body = await request.text();
    const event = JSON.parse(body);

    console.log("[Checkr Webhook] Event type:", event.type);
    console.log("[Checkr Webhook] Event data:", JSON.stringify(event.data, null, 2));

    // Verify webhook signature if you have a webhook secret
    const webhookSecret = process.env.CHECKR_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('checkr-signature');
      if (signature) {
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(body)
          .digest('hex');
        
        if (signature !== expectedSignature) {
          console.error("[Checkr Webhook] Invalid signature");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      }
    }

    // Handle different event types
    switch (event.type) {
      case 'invitation.completed':
      case 'report.completed':
        await handleBackgroundCheckCompleted(event.data);
        break;
      
      case 'invitation.canceled':
      case 'report.canceled':
        await handleBackgroundCheckCanceled(event.data);
        break;
      
      case 'invitation.expired':
        await handleBackgroundCheckExpired(event.data);
        break;
      
      default:
        console.log(`[Checkr Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[Checkr Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleBackgroundCheckCompleted(data: any) {
  try {
    console.log("[Checkr Webhook] Processing background check completion");

    // Find the background check record
    const backgroundCheck = await prisma.backgroundCheck.findFirst({
      where: {
        OR: [
          { invitationId: data.id },
          { candidateId: data.candidate?.id }
        ]
      }
    });

    if (!backgroundCheck) {
      console.error("[Checkr Webhook] Background check record not found");
      return;
    }

    // Update background check status
    await prisma.backgroundCheck.update({
      where: { id: backgroundCheck.id },
      data: {
        status: "COMPLETED",
        updatedAt: new Date(),
        completedAt: new Date(),
        checkrStatus: data.status || "clear"
      }
    });

    // Update user verification status
    await prisma.user.update({
      where: { id: backgroundCheck.candidateUserId! },
      data: {
        isVerified: true
      }
    });

    console.log("[Checkr Webhook] User verified successfully:", backgroundCheck.candidateUserId);

  } catch (error) {
    console.error("[Checkr Webhook] Error handling completion:", error);
    throw error;
  }
}

async function handleBackgroundCheckCanceled(data: any) {
  try {
    console.log("[Checkr Webhook] Processing background check cancellation");

    const backgroundCheck = await prisma.backgroundCheck.findFirst({
      where: {
        OR: [
          { invitationId: data.id },
          { candidateId: data.candidate?.id }
        ]
      }
    });

    if (backgroundCheck) {
      await prisma.backgroundCheck.update({
        where: { id: backgroundCheck.id },
        data: {
          status: "DECLINED",
          updatedAt: new Date(),
        }
      });
    }

  } catch (error) {
    console.error("[Checkr Webhook] Error handling cancellation:", error);
    throw error;
  }
}

async function handleBackgroundCheckExpired(data: any) {
  try {
    console.log("[Checkr Webhook] Processing background check expiration");

    const backgroundCheck = await prisma.backgroundCheck.findFirst({
      where: {
        OR: [
          { invitationId: data.id },
          { candidateId: data.candidate?.id }
        ]
      }
    });

    if (backgroundCheck) {
      await prisma.backgroundCheck.update({
        where: { id: backgroundCheck.id },
        data: {
          status: "EXPIRED",
          updatedAt: new Date(),
        }
      });
    }

  } catch (error) {
    console.error("[Checkr Webhook] Error handling expiration:", error);
    throw error;
  }
} 