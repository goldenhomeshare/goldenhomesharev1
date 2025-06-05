import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../../../lib/db";
import { z } from "zod";

const signAgreementSchema = z.object({
  agreementId: z.string(),
  signature: z.string().min(1, "Signature is required"),
});

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { agreementId, signature } = signAgreementSchema.parse(body);

    // Find the agreement by ID
    const agreement = await prisma.agreement.findUnique({
      where: { id: agreementId },
      include: {
        application: {
          include: {
            product: {
              include: {
                User: true,
              },
            },
            housemate: true,
          },
        },
      },
    });

    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    // Verify the user is the housemate for this agreement
    if (agreement.application.housemate.id !== user.id) {
      return NextResponse.json({ error: "Unauthorized - not your agreement" }, { status: 403 });
    }

    // Verify the homeowner has signed first
    if (!agreement.homeownerSigned) {
      return NextResponse.json({ error: "Homeowner must sign the agreement first" }, { status: 400 });
    }

    if (agreement.housemateSigned) {
      return NextResponse.json({ error: "Agreement already signed by housemate" }, { status: 400 });
    }

    // Update the agreement with housemate signature
    const updatedAgreement = await prisma.agreement.update({
      where: { id: agreement.id },
      data: {
        housemateSigned: true,
        housemateSignedAt: new Date(),
        housemateSignature: signature,
        status: "COMPLETED",
      },
    });

    // TODO: Send notification to homeowner (email, etc.)
    console.log(`Agreement ${agreement.id} signed by housemate. Both parties have signed. Notify homeowner: ${agreement.application.product.User?.email}`);

    return NextResponse.json({
      success: true,
      agreement: updatedAgreement,
      message: "Agreement signed successfully",
    });

  } catch (error) {
    console.error("Error signing agreement:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to sign agreement", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 