"use client";
import { withPathname } from "@/lib/with-pathname";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "./logo";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  tagline = "Kuasai skill tech bareng AI companion yang paham kamu.",
  menuItems = [
    {
      title: "Belajar",
      links: [
        { text: "Course", url: "/courses" },
        { text: "AI Tutor", url: "#" },
        { text: "Tes Kemampuan", url: "#" },
        { text: "Project", url: "#" },
        { text: "Progress", url: "/progress" },
      ],
    },
    {
      title: "Perusahaan",
      links: [
        { text: "Tentang Kami", url: "#" },
        { text: "Karir", url: "#" },
        { text: "Partner", url: "#partners" },
        { text: "Kontak", url: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { text: "Pusat Bantuan", url: "#" },
        { text: "Live Chat", url: "#" },
        { text: "Komunitas", url: "#" },
      ],
    },
    {
      title: "Sosial",
      links: [
        { text: "LinkedIn", url: "https://www.linkedin.com/in/vitomanik" },
        { text: "Github", url: "https://github.com/manikandareas" },
      ],
    },
  ],
  copyright = "© 2025 Genii. Bertumbuh bersama AI untuk masa depan tech Indonesia.",
  bottomLinks = [
    { text: "Syarat & Ketentuan", url: "/terms" },
    { text: "Kebijakan Privasi", url: "/privacy" },
  ],
}: Footer2Props) => {
  return (
    <section className="border-t bg-background px-4 py-32">
      <div className="container mx-auto max-w-6xl">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Logo />
                Genii
              </div>
              <p className="mt-4 font-bold">{tagline}</p>
              <div className="mt-6">
                <SignUpButton mode="modal">
                  <button
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
                    type="button"
                  >
                    Mulai Gratis
                  </button>
                </SignUpButton>
              </div>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx.toString()}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      className="font-medium hover:text-primary"
                      key={linkIdx.toString()}
                    >
                      <Link href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 font-medium text-muted-foreground text-sm md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li
                  className="underline hover:text-primary"
                  key={linkIdx.toString()}
                >
                  <Link href={link.url}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export const AppFooter = withPathname(Footer2, {
  include: ["/", "/courses*"],
  exclude: [/^\/courses\/[^/]+\/(l|q)\/[^/]+$/],
});
