import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cleanupOrphanedChatRooms } from "@/lib/database-utils";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow admin users to run cleanup
    const userType = (user as any).userType;
    if (userType !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const result = await cleanupOrphanedChatRooms();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error during cleanup:", error);
    return NextResponse.json(
      { error: "Failed to cleanup database" },
      { status: 500 }
    );
  }
} 