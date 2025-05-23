import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

export default async function HousemateDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  if (userType !== "HOUSEMATE") {
    redirect("/onboarding");
  }

  const housemateProfile = (user as any).housemateProfile;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
          {housemateProfile?.profilePicture ? (
            <Image
              src={housemateProfile.profilePicture}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
          <p className="text-muted-foreground mt-2">
            Find your perfect home and connect with homeowners
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Browse Homes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Discover available homeshare listings</p>
            <Button asChild>
              <Link href="/">Browse Listings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Track your applications to homeowners</p>
            <Button asChild>
              <Link href="/housemate/applications">View Applications</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Homes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Your favorite and saved listings</p>
            <Button asChild>
              <Link href="/housemate/saved">View Saved</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Update your preferences and lifestyle info</p>
            <Button asChild>
              <Link href="/housemate/profile/edit">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Connect with homeowners</p>
            <Button asChild>
              <Link href="/housemate/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 