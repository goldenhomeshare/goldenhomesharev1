import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../../../lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId } = await params;

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
        housemateId: user.id,
        status: "APPROVED",
      },
      include: {
        product: {
          include: {
            User: {
              include: {
                homeownerProfile: true,
              },
            },
          },
        },
        agreement: true,
        Subscription: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or you don't have access to it" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);

  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application details" },
      { status: 500 }
    );
  }
} 