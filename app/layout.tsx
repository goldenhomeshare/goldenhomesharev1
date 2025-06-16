import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { ConsultationBanner } from "./components/ConsultationBanner";
// import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
// import { extractRouterConfig } from "uploadthing/server";
// import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getCurrentUser } from "@/lib/auth";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Golden HomeShare",
  description: "Connect with trusted housemates and find affordable housing solutions",
  icons: {
    icon: "/Logo.png",
    apple: "/Logo.png",
  },
};

// async function UTSSRComponent() {
//   // For React 19 and Next.js 15 compatibility/
//   return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
// }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M4B14VMY28"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-M4B14VMY28');
            `,
          }}
        />
        <Script
          id="hotjar-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6430051,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ConsultationBanner />
        <Navbar />
        <div className="pb-24 lg:pb-0">
          {children}
        </div>
        <Footer />
        <MobileBottomNav 
          user={kindeUser ? {
            email: kindeUser.email as string,
            name: kindeUser.given_name as string,
            userImage: (user as any)?.homeownerProfile?.profilePicture || 
                       (user as any)?.housemateProfile?.profilePicture || 
                       (kindeUser.picture ?? `https://avatar.vercel.sh/${kindeUser.given_name}`),
            userType: (user as any)?.userType || null
          } : null}
        />
        <Toaster richColors theme="light" closeButton />
      </body>
    </html>
  );
}
