import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Kinde session
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.email) {
      return NextResponse.json({
        debug: true,
        issue: 'No authenticated user found',
        user: null,
        timestamp: new Date().toISOString(),
      }, { status: 401 });
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    
    // Check user data completeness
    const userInfo = {
      id: user.id,
      email: user.email,
      firstName: user.given_name || '',
      lastName: user.family_name || '',
      hasFirstName: !!(user.given_name),
      hasLastName: !!(user.family_name),
    };

    // Check environment variables
    const envCheck = {
      hasCheckrApiKey: !!process.env.CHECKR_API_KEY,
      checkrApiEnabled: process.env.CHECKR_API_ENABLED === 'true',
      checkrBaseUrl: process.env.CHECKR_BASE_URL || 'not-set',
    };

    // Validate form data
    const formValidation = {
      hasFirstName: !!(body.firstName || userInfo.firstName),
      hasLastName: !!(body.lastName || userInfo.lastName),
      hasEmail: !!(body.email || userInfo.email),
      hasCity: !!(body.workLocation?.city),
      hasWorkLocation: !!(body.workLocation),
    };

    return NextResponse.json({
      debug: true,
      status: 'success',
      timestamp: new Date().toISOString(),
      user: userInfo,
      environment: envCheck,
      formData: {
        received: body,
        validation: formValidation,
      },
      issues: {
        missingUserInfo: !userInfo.hasFirstName || !userInfo.hasLastName,
        missingFormData: !formValidation.hasFirstName || !formValidation.hasLastName || !formValidation.hasCity,
        configIssues: !envCheck.hasCheckrApiKey || !envCheck.checkrApiEnabled,
      },
    });

  } catch (error) {
    return NextResponse.json({
      debug: true,
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 