// lib/with-pathname.tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

type Pattern = string | RegExp;
type Rule = Pattern[] | ((pathname: string) => boolean);

type Options = {
  include?: Rule; // tampilkan HANYA jika match (default: tampil di semua)
  exclude?: Rule; // JANGAN tampilkan jika match (override include)
  fallback?: React.ReactNode; // opsional: render pengganti saat tidak match
};

/**
 * HOC untuk menampilkan komponen berdasar pathname.
 * - String exact: "/" harus sama
 * - String prefix: "/courses*" match "/courses" & turunannya
 * - RegExp: /\/blog\/\d+$/
 * - Function: (pathname) => boolean
 * Prioritas: exclude > include
 */
export function withPathname<P extends object>(
  Component: React.ComponentType<P>,
  options: Options,
) {
  const PathnameAware: React.FC<P> = (props) => {
    const pathname = usePathname();

    const excluded = matchRule(options.exclude, pathname);
    if (excluded) return options.fallback ?? null;

    const included = options.include
      ? matchRule(options.include, pathname)
      : true;
    if (!included) return options.fallback ?? null;

    return <Component {...props} />;
  };

  return PathnameAware;
}

function matchRule(rule: Rule | undefined, pathname: string): boolean {
  if (!rule) return false;
  if (typeof rule === "function") return rule(pathname);
  return rule.some((p) =>
    typeof p === "string" ? matchStringPattern(p, pathname) : p.test(pathname),
  );
}

function matchStringPattern(pattern: string, pathname: string) {
  if (pattern.endsWith("*")) return pathname.startsWith(pattern.slice(0, -1));
  return pathname === pattern;
}
