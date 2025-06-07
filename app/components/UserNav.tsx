import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ChevronDown, User, Shield, HelpCircle, FileText, Info, Home } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  email: string;
  name: string;
  userImage: string | undefined;
  userType?: "HOMEOWNER" | "HOUSEMATE" | "ADMIN" | null;
}

export function UserNav({ email, name, userImage, userType }: iAppProps) {
  const getDashboardLink = () => {
    switch (userType) {
      case "HOMEOWNER":
        return "/homeowner/dashboard";
      case "HOUSEMATE":
        return "/housemate/dashboard";
      case "ADMIN":
        return "/admin/dashboard";
      default:
        return "/onboarding";
    }
  };

  const getMessagesLink = () => {
    switch (userType) {
      case "HOMEOWNER":
        return "/homeowner/messages";
      case "HOUSEMATE":
        return "/housemate/messages";
      default:
        return "/messages";
    }
  };

  const getProfileEditLink = () => {
    switch (userType) {
      case "HOMEOWNER":
        return "/homeowner/profile/edit";
      case "HOUSEMATE":
        return "/housemate/profile/edit";
      default:
        return "/onboarding";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex items-center gap-2 px-2 py-1 rounded-full hover:bg-transparent transition-colors">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userImage} alt="User Image" />
            <AvatarFallback className="text-sm font-medium">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Account Section */}
        <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Account
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={getProfileEditLink()} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Edit Profile
            </Link>
          </DropdownMenuItem>
          {userType === "HOMEOWNER" && (
            <DropdownMenuItem asChild>
              <Link href="/my-products" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Manage Listings
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        {/* Resources Section */}
        <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Resources
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/about" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              About
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/safety" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Safety
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/help" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}