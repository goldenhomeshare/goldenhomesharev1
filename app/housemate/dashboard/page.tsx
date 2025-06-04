import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Home, FileText, MessageCircle, Settings } from "lucide-react";
import BackgroundCheckCard from "@/app/components/BackgroundCheckCard";
import prisma from "@/app/lib/db";

export default async function HousemateDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  if (userType !== "HOUSEMATE") {
    redirect("/onboarding");
  }

  // Get user with background check status
  const userWithStatus = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      isVerified: true,
    }
  });

  const housemateProfile = (user as any).housemateProfile;

  const dashboardItems = [
    {
      icon: Home,
      title: "Browse Homes",
      description: "Discover available homeshare listings",
      href: "/",
      color: "text-blue-600"
    },
    {
      icon: FileText,
      title: "My Applications",
      description: "Track your applications to homeowners",
      href: "/housemate/applications",
      color: "text-green-600"
    },
    {
      icon: MessageCircle,
      title: "Messages",
      description: "Connect with homeowners",
      href: "/housemate/messages",
      color: "text-orange-600"
    },
    {
      icon: User,
      title: "Edit Profile",
      description: "Update your information and preferences",
      href: "/housemate/profile/edit",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-12 flex items-center gap-4">
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Background Check Card */}
        <BackgroundCheckCard 
          isVerified={userWithStatus?.isVerified || false}
          checkrReportStatus={null}
        />
        
        {dashboardItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className={`p-4 rounded-full bg-gray-100 group-hover:bg-white transition-colors duration-200 mb-4`}>
                <IconComponent className={`w-12 h-12 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-gray-600">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 