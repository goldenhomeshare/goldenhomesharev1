import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkr, CheckrAPIError, createDefaultWorkLocations } from "@/app/lib/checkr";
import { backgroundCheckService } from "@/app/lib/background-check-service";
import { z } from "zod";

const initiateBackgroundCheckSchema = z.object({
  package: z.string().optional().default("basic_plus_criminal"),
  includeDocuments: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    console.log("[Checkr Initiate] Starting background check initiation...");

    const user = await getCurrentUser();
    if (!user) {
      console.log("[Checkr Initiate] User not authenticated");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Checkr Initiate] User authenticated:", {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Validate request
    const body = await request.json();
    const { package: packageName, includeDocuments } = initiateBackgroundCheckSchema.parse(body);

    console.log("[Checkr Initiate] Request validated:", { packageName, includeDocuments });

    // Check if user already has a recent background check
    const existingCheck = await backgroundCheckService.findByEmail(user.email);
    if (existingCheck && ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CLEAR'].includes(existingCheck.status)) {
      console.log("[Checkr Initiate] Existing background check found:", existingCheck.status);
      return NextResponse.json({
        success: true,
        message: "Background check already exists",
        invitationId: existingCheck.invitationId,
        invitationUrl: existingCheck.invitationUrl,
        status: existingCheck.status,
        candidateId: existingCheck.candidateId,
      });
    }

    // Check if user is already verified
    const { isVerified } = await backgroundCheckService.getUserVerificationStatus(user.id);
    if (isVerified) {
      console.log("[Checkr Initiate] User is already verified");
      return NextResponse.json({ 
        error: "Background check already completed successfully" 
      }, { status: 400 });
    }

    // Validate required user data
    const validation = await backgroundCheckService.validateUserForBackgroundCheck(user.id);
    if (!validation.isValid) {
      console.log("[Checkr Initiate] User validation failed:", validation.missingFields);
      return NextResponse.json({
        error: "Missing required user information. Please complete your profile first.",
        missingFields: validation.missingFields,
      }, { status: 400 });
    }

    console.log("[Checkr Initiate] Creating Checkr candidate...");

    // Create Checkr candidate based on API documentation requirements
    const candidateData = {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      copy_requested: true, // User gets a copy as per Checkr docs
      custom_id: user.id, // REQUIRED: Unique ID for cross-reference
      work_locations: createDefaultWorkLocations(),
    };

    console.log("[Checkr Initiate] Candidate data prepared:", {
      email: candidateData.email,
      first_name: candidateData.first_name,
      last_name: candidateData.last_name,
      custom_id: candidateData.custom_id,
      work_locations: candidateData.work_locations,
    });

    // Generate idempotency key to prevent duplicate candidates (RECOMMENDED)
    const idempotencyKey = `candidate-${user.id}-${Date.now()}`;
    const candidateHeaders = {
      'Idempotency-Key': idempotencyKey,
    };

    const candidate = await checkr.createCandidate(candidateData, candidateHeaders);
    console.log("[Checkr Initiate] Checkr candidate created:", candidate.id);

    // Get available packages and validate requested package
    let validatedPackage = packageName;
    let validatedNode: string | undefined;
    
    try {
      console.log("[Checkr Initiate] Fetching available packages...");
      const packages = await checkr.getPackages();
      const availablePackages = packages.data || [];
      
      // Also check for account hierarchy nodes
      let availableNodes: any[] = [];
      try {
        console.log("[Checkr Initiate] Checking for account hierarchy nodes...");
        const nodes = await checkr.getNodes();
        availableNodes = nodes.data || [];
        console.log(`[Checkr Initiate] Found ${availableNodes.length} account hierarchy nodes`);
      } catch (nodeError) {
        if (nodeError instanceof Error && nodeError.message.includes('403')) {
          console.log("[Checkr Initiate] Account hierarchy not configured (this is normal for many accounts)");
        } else {
          console.log("[Checkr Initiate] Error fetching nodes:", nodeError);
        }
      }
      
      if (Array.isArray(availablePackages) && availablePackages.length > 0) {
        const packageExists = availablePackages.some((pkg: any) => pkg.slug === packageName);
        if (!packageExists) {
          validatedPackage = availablePackages[0].slug;
          console.warn(`[Checkr Initiate] Package '${packageName}' not found, using '${validatedPackage}'`);
        } else {
          console.log(`[Checkr Initiate] Package '${packageName}' validated successfully`);
        }
        
        // If we have nodes, validate node and package assignment
        if (availableNodes.length > 0) {
          // For now, use the first available node if any exist
          // In a real implementation, this would come from user selection
          const firstNode = availableNodes[0];
          if (firstNode) {
            validatedNode = firstNode.id;
            console.log(`[Checkr Initiate] Using node: ${validatedNode}`);
            
            // Check if the package is assigned to this node
            const nodePackages = firstNode.packages || [];
            if (nodePackages.length > 0) {
              const packageAssignedToNode = nodePackages.some((p: any) => p.slug === validatedPackage);
              if (!packageAssignedToNode) {
                // Use the first package assigned to this node
                validatedPackage = nodePackages[0].slug;
                console.log(`[Checkr Initiate] Package not assigned to node, using node's first package: ${validatedPackage}`);
              }
            }
          }
        }
      }
    } catch (packageError) {
      console.warn("[Checkr Initiate] Could not validate package, proceeding with requested package:", packageError);
    }

    console.log("[Checkr Initiate] Creating invitation...");

    // Create invitation based on Checkr API documentation
    const invitationData: any = {
      candidate_id: candidate.id,
      package: validatedPackage,
      work_locations: createDefaultWorkLocations(),
    };

    // Add node if we have one (required for account hierarchy support)
    if (validatedNode) {
      invitationData.node = validatedNode;
      console.log("[Checkr Initiate] Adding node to invitation:", validatedNode);
    }

    console.log("[Checkr Initiate] Invitation data prepared:", invitationData);

    const invitation = await checkr.createInvitation(invitationData);
    console.log("[Checkr Initiate] Checkr invitation created:", invitation.id);

    // Save to database using the service layer
    console.log("[Checkr Initiate] Saving background check record...");
    const backgroundCheck = await backgroundCheckService.createBackgroundCheck({
      candidateId: candidate.id,
      invitationId: invitation.id,
      candidateUserId: user.id,
      candidateEmail: user.email,
      candidateName: `${user.firstName} ${user.lastName}`,
      invitationUrl: invitation.invitation_url,
      packageName: validatedPackage,
    });

    console.log("[Checkr Initiate] Background check record saved:", backgroundCheck.id);

    return NextResponse.json({
      success: true,
      message: "Background check invitation created successfully",
      invitationId: invitation.id,
      invitationUrl: invitation.invitation_url,
      status: "pending",
      candidateId: candidate.id,
      backgroundCheckId: backgroundCheck.id,
      environment: checkr.getEnvironment().isStaging ? "staging" : "production",
    });

  } catch (error) {
    console.error("[Checkr Initiate] Error creating background check:", error);

    if (error instanceof CheckrAPIError) {
      if (error.isAuthenticationError()) {
        return NextResponse.json({ 
          error: "Background check service authentication failed. Please contact support." 
        }, { status: 500 });
      }
      
      if (error.isValidationError()) {
        return NextResponse.json({ 
          error: `Invalid data provided: ${error.message}`,
          details: error.param ? `Field: ${error.param}` : undefined,
        }, { status: 400 });
      }
      
      if (error.isRateLimitError()) {
        return NextResponse.json({ 
          error: "Too many requests. Please try again later." 
        }, { status: 429 });
      }

      // Generic Checkr API error
      return NextResponse.json({ 
        error: "Background check service error. Please try again.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }, { status: 500 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid request data",
        details: error.errors,
      }, { status: 400 });
    }

    // Generic error
    return NextResponse.json({ 
      error: "Failed to create background check invitation. Please try again.",
      details: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : undefined
    }, { status: 500 });
  }
} 