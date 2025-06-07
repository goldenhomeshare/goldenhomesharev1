"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, User, Shield, HelpCircle, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  user?: {
    email: string;
    name: string;
    userImage: string;
    userType?: "HOMEOWNER" | "HOUSEMATE" | "ADMIN" | null;
  } | null;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const location = usePathname();

  const getProfileEditLink = () => {
    switch (user?.userType) {
      case "HOMEOWNER":
        return "/homeowner/profile/edit";
      case "HOUSEMATE":
        return "/housemate/profile/edit";
      default:
        return "/onboarding";
    }
  };

  // Account items (matching desktop UserNav dropdown)
  const accountItems = [
    { name: "Edit Profile", href: getProfileEditLink(), icon: User },
  ];

  // Resource items (matching desktop UserNav dropdown)
  const resourceItems = [
    { name: "About", href: "/about", icon: Info },
    { name: "Safety", href: "/safety", icon: Shield },
    { name: "Help", href: "/help", icon: HelpCircle },
  ];

  return (
    <Sheet>
      <div className="flex items-center gap-2">
        {/* Hamburger Menu Trigger */}
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        
        {/* Profile Picture Trigger */}
        {user && (
          <SheetTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.userImage} alt="User Image" />
                <AvatarFallback className="bg-gray-500 text-white text-xs font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </SheetTrigger>
        )}
      </div>
      
      <SheetContent className="w-80 p-0">
        <SheetTitle className="sr-only">Profile Menu</SheetTitle>
        
        {user ? (
          <>
            {/* User Profile Section */}
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.userImage} alt="User Image" />
                  <AvatarFallback className="bg-gray-500 text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="px-6 py-4">
              <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Account</h4>
              <div className="space-y-1">
                {accountItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      href={item.href} 
                      key={item.name}
                      className={cn(
                        location === item.href 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-50',
                        "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3 text-gray-500" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Resources Section */}
            <div className="px-6 py-4 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Resources</h4>
              <div className="space-y-1">
                {resourceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      href={item.href} 
                      key={item.name}
                      className={cn(
                        location === item.href 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-50',
                        "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3 text-gray-500" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Logout Button */}
            <div className="absolute bottom-6 left-6 right-6">
              <LogoutLink className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full justify-center font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Log out
                </Button>
              </LogoutLink>
            </div>
          </>
        ) : (
          <div className="px-6 py-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Welcome to Golden HomeShare</h4>
            <p className="text-sm text-gray-600 mb-4">Sign in to access your account and start your homesharing journey.</p>
            <div className="space-y-2">
              <Link href="/api/auth/login">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link href="/api/auth/register">
                <Button variant="outline" className="w-full">Create Account</Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
