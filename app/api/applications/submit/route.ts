import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../../../lib/db";
import { z } from "zod";

const submitApplicationSchema = z.object({
  productId: z.string(),
  message: z.string().optional(),
  moveInDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  moveOutDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
});

// Helper function to create/get chat room and send notification message
async function createApplicationChatNotification(
  housemateId: string,
  homeownerId: string,
  productId: string,
  housemateName: string,
  productName: string,
  applicationMessage?: string,
  moveInDate?: Date,
  moveOutDate?: Date
) {
  try {
    // Check if ANY chat room already exists between these users (unified approach)
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        homeownerId,
        housemateId,
      },
    });

    // Create chat room if it doesn't exist, or update existing one with current product context
    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          productId,
          homeownerId,
          housemateId,
        },
      });
    } else if (chatRoom.productId !== productId) {
      // Update existing chat room to reflect current product context
      await prisma.chatRoom.update({
        where: { id: chatRoom.id },
        data: { productId },
      });
    }

    // Format the notification message
    const dateOptions: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    };
    
    const moveInText = moveInDate ? moveInDate.toLocaleDateString('en-US', dateOptions) : 'Not specified';
    const moveOutText = moveOutDate ? moveOutDate.toLocaleDateString('en-US', dateOptions) : 'Not specified';
    
    let notificationMessage = `🏠 **New Application Received!**\n\n`;
    notificationMessage += `${housemateName} has applied to stay at ${productName}.\n\n`;
    notificationMessage += `**Move-in Date:** ${moveInText}\n`;
    notificationMessage += `**Move-out Date:** ${moveOutText}\n\n`;
    
    if (applicationMessage && applicationMessage.trim()) {
      notificationMessage += `**Their message:**\n"${applicationMessage.trim()}"\n\n`;
    }
    
    notificationMessage += `You can review their full application and profile in your dashboard. Feel free to reach out if you have any questions!`;

    // Send the notification message in the chat
    await prisma.message.create({
      data: {
        content: notificationMessage,
        senderId: housemateId, // Message appears to come from the housemate
        chatRoomId: chatRoom.id,
      },
    });

    console.log(`Application notification message sent to chat room ${chatRoom.id}`);
    return chatRoom;

  } catch (error) {
    console.error("Error creating application chat notification:", error);
    // Don't throw error here - we don't want to fail the application if chat creation fails
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, message, moveInDate, moveOutDate } = submitApplicationSchema.parse(body);

    // Validate that move-in date is provided
    if (!moveInDate) {
      return NextResponse.json({ error: "Move-in date is required" }, { status: 400 });
    }

    // Validate that move-in date is not in the past
    if (moveInDate < new Date()) {
      return NextResponse.json({ error: "Move-in date cannot be in the past" }, { status: 400 });
    }

    // Validate that move-out date is after move-in date if provided
    if (moveOutDate && moveOutDate <= moveInDate) {
      return NextResponse.json({ error: "Move-out date must be after move-in date" }, { status: 400 });
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        User: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Check if user is trying to apply to their own property
    if (product.userId === user.id) {
      return NextResponse.json({ error: "Cannot apply to your own property" }, { status: 400 });
    }

    // Check if the user has already applied to this property
    const existingApplication = await prisma.application.findUnique({
      where: {
        housemateId_productId: {
          housemateId: user.id,
          productId: productId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied to this property" }, { status: 400 });
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        housemateId: user.id,
        productId: productId,
        message: message || null,
        moveInDate,
        moveOutDate,
        status: "PENDING",
      },
      include: {
        housemate: true,
        product: {
          include: {
            User: true,
          },
        },
      },
    });

    // Create chat room and send notification message to homeowner
    const housemateName = `${user.given_name || 'Someone'} ${user.family_name || ''}`.trim();
    
    // Ensure product.userId is not null (it should be required in the database)
    if (!product.userId) {
      console.error("Product has no owner, cannot create chat");
    } else {
      await createApplicationChatNotification(
        user.id,
        product.userId,
        productId,
        housemateName,
        product.name || 'this property',
        message,
        moveInDate,
        moveOutDate
      );
    }

    // TODO: Send notification email to the homeowner
    // This would integrate with your email service (e.g., Resend)
    
    return NextResponse.json({
      success: true,
      application,
      message: "Application submitted successfully! A chat has been started with the homeowner.",
    });

  } catch (error) {
    console.error("Error submitting application:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 