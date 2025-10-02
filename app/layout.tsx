import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/contexts/convex-client-provider";
import { Toaster } from "@/features/shared/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { defaultMetadata } from "@/lib/seo.config";
import {
  getOrganizationSchema,
  getWebsiteSchema,
  getEducationalOrganizationSchema,
} from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();
  const educationalOrgSchema = getEducationalOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(educationalOrgSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <ClerkProvider
          signUpFallbackRedirectUrl={"/onboarding"}
          signInFallbackRedirectUrl={"/redirect"}
          dynamic
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster richColors />
        </ClerkProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
