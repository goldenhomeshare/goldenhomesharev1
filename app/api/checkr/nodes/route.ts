import { NextResponse } from "next/server";
import { checkr, CheckrAPIError } from "@/app/lib/checkr";

export async function GET() {
  try {
    console.log("[Checkr Nodes] Fetching account hierarchy nodes...");

    const nodes = await checkr.getNodes();
    
    console.log(`[Checkr Nodes] Successfully fetched ${nodes.data?.length || 0} nodes`);

    return NextResponse.json({
      success: true,
      nodes: nodes.data || [],
      message: `Found ${nodes.data?.length || 0} account hierarchy nodes`,
      environment: checkr.getEnvironment(),
      account_hierarchy_enabled: true,
    });

  } catch (error) {
    console.error("[Checkr Nodes] Error fetching nodes:", error);
    
    // Handle 403 error specifically - this means account hierarchy is not configured
    if (error instanceof CheckrAPIError && error.statusCode === 403) {
      console.log("[Checkr Nodes] Account hierarchy not configured for this account (expected)");
      
      return NextResponse.json({
        success: true,
        nodes: [],
        message: "Account hierarchy not configured for this account",
        environment: checkr.getEnvironment(),
        account_hierarchy_enabled: false,
        note: "This is normal - account hierarchy is only required if your Checkr account has nodes configured"
      });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.stack : undefined)
        : undefined
    }, { status: 500 });
  }
} 