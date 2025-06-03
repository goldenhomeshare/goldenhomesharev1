import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { readFileSync } from "fs";
import { join } from "path";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
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

    // TODO: Add authorization check and fetch actual user/agreement data
    // For now, we'll use the authenticated user's email and a placeholder recipient
    
    try {
      // Read the static Golden HomeShare PDF from public directory
      const pdfPath = join(process.cwd(), 'public', 'homeshare-agreement.pdf');
      const pdfBuffer = readFileSync(pdfPath);

      // In production, you would fetch these from your database based on the agreementId
      const agreementNumber = agreementId.slice(-8).toUpperCase();
      const userEmail = user.email || "user@example.com";
      const userName = user.given_name && user.family_name 
        ? `${user.given_name} ${user.family_name}` 
        : user.email;

      // Send email with PDF attachment
      await resend.emails.send({
        from: "agreements@goldenhomeshare.com", // Update with your verified domain
        to: [userEmail], // In production, send to both host and seeker
        subject: `Golden HomeShare Agreement #${agreementNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your Golden HomeShare Agreement is Ready</h2>
            
            <p>Hello ${userName},</p>
            
            <p>Your Golden HomeShare agreement has been generated and is attached to this email as a PDF document.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Agreement Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Agreement Number:</strong> #${agreementNumber}</li>
                <li><strong>Generated:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>
            
            <p>Please review the agreement carefully and keep this document for your records.</p>
            
            <p>The agreement contains legally binding terms for your homesharing arrangement. Please ensure both parties understand and agree to all terms before proceeding.</p>
            
            <p>If you have any questions about the agreement, please don't hesitate to contact us at support@goldenhomeshare.com or (816) 433-2979.</p>
            
            <p>Best regards,<br>
            The Golden HomeShare Team</p>
          </div>
        `,
        attachments: [
          {
            filename: `golden-homeshare-agreement-${agreementNumber}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      return NextResponse.json({ 
        success: true, 
        message: "Agreement sent successfully" 
      });

    } catch (fileError) {
      console.error("Error reading PDF file:", fileError);
      return NextResponse.json(
        { error: "Agreement template not found" }, 
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" }, 
      { status: 500 }
    );
  }
}

// TODO: Implement this function to fetch agreement and user data from database
async function fetchAgreementData(agreementId: string, userId: string) {
  // This function should fetch the agreement details and involved parties
  // from your database based on the agreementId
  
  /*
  Example implementation:
  
  const agreement = await prisma.booking.findFirst({
    where: {
      id: agreementId,
      OR: [
        { listing: { userId: userId } }, // User is the host
        { userId: userId } // User is the seeker
      ]
    },
    include: {
      listing: {
        include: {
          user: true // Host information
        }
      },
      user: true // Seeker information
    }
  });

  if (!agreement) {
    return null;
  }

  return {
    agreementNumber: agreement.id.slice(-8).toUpperCase(),
    hostEmail: agreement.listing.user.email,
    hostName: agreement.listing.user.firstName + " " + agreement.listing.user.lastName,
    seekerEmail: agreement.user.email,
    seekerName: agreement.user.firstName + " " + agreement.user.lastName,
    propertyAddress: agreement.listing.location,
    // ... other relevant data
  };
  */
  
  return null;
} 