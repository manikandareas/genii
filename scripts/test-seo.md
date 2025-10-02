# SEO Testing Guide

Panduan untuk test SEO implementation sebelum dan sesudah deployment.

## Local Testing

### 1. Build dan Run Production Mode

```bash
# Build aplikasi
npm run build

# Run production server
npm run start
```

### 2. Test Meta Tags

Buka browser dan inspect element di halaman:

**Home Page (http://localhost:3000)**
```html
<!-- Should see -->
<title>Genii - AI-Powered Learning Platform</title>
<meta name="description" content="Transform your learning experience..." />
<meta property="og:title" content="Genii - AI-Powered Learning Platform" />
<meta property="og:image" content="/og-image.png" />
```

**Course Page (http://localhost:3000/courses/[slug])**
```html
<!-- Should see dynamic content -->
<title>Course Title | Genii</title>
<meta name="description" content="Course description..." />
<meta property="og:title" content="Course Title" />
```

### 3. Test Sitemap

Visit: http://localhost:3000/sitemap.xml

Should see:
- Home page
- Courses page
- Privacy page
- Terms page
- All course pages

### 4. Test Robots.txt

Visit: http://localhost:3000/robots.txt

Should see:
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: http://localhost:3000/sitemap.xml
```

### 5. Test Structured Data

View page source dan cari `<script type="application/ld+json">`:

**Root Layout:**
- Organization schema
- Website schema
- Educational Organization schema

**Course Pages:**
- Course schema
- Breadcrumb schema

## Online Testing Tools

### Before Deployment (Using Localhost Tunnel)

Install ngrok atau cloudflared untuk expose localhost:

```bash
# Using cloudflared (recommended)
brew install cloudflare/cloudflare/cloudflared
cloudflared tunnel --url http://localhost:3000
```

Gunakan URL yang diberikan untuk testing online.

### After Deployment

#### 1. Meta Tags Validator

**Facebook Sharing Debugger**
```
https://developers.facebook.com/tools/debug/
```
Test:
- Enter your URL
- Click "Scrape Again"
- Verify image, title, description

**Twitter Card Validator**
```
https://cards-dev.twitter.com/validator
```
Test:
- Enter your URL
- Verify card preview

**LinkedIn Post Inspector**
```
https://www.linkedin.com/post-inspector/
```
Test:
- Enter your URL
- Verify preview

#### 2. Structured Data Testing

**Google Rich Results Test**
```
https://search.google.com/test/rich-results
```
Test:
- Enter your URL
- Check for errors
- Verify schema types detected

**Schema.org Validator**
```
https://validator.schema.org/
```
Test:
- Enter your URL
- Verify all schemas valid

#### 3. SEO Audit Tools

**Google Lighthouse**
```bash
# Via Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "SEO" category
4. Click "Generate report"
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 95+

**PageSpeed Insights**
```
https://pagespeed.web.dev/
```
Test both mobile and desktop.

#### 4. Security Headers

**Security Headers Checker**
```
https://securityheaders.com/
```
Should see:
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

**SSL Labs**
```
https://www.ssllabs.com/ssltest/
```
Should get A+ rating.

## Manual Checklist

### Meta Tags ✓
- [ ] Title tag present on all pages
- [ ] Title unique per page
- [ ] Title length 50-60 characters
- [ ] Description present on all pages
- [ ] Description unique per page
- [ ] Description length 150-160 characters
- [ ] Keywords relevant to content
- [ ] Canonical URL set correctly

### Open Graph ✓
- [ ] og:title present
- [ ] og:description present
- [ ] og:image present (1200x630px)
- [ ] og:url present
- [ ] og:type set to "website"
- [ ] og:site_name present

### Twitter Cards ✓
- [ ] twitter:card set to "summary_large_image"
- [ ] twitter:title present
- [ ] twitter:description present
- [ ] twitter:image present

### Structured Data ✓
- [ ] Organization schema on root
- [ ] Website schema on root
- [ ] Course schema on course pages
- [ ] Breadcrumb schema on course pages
- [ ] No errors in Google Rich Results Test

### Technical SEO ✓
- [ ] Sitemap.xml accessible
- [ ] Sitemap includes all pages
- [ ] Robots.txt accessible
- [ ] Robots.txt allows crawling
- [ ] HTTPS enabled
- [ ] No mixed content warnings
- [ ] Mobile responsive
- [ ] Fast loading (< 3s)

### Security ✓
- [ ] Security headers present
- [ ] HTTPS enforced
- [ ] No console errors
- [ ] No broken links

## Common Issues & Fixes

### Issue: Meta tags not updating

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Issue: Sitemap not showing courses

**Solution:**
- Check Convex query returns data
- Verify `getCourses` query exists
- Check console for errors

### Issue: Open Graph image not showing

**Solution:**
1. Verify image exists at `/public/og-image.png`
2. Or use dynamic OG image at `/opengraph-image`
3. Clear social media cache in debuggers

### Issue: Structured data errors

**Solution:**
1. Validate JSON-LD syntax
2. Check required fields present
3. Use Schema.org validator

### Issue: Security headers missing

**Solution:**
1. Verify `next.config.ts` headers config
2. Redeploy application
3. Check with curl: `curl -I https://yourdomain.com`

## Automated Testing Script

Create `scripts/check-seo.js`:

```javascript
const https = require('https');

const urls = [
  '/',
  '/courses',
  '/sitemap.xml',
  '/robots.txt',
];

const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

urls.forEach(url => {
  const fullUrl = `${domain}${url}`;
  https.get(fullUrl, (res) => {
    console.log(`${url}: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${url}: ERROR - ${e.message}`);
  });
});
```

Run:
```bash
node scripts/check-seo.js
```

## Performance Testing

### Core Web Vitals

Monitor:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Tools:
- Chrome DevTools Performance tab
- Lighthouse
- PageSpeed Insights
- Web Vitals Chrome Extension

## Post-Launch Monitoring

### Week 1
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify indexing started
- [ ] Check for crawl errors

### Week 2
- [ ] Monitor search impressions
- [ ] Check for 404 errors
- [ ] Verify all pages indexed

### Month 1
- [ ] Review organic traffic
- [ ] Check keyword rankings
- [ ] Optimize based on data
- [ ] Update meta descriptions if needed

## Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
