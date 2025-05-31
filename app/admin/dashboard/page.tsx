import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Users, Home, Settings, Shield, FileText, MessageCircle, BarChart3 } from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  if (userType !== "ADMIN") {
    redirect("/onboarding");
  }

  const dashboardItems = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage homeowners and housemates",
      href: "/admin/users",
      color: "text-blue-600"
    },
    {
      icon: Home,
      title: "Listing Management",
      description: "Review and moderate property listings",
      href: "/admin/listings",
      color: "text-green-600"
    },
    {
      icon: FileText,
      title: "Applications",
      description: "Monitor application activity",
      href: "/admin/applications",
      color: "text-purple-600"
    },
    {
      icon: MessageCircle,
      title: "Messages",
      description: "View and moderate conversations",
      href: "/admin/messages",
      color: "text-orange-600"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Platform usage and statistics",
      href: "/admin/analytics",
      color: "text-indigo-600"
    },
    {
      icon: Shield,
      title: "Safety & Reports",
      description: "Handle safety reports and issues",
      href: "/admin/safety",
      color: "text-red-600"
    },
    {
      icon: Settings,
      title: "Platform Settings",
      description: "Configure platform settings",
      href: "/admin/settings",
      color: "text-gray-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-12 flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome, {user.firstName}! Manage the Golden HomeShare platform
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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