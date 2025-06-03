import { getCurrentUser } from "@/lib/auth";
import { FillableAgreementForm } from "@/components/FillableAgreementForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, FileText, CheckCircle, AlertTriangle, Info, Users, BookOpen, Shield } from "lucide-react";
import prisma from "@/app/lib/db";

async function getHomeownerDataWithListings(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const homeownerProfile = await prisma.homeownerProfile.findUnique({
      where: { userId: userId },
    });

    const listings = await prisma.product.findMany({
      where: { userId: userId },
    });

    return {
      user,
      homeownerProfile,
      listings,
    };
  } catch (error) {
    console.error("Error fetching homeowner data:", error);
    return null;
  }
}

export default async function TestAgreementsPage() {
  const currentUser = await getCurrentUser();
  
  let homeownerData = null;
  if (currentUser && (currentUser as any).userType === "HOMEOWNER") {
    homeownerData = await getHomeownerDataWithListings(currentUser.id);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agreement Generator
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Create personalized Golden HomeShare agreements with our comprehensive form system
          </p>
          
          {homeownerData && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Your profile data will be automatically populated
            </div>
          )}
        </div>

        {/* Main Form Section */}
        <Card className="mb-10 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg">
            <div className="text-center">
              <CardTitle className="text-2xl text-gray-900 mb-2 flex items-center justify-center gap-3">
                <Edit3 className="h-7 w-7 text-primary" />
                Fillable Agreement Form
              </CardTitle>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Complete the form below to generate a personalized Golden HomeShare agreement with your specific information and preferences
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-lg">
            <FillableAgreementForm 
              title="Test Fillable Agreement"
              description="Fill out this form to test the PDF generation with custom data"
              homeownerData={homeownerData}
              currentUser={currentUser}
            />
          </CardContent>
        </Card>

        {/* Information Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* How to Test Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <Info className="h-6 w-6" />
                How to Test
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">Testing Steps:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Fill out the complete form with test data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Click "Preview Agreement" to see the filled PDF</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Click "Download Agreement" to save the personalized PDF</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Test email functionality with "Email to Both Parties"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Form validates required fields and email formats</span>
                  </li>
                  {homeownerData && (
                    <li className="flex items-start gap-3 text-blue-600 font-medium">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Your homeowner profile data will be pre-filled automatically</span>
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Integration Info Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-purple-50 border-b border-purple-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-purple-900">
                <BookOpen className="h-6 w-6" />
                Integration Options
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">Use Cases:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Integration with booking confirmation flow</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Part of application approval process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Host and seeker onboarding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Agreement generation after matching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Custom agreement creation workflow</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes Card */}
        <Card className="shadow-lg border-0 border-l-4 border-l-amber-400 mb-10">
          <CardHeader className="bg-amber-50 border-b border-amber-100 rounded-tr-lg">
            <CardTitle className="flex items-center gap-3 text-amber-900">
              <AlertTriangle className="h-6 w-6" />
              Development Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  Technical Configuration:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>PDF Coordinates:</strong> Overlay positions need adjustment based on actual PDF layout</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Authentication:</strong> All API routes require user authentication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Email Service:</strong> Configure Resend with verified domain for email functionality</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-600" />
                  Testing Requirements:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Form Validation:</strong> Test all required fields and error handling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>PDF Generation:</strong> Verify field positioning and content accuracy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Email Integration:</strong> Test email delivery and template formatting</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Features Section */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-green-900">
              <CheckCircle className="h-6 w-6" />
              Features & Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Edit3 className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fillable Forms</h4>
                <p className="text-sm text-gray-600">Comprehensive form system with validation and auto-population</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">PDF Generation</h4>
                <p className="text-sm text-gray-600">Automated PDF creation with personalized content and formatting</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Email Integration</h4>
                <p className="text-sm text-gray-600">Automated email delivery to all parties with agreement attachments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 