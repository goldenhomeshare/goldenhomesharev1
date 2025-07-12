import { NavbarLinks } from "./NavbarLinks";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { MessagesIcon } from "./MessagesIcon";
import { getCurrentUser } from "@/lib/auth";
import { Home, FileText, Search } from "lucide-react";
import { UserNav } from "./UserNav";
import { ScrollResponsiveNavbar } from "./ScrollResponsiveNavbar";
import Link from "next/link";

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
                        <div className="relative flex flex-col items-center w-20">
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="flex items-center justify-center p-2 h-12 w-12 rounded-full hover:bg-accent"
                            >
                                <Link href={(user as any)?.userType === "HOMEOWNER" ? "/products/icon" : "/products/template"}>
                                    <Search style={{ width: '32px', height: '32px' }} />
                                </Link>
                            </Button>
                            
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                                    {(user as any)?.userType === "HOMEOWNER" ? "Browse Housemates" : "Browse Homes"}
                                </span>
                            </div>
                        </div>
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
                <div className="flex items-center gap-x-2">
                    <Button asChild className="px-4 py-2.5 font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-sm">
                        <LoginLink>Login</LoginLink>
                    </Button>
                    <Button variant="secondary" asChild className="px-4 py-2.5 font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-sm">
                        <RegisterLink>Register</RegisterLink>
                    </Button>
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