// middleware.ts
import { NextResponse } from "next/server";

function genNonce() {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  return Buffer.from(nonce).toString("base64");
}

export function middleware() {
  const res = NextResponse.next();
  const nonce = genNonce();
  const isDev = process.env.NODE_ENV === "development";

  const scriptSrc = [
    `'self'`,
    `'nonce-${nonce}'`,
    "https://utteranc.es",
    "https://*.clerk.com",
    "https://*.clerk.accounts.dev",
    "https://va.vercel-scripts.com", // Vercel Analytics / Speed Insights
    ...(isDev ? [`'unsafe-eval'`] : []), // HMR/Fast Refresh
  ].join(" ");

  const connectSrc = [
    `'self'`,
    "https://*.clerk.com",
    "https://*.clerk.accounts.dev",
    "https://utteranc.es", // untuk sourcemap dev (opsional)
    "https://va.vercel-scripts.com", // script/telemetry
    "https://vitals.vercel-analytics.com", // Speed Insights beacons
    ...(isDev ? ["ws:", "wss:"] : []), // HMR
  ].join(" ");

  // PROD: ketat untuk <style>, tapi izinkan atribut style=
  // DEV: izinkan unsafe-inline agar lib UI (vaul/radix) aman
  const styleDirectives = isDev
    ? [`style-src 'self' 'unsafe-inline'`]
    : [
        `style-src 'self'`,
        `style-src-elem 'self' 'nonce-${nonce}'`,
        `style-src-attr 'unsafe-inline'`,
      ];

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,

    `script-src ${scriptSrc}`,
    `frame-src https://utteranc.es https://*.clerk.com https://*.clerk.accounts.dev`,
    `worker-src 'self' blob: data:`, // ← FIX: worker dari blob
    `child-src 'self' blob:`, // Safari lama

    `connect-src ${connectSrc}`,
    `img-src 'self' data: https://github.com https://avatars.githubusercontent.com https://*.clerk.com`,
    `font-src 'self' data:`,
    `form-action 'self' https://*.clerk.com https://*.clerk.accounts.dev`,
    `manifest-src 'self'`,
    ...styleDirectives,
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("x-nonce", nonce);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
