import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { checkr } from "@/app/lib/checkr";
import { z } from "zod";
import crypto from "crypto";

const initiateBackgroundCheckSchema = z.object({
  package: z.string().optional().default("basic_plus_criminal"),
  flow: z.enum(["hosted", "embedded"]).optional().default("hosted"),
});

export async function POST(request: NextRequest) {
  try {
    console.log("[Background Check] Starting background check initiation...");

    // Check if Checkr is properly configured
    if (!process.env.CHECKR_API_KEY) {
      console.error("CHECKR_API_KEY environment variable is not set");
      return NextResponse.json({ 
        error: "Background check service is not configured. Please contact support." 
      }, { status: 500 });
    }

    console.log("[Background Check] Environment variables check passed");

    // Log Checkr environment info safely
    try {
      const env = checkr.getEnvironment();
      console.log("[Background Check] Checkr Environment:", env);
    } catch (envError) {
      console.warn("[Background Check] Could not get Checkr environment info:", envError);
    }

    const user = await getCurrentUser();

    if (!user) {
      console.log("User not authenticated - no session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User authenticated:", {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      hasId: !!user.id,
      hasEmail: !!user.email
    });

    const body = await request.json();
    const validatedData = initiateBackgroundCheckSchema.parse(body);

    console.log("[Background Check] Request validated:", validatedData);

    // Check if user already has a background check in progress
    try {
      console.log("[Background Check] Checking for existing background checks...");
      console.log("[Background Check] Using candidateEmail:", user.email, "and candidateUserId:", user.id);
      
      // First check by candidateUserId
      let existingCheck = await prisma.background_checks.findFirst({
        where: { 
          candidateUserId: user.id,
          status: { in: ["PENDING", "IN_PROGRESS"] }
        },
      });

      // If not found by user ID, check by email
      if (!existingCheck) {
        existingCheck = await prisma.background_checks.findFirst({
          where: { 
            candidateEmail: user.email,
            status: { in: ["PENDING", "IN_PROGRESS"] }
          },
        });

        // If found by email but candidateUserId is null, fix it
        if (existingCheck && !existingCheck.candidateUserId) {
          console.log("[Background Check] Fixing candidateUserId for existing check:", existingCheck.id);
          await prisma.background_checks.update({
            where: { id: existingCheck.id },
            data: { candidateUserId: user.id }
          });
        }
      }

      console.log("[Background Check] Existing check result:", existingCheck ? "Found" : "None");

      if (existingCheck && (existingCheck.status === "PENDING" || existingCheck.status === "IN_PROGRESS")) {
        return NextResponse.json({
          message: "Background check already in progress",
          invitationId: existingCheck.invitationId,
          invitationUrl: existingCheck.invitationUrl,
          status: existingCheck.status,
          flow: validatedData.flow,
        });
      }
    } catch (dbError) {
      console.error("[Background Check] Database check failed:", dbError);
      
      // If the table doesn't exist, continue without database check
      if (dbError instanceof Error && dbError.message.includes("does not exist")) {
        console.log("[Background Check] Background checks table does not exist yet - continuing without check");
      } else {
        console.log("[Background Check] Continuing without database check...");
      }
    }

    // Check if user already has a completed verification
    try {
      console.log("[Background Check] Checking if user is already verified...");
      const userRecord = await prisma.user.findUnique({
        where: { id: user.id },
        select: { isVerified: true }
      });

      // Removed the check that prevents verified users from initiating new background checks
      // Users should be able to initiate new background checks even when already verified
      
    } catch (userCheckError) {
      console.error("[Background Check] Error checking user verification status:", userCheckError);
      return NextResponse.json({ 
        error: "Database configuration error. Please contact support.",
        details: userCheckError instanceof Error ? userCheckError.message : "Unknown database error"
      }, { status: 500 });
    }

    try {
      console.log("[Background Check] Creating Checkr invitation...");

      // Get the current URL for redirect (for hosted flow)
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      const host = request.headers.get('host') || 'localhost:3000';
      const redirectUrl = `${protocol}://${host}/background-check/callback`;

      console.log("[Background Check] Redirect URL:", redirectUrl);

      // Step 1: Create Checkr Candidate first
      console.log("[Background Check] Creating Checkr candidate...");
      const candidatePayload = {
        email: user.email,
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        // phone: user.phone || undefined, // Add if available
        // zipcode: user.zipcode || undefined, // Add if available
      };

      console.log("[Background Check] Creating candidate with payload:", candidatePayload);
      const candidate = await checkr.createCandidate(candidatePayload);
      console.log("[Background Check] Checkr candidate created:", candidate.id);

      // Step 2: Get available packages to ensure we use a valid one
      console.log("[Background Check] Fetching available packages...");
      let packageToUse = validatedData.package;
      
      try {
        const packages = await checkr.getPackages();
        const availablePackages = packages.data || packages;
        console.log("[Background Check] Available packages found:", availablePackages?.length || 0);
        
        // Use the first available package if the requested one doesn't exist
        if (Array.isArray(availablePackages) && availablePackages.length > 0) {
          const validPackage = availablePackages.find((pkg: any) => pkg.slug === validatedData.package);
          if (!validPackage) {
            packageToUse = availablePackages[0].slug;
            console.log(`[Background Check] Package '${validatedData.package}' not found, using '${packageToUse}' instead`);
          }
        }
      } catch (packageError) {
        console.warn("[Background Check] Could not fetch packages, proceeding with default:", packageError);
        // Try common package name variations based on the Checkr dashboard
        const packageVariations = [
          "basic_plus_criminal",
          "basic-plus-criminal", 
          "basicpluscriminal",
          "basic_criminal",
          "criminal_check",
          "basic_plus",
        ];
        packageToUse = packageVariations[0];
        console.log("[Background Check] Using fallback package:", packageToUse);
      }

      // Step 3: Create Checkr invitation using the candidate ID
      const invitationPayload = {
        candidate_id: candidate.id,
        package: packageToUse,
        // flow: validatedData.flow, // Remove flow - not needed for basic invitations
        // redirect_url: validatedData.flow === "hosted" ? redirectUrl : undefined, // Remove for now
        work_locations: [
          {
            country: "US",
            state: "CA", // Default state, can be made dynamic
          }
        ]
      };

      console.log("[Background Check] Creating invitation with payload:", invitationPayload);

      const invitation = await checkr.createInvitation(invitationPayload);

      console.log("Checkr invitation created:", invitation.id);

      // Store background check record
      try {
        console.log("[Background Check] Saving to database...");
        
        const backgroundCheckData = {
          id: crypto.randomUUID(),
          candidateId: invitation.candidate?.id || "",
          invitationId: invitation.id,
          candidateEmail: user.email,
          candidateName: `${user.firstName || ""} ${user.lastName || ""}`,
          invitationUrl: invitation.invitation_url,
          invitationStatus: invitation.status,
          status: "PENDING" as const,
          candidateUserId: user.id,
          requestedById: user.id,
          invitationSentAt: new Date(),
          updatedAt: new Date(),
        };

        console.log("[Background Check] Database save data:", {
          ...backgroundCheckData,
          candidateId: backgroundCheckData.candidateId.substring(0, 8) + "...",
          invitationId: backgroundCheckData.invitationId.substring(0, 8) + "..."
        });

        // TEMPORARILY COMMENT OUT DATABASE SAVE FOR TESTING
        console.log("[Background Check] SAVING TO DATABASE...");
        
        const savedCheck = await prisma.background_checks.create({
          data: backgroundCheckData,
        });

        console.log("[Background Check] Background check record saved:", savedCheck.id);
      } catch (saveError) {
        console.error("[Background Check] Failed to save background check record:", saveError);
        // Continue without saving for now
        console.log("[Background Check] Continuing without database save...");
      }

      return NextResponse.json({
        success: true,
        message: "Background check invitation created successfully",
        invitationId: invitation.id,
        invitationUrl: invitation.invitation_url,
        embedUrl: validatedData.flow === "embedded" ? invitation.invitation_url : undefined,
        redirectUrl: validatedData.flow === "hosted" ? invitation.invitation_url : undefined,
        status: "pending",
        flow: validatedData.flow,
        environment: "staging", // Hardcode for now
      });

    } catch (error) {
      console.error("Error creating Checkr invitation:", error);
      
      // More specific error handling
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        
        if (error.message.includes("CHECKR_API_KEY")) {
          return NextResponse.json({ 
            error: "Background check service configuration error. Please contact support." 
          }, { status: 500 });
        }
        
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          return NextResponse.json({ 
            error: "Invalid Checkr API credentials. Please contact support." 
          }, { status: 500 });
        }
        
        if (error.message.includes("network") || error.message.includes("fetch")) {
          return NextResponse.json({ 
            error: "Unable to connect to background check service. Please try again." 
          }, { status: 503 });
        }
      }
      
      return NextResponse.json({ 
        error: "Failed to create background check invitation. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in background check initiation:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 