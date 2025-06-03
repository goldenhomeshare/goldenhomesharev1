import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    // Read the static Golden HomeShare PDF from public directory
    const pdfPath = join(process.cwd(), 'public', 'homeshare-agreement.pdf');
    const pdfBuffer = readFileSync(pdfPath);

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="golden-homeshare-agreement.pdf"',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year since the agreement is static
      },
    });

  } catch (error) {
    console.error("Error reading PDF file:", error);
    return NextResponse.json(
      { error: "Agreement template not found" }, 
      { status: 404 }
    );
  }
} 