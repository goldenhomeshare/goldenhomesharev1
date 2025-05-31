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

    // TODO: Send notification email to the homeowner
    // This would integrate with your email service (e.g., Resend)
    
    return NextResponse.json({
      success: true,
      application,
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