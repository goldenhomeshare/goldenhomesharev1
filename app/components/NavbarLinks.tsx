"use client";

import { cn } from '@/lib/utils';
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navbarLinks = [
    {
        id: 0, 
        name: "Home",
        href: "/"
    },
    {
        id: 1,
        name: "Housemates",
        href: "/products/template"
    },
    {
        id: 2, 
        name: "Private Rooms", 
        href: "/products/icon"
    },
    {
        id: 3,
        name: "ADUs",
        href: "/products/uikit" 
    }, 
];


export function NavbarLinks () {
    const location = usePathname(); 



    return (
    <div className="hidden md:flex justify-center items-center col-span-6 gap-x-2">
        {navbarLinks.map ((item) => (
            <Link 
            href={item.href} 
            key={item.id} 
            className={cn(
                location === item.href 
                ? 'bg-muted' 
                : 'hover:bg-muted hover:bg-opacity-75',
                "group flex items-center px-2 py-2 font-medium rounded-md"
            )}
        >
              {item.name}  
            </Link>
        ))}
    </div>
    );
}
