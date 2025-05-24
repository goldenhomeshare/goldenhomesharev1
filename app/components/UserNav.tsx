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

  const getDashboardLabel = () => {
    switch (userType) {
      case "HOMEOWNER":
        return "Homeowner Dashboard";
      case "HOUSEMATE":
        return "Housemate Dashboard";
      case "ADMIN":
        return "Admin Dashboard";
      default:
        return "Complete Setup";
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userImage} alt="User Image" />
            <AvatarFallback>{name.slice(0, 3)}</AvatarFallback>
          </Avatar>
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
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={getDashboardLink()}>{getDashboardLabel()}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/sell">Make a Listing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={getProfileEditLink()}>Edit Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="my-products">My Products</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/billing">Billing</Link>
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