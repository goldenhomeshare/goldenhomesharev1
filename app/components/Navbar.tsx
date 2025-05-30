import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { MessagesIcon } from "./MessagesIcon";
import { getCurrentUser } from "@/lib/auth";
import { Home } from "lucide-react";
import { UserNav } from "./UserNav";


export async function Navbar() {
    const {getUser} = getKindeServerSession()
    const kindeUser = await getUser(); 
    const user = await getCurrentUser();
    
    return (
        <nav className="relative max-w-7xl w-full flex items-center px-4 md:px-8 mx-auto py-7">
            <div className="flex-shrink-0">
            <Link href="/">
            {/* Full logo for larger screens */}
            <h1 className="hidden sm:block text-xl md:text-2xl lg:text-3xl font-semibold whitespace-nowrap">
            <span className="text-yellow-600" > Golden </span>
            <span className="text-primary"> HomeShare</span> 
            </h1>
            {/* House icon for mobile */}
            <div className="sm:hidden flex items-center gap-1">
            <span className="text-yellow-600 text-lg font-semibold">Golden</span>
            <Home className="w-6 h-6 text-green-800" />
            </div>
            </Link>
        </div>         

        <div className="hidden lg:flex justify-center items-center flex-1 mx-8">
            <NavbarLinks />
        </div>

        <div className="flex items-center gap-x-1 ml-auto flex-shrink-0">
        {kindeUser ? (
          <div className="flex items-center gap-x-1">
            <MessagesIcon userType={(user as any)?.userType || null} />
            <div className="hidden lg:flex">
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
            </div>
          </div>
            ) : (
                <div className="flex items-center gap-x-1">
                <Button asChild size="sm" className="text-xs px-2">
                    <LoginLink>Login</LoginLink></Button>
                <Button variant="secondary" asChild size="sm" className="text-xs px-2">
                    <RegisterLink>Register</RegisterLink></Button>

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

        </div>

        </nav>
    )
}