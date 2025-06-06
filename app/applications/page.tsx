import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Home, Users, FileText } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">
            {userType === "HOMEOWNER" 
              ? "Manage applications from potential housemates" 
              : "Track your housing applications and their status"
            }
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userType === "HOMEOWNER" ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Pending Applications
                  </CardTitle>
                  <CardDescription>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    My Properties
                  </CardTitle>
                  <CardDescription>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Quick Stats
                  </CardTitle>
                  <CardDescription>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    My Applications
                  </CardTitle>
                  <CardDescription>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-green-600" />
                    Browse Properties
                  </CardTitle>
                  <CardDescription>
                    Find your perfect home
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Explore available properties and submit applications
                    </p>
                    <Link href="/">
                      <Button variant="outline" className="w-full">
                        <Home className="h-4 w-4 mr-2" />
                        Browse Properties
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Profile & Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Update your profile to attract homeowners
                    </p>
                    <Link href="/housemate/profile">
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
                <p className="text-muted-foreground mb-4">
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
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">
            An error occurred while loading the applications page.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "An unknown error occurred."}
              </p>
              <Link href="/">
                <Button>Go to Homepage</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
} 