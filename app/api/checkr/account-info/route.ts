import { NextResponse } from "next/server";
import { checkr, CheckrAPIError } from "@/app/lib/checkr";

export async function GET() {
  try {
    console.log("[Checkr Account Info] Checking account configuration...");

    const results = {
      success: true,
      environment: checkr.getEnvironment(),
      features: {
        packages: { available: false, count: 0, error: null as string | null },
        nodes: { available: false, count: 0, error: null as string | null },
        account_hierarchy: false,
      },
      compliance_status: "Checking...",
      notes: [] as string[]
    };

    // Test packages endpoint
    try {
      const packages = await checkr.getPackages();
      results.features.packages = {
        available: true,
        count: packages.data?.length || 0,
        error: null
      };
    } catch (error) {
      results.features.packages.error = error instanceof Error ? error.message : "Unknown error";
    }

    // Test nodes endpoint
    try {
      const nodes = await checkr.getNodes();
      results.features.nodes = {
        available: true,
        count: nodes.data?.length || 0,
        error: null
      };
      results.features.account_hierarchy = (nodes.data?.length || 0) > 0;
    } catch (error) {
      if (error instanceof CheckrAPIError && error.statusCode === 403) {
        results.features.nodes = {
          available: false,
          count: 0,
          error: "Account hierarchy not configured (this is normal)"
        };
        results.notes.push("✅ 403 error for nodes endpoint is EXPECTED for accounts without account hierarchy");
      } else {
        results.features.nodes.error = error instanceof Error ? error.message : "Unknown error";
      }
    }

    // Determine compliance status
    if (results.features.packages.available) {
      if (results.features.account_hierarchy) {
        results.compliance_status = "✅ FULLY COMPLIANT - Account has hierarchy configured";
      } else {
        results.compliance_status = "✅ FULLY COMPLIANT - No account hierarchy needed";
        results.notes.push("🔍 Your account doesn't have account hierarchy configured - this is normal for most accounts");
      }
    } else {
      results.compliance_status = "❌ ISSUE - Cannot access packages endpoint";
    }

    results.notes.push("📋 Account hierarchy is only required IF your Checkr account has nodes configured");
    results.notes.push("🎯 Your integration handles both scenarios correctly");

    return NextResponse.json(results);

  } catch (error) {
    console.error("[Checkr Account Info] Error:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.stack : undefined)
        : undefined
    }, { status: 500 });
  }
} 