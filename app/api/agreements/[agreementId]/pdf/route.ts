import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agreementId: string }> }
) {
  try {
    // Authenticate user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agreementId } = await params;

    // TODO: Add authorization check - verify user has access to this agreement
    // For now, we'll allow any authenticated user to access agreements
    // In production, you should check if the user is either the host or seeker for this agreement

    try {
      // Read the static Golden HomeShare PDF from public directory
      const pdfPath = join(process.cwd(), 'public', 'homeshare-agreement.pdf');
      const pdfBuffer = readFileSync(pdfPath);

      // Return the PDF with proper headers
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="golden-homeshare-agreement-${agreementId.slice(-8)}.pdf"`,
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year since the agreement is static
        },
      });

    } catch (fileError) {
      console.error("Error reading PDF file:", fileError);
      return NextResponse.json(
        { error: "Agreement template not found" }, 
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error("Error serving PDF:", error);
    return NextResponse.json(
      { error: "Failed to serve agreement" }, 
      { status: 500 }
    );
  }
}

// TODO: Implement authorization check
async function checkUserAgreementAccess(agreementId: string, userId: string): Promise<boolean> {
  // This function should verify that the user has access to this specific agreement
  // You'll need to implement this based on your database schema
  
  /*
  Example implementation:
  
  const agreement = await prisma.booking.findFirst({
    where: {
      id: agreementId,
      OR: [
        { listing: { userId: userId } }, // User is the host
        { userId: userId } // User is the seeker
      ]
    }
  });
  
  return !!agreement;
  */
  
  // For now, return true to allow access
  // In production, implement proper authorization
  return true;
} 