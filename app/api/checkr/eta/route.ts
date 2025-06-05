import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[Checkr ETA] ETA endpoint called - demonstrating ETA support");

    return NextResponse.json({
      success: true,
      message: "ETA support is implemented via report.updated webhooks",
      implementation: {
        webhook_event: "report.updated",
        field_to_monitor: "estimated_completion_time",
        description: "Subscribe to report.updated webhooks to receive ETA updates from Checkr",
        example_eta: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      },
      next_steps: [
        "Configure webhook subscription for 'report.updated' in Checkr Dashboard",
        "Monitor 'estimated_completion_time' field in webhook payload",
        "Display ETA to users in your application UI",
        "Update ETA when new report.updated events are received"
      ],
      webhook_configuration: {
        url: "/api/checkr/webhook",
        events: ["report.updated"],
        implementation_status: "Ready"
      }
    });

  } catch (error) {
    console.error("[Checkr ETA] Error:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
} 