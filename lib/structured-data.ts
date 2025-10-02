import { siteConfig } from "./seo.config";

export type StructuredData = {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
};

export function getOrganizationSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: [
      // Add your social media URLs here
      // "https://twitter.com/genii",
      // "https://linkedin.com/company/genii",
    ],
  };
}

export function getWebsiteSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/courses?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getCourseSchema({
  name,
  description,
  url,
  image,
  provider = siteConfig.name,
  datePublished,
  dateModified,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  provider?: string;
  datePublished?: string;
  dateModified?: string;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: provider,
      url: siteConfig.url,
    },
    ...(image && { image }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getEducationalOrganizationSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "US", // Update with your country
    },
  };
}
