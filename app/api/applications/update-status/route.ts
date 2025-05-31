import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../../../lib/db";
import { z } from "zod";

const updateStatusSchema = z.object({
  applicationId: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, status } = updateStatusSchema.parse(body);

    // First, check if the application exists and belongs to a property owned by the current user
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        product: true,
        housemate: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.product.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized to update this application" }, { status: 403 });
    }

    // Update the application status
    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        housemate: true,
        product: true,
      },
    });

    // TODO: Send notification email to the housemate
    // This would integrate with your email service (e.g., Resend)
    
    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });

  } catch (error) {
    console.error("Error updating application status:", error);
    
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