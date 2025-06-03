import { getCurrentUser } from "@/lib/auth";
import { FillableAgreementForm } from "@/components/FillableAgreementForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, FileText, CheckCircle, AlertTriangle, Info } from "lucide-react";
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
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Golden HomeShare Agreement System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Generate personalized Golden HomeShare agreements with our comprehensive fillable form system
          </p>
          
          {homeownerData && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Profile data will be automatically populated
            </div>
          )}
        </div>

        {/* Main Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-10">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-2xl p-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Edit3 className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-gray-900">Fillable Agreement Form</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Complete the comprehensive form below to generate a personalized Golden HomeShare agreement with your specific information, house rules, and preferences automatically filled in.
              </p>
            </div>
          </div>
          
          <div className="p-8">
            <FillableAgreementForm 
              title="Test Fillable Agreement"
              description="Fill out this form to test the PDF generation with custom data"
              homeownerData={homeownerData}
              currentUser={currentUser}
            />
          </div>
        </div>

        {/* Information Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* How to Test Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <Info className="h-6 w-6" />
                How to Test
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Fillable Form Testing:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Fill out the complete form with test data
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Click "Preview Agreement" to see the filled PDF
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Click "Download Agreement" to save the personalized PDF
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Click "Email to Both Parties" to test email functionality
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      The form validates required fields and email formats
                    </li>
                    {homeownerData && (
                      <li className="flex items-start gap-2 text-blue-600 font-medium">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        Your homeowner profile data will be pre-filled automatically
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Suggestions Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-purple-50 border-b border-purple-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-purple-900">
                <Edit3 className="h-6 w-6" />
                Integration Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Fillable Form Use Cases:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      Integration with booking confirmation flow
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      Part of application approval process
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      Host and seeker onboarding
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      Agreement generation after matching
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      Custom agreement creation workflow
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes Card */}
        <Card className="shadow-lg border-0 border-l-4 border-l-yellow-400 mb-10">
          <CardHeader className="bg-yellow-50 border-b border-yellow-100 rounded-tr-lg">
            <CardTitle className="flex items-center gap-3 text-yellow-900">
              <AlertTriangle className="h-6 w-6" />
              Important Development Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Technical Configuration:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Coordinates:</strong> PDF overlay positions are set as examples and need adjustment based on actual PDF layout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Authentication:</strong> All API routes require user authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Email:</strong> Configure Resend with your verified domain for email functionality</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Security & Validation:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Authorization:</strong> Implement proper authorization checks for production use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Validation:</strong> The fillable form includes client-side validation and server-side checks</span>
                  </li>
                  {homeownerData && (
                    <li className="flex items-start gap-2 text-blue-600">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><strong>Profile Integration:</strong> Form will auto-populate with your profile data and house rules from your listings</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Homeowner Data Debug (only show in development) */}
        {process.env.NODE_ENV === "development" && homeownerData && homeownerData.user && (
          <Card className="shadow-lg border-0 border-l-4 border-l-green-400">
            <CardHeader className="bg-green-50 border-b border-green-100 rounded-tr-lg">
              <CardTitle className="flex items-center gap-3 text-green-900">
                <CheckCircle className="h-6 w-6" />
                Development: Homeowner Data Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-lg border border-green-200 p-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Profile Information:</p>
                    <p className="text-gray-700">{homeownerData.user.firstName} {homeownerData.user.lastName}</p>
                    <p className="text-gray-600">{homeownerData.user.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Available Listings:</p>
                    <p className="text-gray-700">{homeownerData.listings.length} listings found</p>
                  </div>
                </div>
                
                {homeownerData.listings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="font-medium text-gray-900 mb-2">Listings Details:</p>
                    <div className="space-y-2">
                      {homeownerData.listings.map((listing: any) => (
                        <div key={listing.id} className="bg-gray-50 rounded p-3">
                          <p className="font-medium text-gray-900">{listing.name}</p>
                          <p className="text-sm text-gray-600">{listing.address}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            House Rules: {listing.houseRules ? 
                              `${JSON.stringify(listing.houseRules).slice(0, 80)}...` : 
                              'None configured'
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
} 