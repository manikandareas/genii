import { Metadata } from "next";

export const siteConfig = {
  name: "Genii",
  title: "Belajar With Genii - AI-Powered Learning Platform",
  description:
    "Transform your learning experience with Genii, an AI-powered educational platform that provides personalized courses, interactive lessons, and intelligent tutoring to help you master any subject.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://geniius.space",
  ogImage: "/og-image.png",
  keywords: [
    "AI learning",
    "online courses",
    "education platform",
    "personalized learning",
    "interactive lessons",
    "AI tutor",
    "e-learning",
    "online education",
    "study platform",
    "learning management system",
  ],
  authors: [
    {
      name: "Genii Team",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://genii.app",
    },
  ],
  creator: "Genii",
  publisher: "Genii",
  category: "Education",
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  category: siteConfig.category,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@genii",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteConfig.url,
  },
};

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  keywords,
  canonical,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  canonical?: string;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: keywords || siteConfig.keywords,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@genii",
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
  };
}
