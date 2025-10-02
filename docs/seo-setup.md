# SEO Setup Documentation

This document outlines the SEO configuration and best practices implemented in the Genii application.

## Overview

The application includes comprehensive SEO features:
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags for social media
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD)
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ Security headers
- ✅ Dynamic OG image generation

## Configuration Files

### 1. SEO Configuration (`lib/seo.config.ts`)
Contains site-wide SEO settings and metadata utilities:
- Site name, title, description
- Keywords and categories
- URL configuration
- Default Open Graph settings
- `constructMetadata()` helper function

### 2. Structured Data (`lib/structured-data.ts`)
Provides schema.org structured data generators:
- Organization schema
- Website schema
- Course schema
- Breadcrumb schema
- Educational organization schema

## Implementation

### Root Layout (`app/layout.tsx`)
- Exports default metadata from `seo.config.ts`
- Includes viewport configuration
- Adds structured data scripts (Organization, Website, Educational)
- Optimized font loading with `display: swap`

### Dynamic Pages

#### Home Page (`app/(user)/page.tsx`)
- Custom metadata with home-specific description
- Uses `constructMetadata()` helper

#### Course Pages (`app/(user)/courses/[courseSlug]/page.tsx`)
- Dynamic metadata generation using `generateMetadata()`
- Course-specific Open Graph images
- Course structured data (JSON-LD)
- Breadcrumb structured data

### Sitemap (`app/sitemap.ts`)
- Automatically generates sitemap.xml
- Includes static routes (home, courses, privacy, terms)
- Dynamically fetches and includes all course pages
- Configurable change frequency and priority

### Robots.txt (`app/robots.ts`)
- Allows all search engines
- Disallows admin, API, and internal routes
- References sitemap location

### Open Graph Image (`app/opengraph-image.tsx`)
- Dynamic OG image generation using `next/og`
- 1200x630px (optimal for social media)
- Edge runtime for fast generation

## Environment Variables

Required environment variables (see `env.example`):

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

This URL is used for:
- Canonical URLs
- Open Graph URLs
- Sitemap generation
- Structured data

## Security Headers

Configured in `next.config.ts`:
- `X-DNS-Prefetch-Control`: Enables DNS prefetching
- `Strict-Transport-Security`: Forces HTTPS
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-XSS-Protection`: XSS filter
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Restricts browser features

## Best Practices

### Adding New Pages

1. **Static Pages**: Add metadata export
```typescript
import { constructMetadata } from "@/lib/seo.config";

export const metadata = constructMetadata({
  title: "Page Title",
  description: "Page description",
});
```

2. **Dynamic Pages**: Implement `generateMetadata()`
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchData(params);
  
  return constructMetadata({
    title: data.title,
    description: data.description,
    image: data.image,
    canonical: `${siteConfig.url}/path/${params.slug}`,
  });
}
```

3. **Add to Sitemap**: Update `app/sitemap.ts` if needed

### Structured Data

Add structured data to pages with rich content:

```typescript
import { getCourseSchema } from "@/lib/structured-data";

// In your component
const schema = getCourseSchema({
  name: course.title,
  description: course.description,
  url: courseUrl,
  image: course.image,
});

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
    {/* Your content */}
  </>
);
```

## Testing

### Local Testing
1. Run the development server
2. Check meta tags in browser DevTools
3. View sitemap at `/sitemap.xml`
4. View robots.txt at `/robots.txt`

### Production Testing Tools
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Schema.org Validator**: https://validator.schema.org/

### SEO Audit Tools
- Google Search Console
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)
- Ahrefs Site Audit
- SEMrush Site Audit

## Deployment Checklist

Before deploying to production:

- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Verify all meta tags are correct
- [ ] Test Open Graph images on social media
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify robots.txt is accessible
- [ ] Test structured data with Google Rich Results
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit (aim for 90+ SEO score)
- [ ] Set up Google Analytics (if needed)
- [ ] Configure Vercel Analytics (already included)

## Monitoring

After deployment:
1. Add site to Google Search Console
2. Submit sitemap
3. Monitor indexing status
4. Check for crawl errors
5. Monitor Core Web Vitals
6. Track organic search traffic

## Additional Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Google Search Central](https://developers.google.com/search)
