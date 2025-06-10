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
        name: "View Listings",
        href: "/products/template"
    },
    {
        id: 2, 
        name: "View Housemates", 
        href: "/products/icon"
    },
    {
        id: 3,
        name: "About",
        href: "/about" 
    },
    {
        id: 4,
        name: "Help",
        href: "/help" 
    }, 
];


export function NavbarLinks () {
    const location = usePathname(); 

    return (
    <div className="flex justify-center items-center gap-x-2">
        {navbarLinks.map ((item) => (
            <Link 
            href={item.href} 
            key={item.id} 
            className={cn(
                location === item.href 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-gray-700 hover:text-primary hover:bg-primary/5 active:bg-primary/10',
                "group flex items-center px-4 py-2.5 font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-sm"
            )}
        >
              {item.name}  
            </Link>
        ))}
    </div>
    );
}
