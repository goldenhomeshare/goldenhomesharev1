import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../../../lib/db";
import { z } from "zod";

const createAgreementSchema = z.object({
  applicationId: z.string(),
  agreementData: z.any(), // Agreement form data
});

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, agreementData } = createAgreementSchema.parse(body);

    // Verify the application exists and belongs to the user
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        product: true,
        housemate: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.product.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized - not your application" }, { status: 403 });
    }

    if (application.status !== "APPROVED") {
      return NextResponse.json({ error: "Application must be approved first" }, { status: 400 });
    }

    // Check if agreement already exists
    const existingAgreement = await prisma.agreement.findUnique({
      where: { applicationId },
    });

    if (existingAgreement) {
      return NextResponse.json({ 
        error: "Agreement already exists for this application",
        agreementId: existingAgreement.id,
        existingAgreement: existingAgreement
      }, { status: 409 }); // 409 Conflict is more appropriate than 400
    }

    // Create the agreement
    const agreement = await prisma.agreement.create({
      data: {
        applicationId,
        agreementData,
        status: "PENDING_HOMEOWNER",
        homeownerSigned: false,
        housemateSigned: false,
      },
    });

    return NextResponse.json({
      success: true,
      agreementId: agreement.id,
      agreement,
      message: "Agreement created successfully",
    });

  } catch (error) {
    console.error("Error creating agreement:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create agreement", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 