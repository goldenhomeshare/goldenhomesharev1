import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { AgreementFormData } from "@/components/FillableAgreementForm";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData: AgreementFormData = await request.json();

    // Validate required fields
    const requiredFields = ['hostName', 'seekerName', 'propertyAddress', 'monthlyAmount', 'moveInDate'];
    for (const field of requiredFields) {
      if (!formData[field as keyof AgreementFormData]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // This endpoint is deprecated since email fields were removed from the form
    return NextResponse.json({ 
      error: "Email functionality not available - contact information fields have been removed from the agreement form. Please use the generate-complete or generate-filled endpoints for PDF generation." 
    }, { status: 410 });

  } catch (error) {
    console.error("Error in deprecated send-filled endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
} 