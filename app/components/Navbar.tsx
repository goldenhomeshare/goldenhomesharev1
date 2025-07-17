import { NavbarLinks } from "./NavbarLinks";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { MessagesIcon } from "./MessagesIcon";
import { getCurrentUser } from "@/lib/auth";
import { Home, FileText, Search, Menu } from "lucide-react";
import { UserNav } from "./UserNav";
import { ScrollResponsiveNavbar } from "./ScrollResponsiveNavbar";
import { ConditionalSearchButton } from "./ConditionalSearchButton";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

export async function Navbar() {
    const {getUser} = getKindeServerSession()
    const kindeUser = await getUser(); 
    const user = await getCurrentUser();
    
    const userNavigation = (
        <>
            {kindeUser ? (
                <div className="flex items-center justify-center gap-x-2 lg:gap-x-6">
                    {/* Desktop Navigation Icons - Hidden on Mobile */}
                    <div className="hidden lg:flex items-center justify-center gap-x-6">
                        <div className="relative flex flex-col items-center w-20">
                            <MessagesIcon userType={(user as any)?.userType || null} />
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Messages</span>
                            </div>
                        </div>
                        <div className="relative flex flex-col items-center w-20">
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="flex items-center justify-center p-2 h-12 w-12 rounded-full hover:bg-accent"
                            >
                                <Link href={`/${(user as any)?.userType?.toLowerCase() || 'housemate'}/applications`}>
                                    <FileText style={{ width: '32px', height: '32px' }} />
                                </Link>
                            </Button>
                            
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Applications</span>
                            </div>
                        </div>
                        <ConditionalSearchButton 
                            className="relative w-20"
                            iconSize={32}
                            showLabel={true}
                        />
                        <div className="relative flex flex-col items-center w-20">
                            <UserNav
                                email={kindeUser.email as string}
                                name={kindeUser.given_name as string}
                                userImage={
                                    (user as any)?.homeownerProfile?.profilePicture || 
                                    (user as any)?.housemateProfile?.profilePicture || 
                                    (kindeUser.picture ?? `https://avatar.vercel.sh/${kindeUser.given_name}`)
                                }
                                userType={(user as any)?.userType || null}
                            />
                            <div className="absolute top-full left-2.5 mt-1">
                                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Profile</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-x-3">
                    <Button asChild className="px-4 py-2.5 font-medium rounded-lg transition-all duration-200 ease-in-out bg-transparent hover:bg-gray-100 text-gray-900 border-0 hover:shadow-sm">
                        <Link href="/homeowner/signup-wizard">Become a host</Link>
                    </Button>
                    
                    {/* Hamburger Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-0">
                            {/* Become a host section */}
                            <div className="p-4 border-b border-gray-100">
                                <DropdownMenuItem asChild className="p-0 h-auto">
                                    <Link href="/homeowner/signup-wizard" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="relative w-14 h-14 flex-shrink-0">
                                            <Image 
                                                src="/updated-home-icon-min.png" 
                                                alt="Become a host"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 mb-1">Become a host</div>
                                            <div className="text-sm text-gray-500 leading-snug">It's easy to start hosting and earn extra income.</div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            </div>
                            
                            {/* Login/Signup section */}
                            <div className="p-2">
                                <DropdownMenuItem asChild>
                                    <LoginLink className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        Log in or sign up
                                    </LoginLink>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <div className="lg:hidden ml-1 flex-shrink-0">
                <MobileMenu 
                    user={kindeUser ? {
                        email: kindeUser.email as string,
                        name: kindeUser.given_name as string,
                        userImage: (user as any)?.homeownerProfile?.profilePicture || 
                                   (user as any)?.housemateProfile?.profilePicture || 
                                   (kindeUser.picture ?? `https://avatar.vercel.sh/${kindeUser.given_name}`),
                        userType: (user as any)?.userType || null
                    } : null}
                />
            </div>
        </>
    );
    
    return (
        <ScrollResponsiveNavbar
            showNavLinks={!kindeUser}
            navLinksComponent={<NavbarLinks />}
            userNavigation={userNavigation}
        />
    )
}