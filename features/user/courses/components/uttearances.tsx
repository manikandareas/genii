// app/components/Utterances.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Props = {
  repo: string; // "owner/repo"
  issueTerm?: "pathname" | "url" | "title" | "og:title" | string;
  label?: string;
  theme?: string; // "github-dark" | "preferred-color-scheme" | ...
};

export default function Utterances({
  repo,
  issueTerm = "pathname",
  label,
  theme = "preferred-color-scheme",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Kalau sudah ada iframe utterances (mis. re-render yang sama), skip reinjeksi
    if (el.querySelector("iframe.utterances-frame")) return;

    const s = document.createElement("script");
    s.src = "https://utteranc.es/client.js";
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("repo", repo);
    s.setAttribute("issue-term", issueTerm);
    if (label) s.setAttribute("label", label);
    s.setAttribute("theme", theme);

    el.appendChild(s);

    // PENTING: tidak perlu cleanup manual (jangan el.innerHTML='')
    // Biar React yang remove saat unmount; ini mencegah race "no parent".
  }, [repo, issueTerm, label, theme, pathname]);

  // Key memastikan container benar-benar remount saat route berubah
  return <div ref={ref} />;
}
