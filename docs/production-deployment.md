# Production Deployment Guide

Panduan lengkap untuk deploy aplikasi Genii ke production.

## Pre-Deployment Checklist

### 1. Environment Variables

Pastikan semua environment variables sudah diset di platform hosting (Vercel):

```bash
# Required
NEXT_PUBLIC_APP_URL=https://yourdomain.com
CONVEX_DEPLOYMENT=prod:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
UPLOADTHING_TOKEN=...

# Optional (AI Features)
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

### 2. SEO Configuration

- [ ] Update `NEXT_PUBLIC_APP_URL` dengan domain production
- [ ] Verifikasi meta tags di semua halaman
- [ ] Test Open Graph preview di social media debuggers
- [ ] Pastikan `robots.txt` accessible di `/robots.txt`
- [ ] Pastikan `sitemap.xml` accessible di `/sitemap.xml`

### 3. Performance Optimization

- [ ] Optimize images (sudah menggunakan Next.js Image)
- [ ] Enable compression (otomatis di Vercel)
- [ ] Verify font loading strategy (`display: swap` sudah diset)
- [ ] Check bundle size: `npm run build`
- [ ] Run Lighthouse audit (target: 90+ untuk semua metrics)

### 4. Security

- [ ] Verify security headers di `next.config.ts`
- [ ] Enable HTTPS (otomatis di Vercel)
- [ ] Set up CORS jika diperlukan
- [ ] Review API routes security
- [ ] Enable rate limiting untuk API routes (jika perlu)

### 5. Analytics & Monitoring

- [ ] Vercel Analytics sudah terinstall ✅
- [ ] Vercel Speed Insights sudah terinstall ✅
- [ ] Setup Google Search Console
- [ ] Setup error monitoring (Sentry, optional)
- [ ] Setup uptime monitoring (optional)

## Deployment Steps

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Push code ke GitHub
   git add .
   git commit -m "Production ready with SEO setup"
   git push origin main
   ```

2. **Import Project di Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel akan auto-detect Next.js

3. **Configure Environment Variables**
   - Di Vercel dashboard, masuk ke Settings > Environment Variables
   - Add semua variables dari `env.example`
   - Pastikan pilih "Production" environment

4. **Deploy**
   - Click "Deploy"
   - Tunggu build selesai (~2-5 menit)
   - Vercel akan provide preview URL

5. **Add Custom Domain**
   - Settings > Domains
   - Add your domain
   - Update DNS records sesuai instruksi Vercel
   - SSL certificate akan auto-generated

### Alternative: Self-Hosted

```bash
# Build production
npm run build

# Start production server
npm run start
```

## Post-Deployment Tasks

### 1. SEO Setup

**Google Search Console**
1. Verify domain ownership
2. Submit sitemap: `https://yourdomain.com/sitemap.xml`
3. Request indexing untuk homepage
4. Monitor indexing status

**Bing Webmaster Tools**
1. Add and verify site
2. Submit sitemap
3. Request indexing

**Social Media**
1. Test Open Graph:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

2. Verify preview terlihat benar dengan:
   - Correct title
   - Correct description
   - Correct image (1200x630px)

### 2. Performance Monitoring

**Vercel Analytics**
- Already enabled ✅
- Monitor di Vercel dashboard

**Google PageSpeed Insights**
```
https://pagespeed.web.dev/
```
Test URL production dan pastikan:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**Core Web Vitals**
Monitor di Google Search Console:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### 3. Security Verification

Test security headers:
```bash
curl -I https://yourdomain.com
```

Verify headers present:
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Referrer-Policy`

### 4. Functionality Testing

- [ ] Test user registration/login
- [ ] Test course enrollment
- [ ] Test AI chat functionality
- [ ] Test file uploads
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Test all critical user flows

## Monitoring & Maintenance

### Daily
- Check error logs di Vercel dashboard
- Monitor uptime

### Weekly
- Review analytics data
- Check Core Web Vitals
- Monitor API usage/costs

### Monthly
- Review SEO performance di Search Console
- Update dependencies: `npm outdated`
- Security audit: `npm audit`
- Review and optimize slow pages

## Rollback Plan

Jika ada masalah setelah deployment:

**Vercel**
1. Go to Deployments
2. Find previous working deployment
3. Click "..." > "Promote to Production"

**Git**
```bash
git revert HEAD
git push origin main
```

## Performance Tips

### Image Optimization
- Gunakan Next.js Image component (sudah digunakan)
- Serve images dalam format WebP
- Lazy load images below the fold

### Code Splitting
- Next.js automatically code splits
- Use dynamic imports untuk heavy components:
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

### Caching Strategy
- Static pages: ISR (Incremental Static Regeneration)
- Dynamic data: SWR or React Query (sudah digunakan)
- API responses: Cache headers

## Troubleshooting

### Build Fails
1. Check build logs di Vercel
2. Test build locally: `npm run build`
3. Verify all dependencies installed
4. Check TypeScript errors

### Environment Variables Not Working
1. Verify variable names (must start with `NEXT_PUBLIC_` for client-side)
2. Redeploy after adding variables
3. Check variable scope (Production/Preview/Development)

### SEO Issues
1. Verify `NEXT_PUBLIC_APP_URL` is set correctly
2. Check meta tags in browser DevTools
3. Test with social media debuggers
4. Verify sitemap generates correctly

### Performance Issues
1. Run Lighthouse audit
2. Check bundle size: `npm run build`
3. Analyze with Vercel Analytics
4. Consider implementing caching strategies

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Convex Docs**: https://docs.convex.dev
- **Clerk Docs**: https://clerk.com/docs

## Maintenance Schedule

**Weekly**
- Review error logs
- Check performance metrics
- Monitor user feedback

**Monthly**
- Update dependencies
- Security audit
- Performance optimization
- SEO review

**Quarterly**
- Major feature updates
- Comprehensive testing
- User experience review
- Infrastructure review
