import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Home, Users, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Force this page to be dynamic since it requires authentication
export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      redirect("/api/auth/login");
    }

    const currentUser = await getCurrentUser();
    const userType = currentUser?.userType;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile-Optimized Header */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Back Button */}
          <div className="flex items-center gap-3 mb-4 sm:hidden">
            <Link href={`/${userType?.toLowerCase() || 'housemate'}/dashboard`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Applications</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {userType === "HOMEOWNER" 
              ? "Manage applications from potential housemates" 
              : "Track your housing applications and their status"
            }
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userType === "HOMEOWNER" ? (
            <>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <span>Pending Applications</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Review and respond to new applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Manage applications that need your attention
                    </p>
                    <Link href="/homeowner/applications">
                      <Button className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        View Applications
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span>My Properties</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Manage your property listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      View and manage your active property listings
                    </p>
                    <Link href="/my-products">
                      <Button variant="outline" className="w-full">
                        <Home className="h-4 w-4 mr-2" />
                        My Properties
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Quick Stats</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Application overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      View detailed application statistics and history
                    </p>
                    <Link href="/homeowner/dashboard">
                      <Button variant="outline" className="w-full">
                        View Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : userType === "HOUSEMATE" ? (
            <>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span>My Applications</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Track your submitted applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      View status and details of your applications
                    </p>
                    <Link href="/housemate/applications">
                      <Button className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        View My Applications
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Home className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Browse Properties</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Find your perfect home
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Explore available properties and submit applications
                    </p>
                    <Link href="/products/template">
                      <Button variant="outline" className="w-full">
                        <Home className="h-4 w-4 mr-2" />
                        Browse Properties
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <span>Profile & Settings</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Manage your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Update your profile to attract homeowners
                    </p>
                    <Link href="/housemate/profile/edit">
                      <Button variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="py-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Please complete your profile setup to access application features.
                </p>
                <Link href="/onboarding">
                  <Button>Complete Setup</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Action Cards */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/billing">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-medium">Billing</h4>
                  <p className="text-sm text-muted-foreground">Payment settings</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/settings">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="font-medium">Settings</h4>
                  <p className="text-sm text-muted-foreground">Account settings</p>
                </CardContent>
              </Card>
            </Link>

            <Link href={userType === "HOMEOWNER" ? "/homeowner/messages" : "/housemate/messages"}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <h4 className="font-medium">Messages</h4>
                  <p className="text-sm text-muted-foreground">Chat with users</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/about">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Home className="h-4 w-4 text-yellow-600" />
                  </div>
                  <h4 className="font-medium">Help</h4>
                  <p className="text-sm text-muted-foreground">Get support</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ApplicationsPage:", error);
    redirect("/api/auth/login");
  }
} 