import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";

// Schema for validating the signup lead data
const SignupLeadSchema = z.object({
  // Contact Information
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  
  // Demographics
  dateOfBirth: z.string().optional(),
  language: z.string().optional(),
  gender: z.string().optional(),
  
  // Location
  city: z.string().optional(),
  state: z.string().optional(),
  
  // Budget
  maxBudget: z.number().optional(),
  
  // Profile Picture
  profilePicture: z.string().optional(),
  
  // Education & Occupation
  educationLevel: z.string().optional(),
  educationProgram: z.string().optional(),
  stillAttending: z.boolean().optional(),
  isRetired: z.boolean().optional(),
  occupation: z.string().optional(),
  
  // Lifestyle
  schedule: z.string().optional(),
  socialPreference: z.string().optional(),
  hobbies: z.array(z.string()).optional(),
  hasPets: z.boolean().optional(),
  petDescription: z.string().optional(),
  numberOfPeople: z.string().optional(),
  smokingStatus: z.string().optional(),
  guestPolicy: z.string().optional(),
  
  // Match Preferences
  preferredGender: z.string().optional(),
  canHelpWith: z.array(z.string()).optional(),
  
  // Bio
  bio: z.string().optional(),
  
  // Tracking
  lastCompletedStep: z.number(),
  sessionId: z.string().optional(),
  
  // Campaign metadata
  source: z.string().optional(),
  campaign: z.string().optional(),
  medium: z.string().optional(),
  referrer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    const body = await request.json();
    const validatedData = SignupLeadSchema.parse(body);

    // Get client info for campaign tracking
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0] || request.headers.get("x-real-ip") || undefined;

    // Prepare data for database
    const leadData = {
      userId: user?.id || null,
      sessionId: validatedData.sessionId || null,
      
      // Contact Information
      firstName: validatedData.firstName || null,
      lastName: validatedData.lastName || null,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      
      // Demographics
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
      language: validatedData.language || null,
      gender: validatedData.gender || null,
      
      // Location
      city: validatedData.city || null,
      state: validatedData.state || null,
      
      // Budget
      maxBudget: validatedData.maxBudget || null,
      
      // Profile Picture
      profilePicture: validatedData.profilePicture || null,
      
      // Education & Occupation
      educationLevel: validatedData.educationLevel || null,
      educationProgram: validatedData.educationProgram || null,
      stillAttending: validatedData.stillAttending || null,
      isRetired: validatedData.isRetired || null,
      occupation: validatedData.occupation || null,
      
      // Lifestyle
      schedule: validatedData.schedule || null,
      socialPreference: validatedData.socialPreference || null,
      hobbies: validatedData.hobbies || undefined,
      hasPets: validatedData.hasPets || null,
      petDescription: validatedData.petDescription || null,
      numberOfPeople: validatedData.numberOfPeople || null,
      smokingStatus: validatedData.smokingStatus || null,
      guestPolicy: validatedData.guestPolicy || null,
      
      // Match Preferences
      preferredGender: validatedData.preferredGender || null,
      canHelpWith: validatedData.canHelpWith || undefined,
      
      // Bio
      bio: validatedData.bio || null,
      
      // Tracking
      lastCompletedStep: validatedData.lastCompletedStep,
      
      // Campaign metadata
      source: validatedData.source || null,
      campaign: validatedData.campaign || null,
      medium: validatedData.medium || null,
      referrer: validatedData.referrer || null,
      userAgent,
      ipAddress,
    };

    // Upsert the signup lead (create or update)
    const signupLead = await prisma.signupLead.upsert({
      where: user?.id 
        ? { userId: user.id }
        : { sessionId: validatedData.sessionId || "anonymous" },
      update: {
        ...leadData,
        updatedAt: new Date(),
      },
      create: leadData,
    });

    return NextResponse.json({ 
      success: true, 
      leadId: signupLead.id 
    });

  } catch (error) {
    console.error("Error saving signup lead:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid data format",
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to save signup data" 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user's signup lead if it exists
    const signupLead = await prisma.signupLead.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ 
      success: true, 
      lead: signupLead 
    });

  } catch (error) {
    console.error("Error fetching signup lead:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch signup data" 
      },
      { status: 500 }
    );
  }
} 