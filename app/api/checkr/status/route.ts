import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  try {
    // Check environment variables
    const checkrApiKey = process.env.CHECKR_API_KEY;
    const databaseUrl = process.env.DATABASE_URL;
    
    // Check authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    return NextResponse.json({
      success: true,
      environment: {
        hasCheckrApiKey: !!checkrApiKey,
        checkrApiKeyLength: checkrApiKey?.length || 0,
        hasDatabaseUrl: !!databaseUrl,
        nodeEnv: process.env.NODE_ENV
      },
      auth: {
        isAuthenticated: !!user,
        userEmail: user?.email || "No user",
        userId: user?.id || "No user ID"
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 