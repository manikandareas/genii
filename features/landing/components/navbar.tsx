"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Loader, Ticket } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAVBAR_COPY } from "@/features/landing/constants/navbar-copy";
import { Button } from "@/features/shared/components/ui/button";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  Navbar as NavbarComp,
  NavbarLogo,
  NavItems,
  getIconColor,
} from "@/features/shared/components/ui/resizable-navbar";
import { withPathname } from "@/lib/with-pathname";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

export function Navbar() {
  const navItems = [
    {
      name: NAVBAR_COPY.navigation.home.text,
      link: NAVBAR_COPY.navigation.home.link,
      icon: NAVBAR_COPY.navigation.home.icon,
      color: NAVBAR_COPY.navigation.home.color,
    },
    {
      name: NAVBAR_COPY.navigation.courses.text,
      link: NAVBAR_COPY.navigation.courses.link,
      icon: NAVBAR_COPY.navigation.courses.icon,
      color: NAVBAR_COPY.navigation.courses.color,
    },
    {
      name: NAVBAR_COPY.navigation.journey.text,
      link: NAVBAR_COPY.navigation.journey.link,
      icon: NAVBAR_COPY.navigation.journey.icon,
      color: NAVBAR_COPY.navigation.journey.color,
      isAuthRequired: NAVBAR_COPY.navigation.journey.isAuthRequired,
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key and focus management
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus first focusable element in menu
      const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    toggleButtonRef.current?.focus();
  };

  return (
    <NavbarComp className="mx-auto max-w-6xl px-4 py-2 ">
      {/* Desktop Navigation */}
      <NavBody className="py-3 backdrop-blur-md">
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-3">
          <Link
            target="_blank"
            href={process.env.NEXT_PUBLIC_QUESIONER_URL as string}
            className="z-50"
          >
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border-hairline bg-white/5 px-4 py-2.5 text-text-secondary transition-all duration-150 hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              type="button"
            >
              <Ticket className="size-4" />
              <span className="hidden sm:inline">
                {NAVBAR_COPY.feedback.desktop}
              </span>
            </button>
          </Link>
          <Unauthenticated>
            <SignInButton mode="modal">
              <Button className="z-50" type="button">
                {NAVBAR_COPY.auth.signIn}
              </Button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "size-9 rounded-full border border-border-hairline hover:border-border-strong transition-colors duration-150",
                  },
                }}
              />
            </div>
          </Authenticated>
          <AuthLoading>
            <Loader size={20} className="animate-spin" />
          </AuthLoading>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav className="backdrop-blur-md">
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            ref={toggleButtonRef}
          />
        </MobileNavHeader>

        <MobileNavMenu
          className="z-50 overflow-hidden rounded-b-md bg-background/95 p-4"
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          ref={mobileMenuRef}
        >
          <nav
            aria-label={NAVBAR_COPY.accessibility.mobileNav}
            className="flex w-full flex-col gap-4"
          >
            {navItems.map((item, idx) => (
              <Link
                className="relative rounded-lg px-3 py-2.5 font-medium text-base text-text-secondary transition-all duration-150 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                key={`mobile-link-${idx.toString()}`}
                onClick={closeMobileMenu}
                href={item.link}
              >
                <span className="flex items-center gap-2">
                  <item.icon size={18} className={getIconColor(item.color)} />{" "}
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex w-full flex-col gap-4 border-border-hairline border-t pt-6">
            <Link
              target="_blank"
              href={process.env.NEXT_PUBLIC_QUESIONER_URL as string}
            >
              <button
                aria-label={NAVBAR_COPY.feedback.ariaLabel}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border-hairline bg-white/5 px-4 py-3 text-text-secondary transition-all duration-150 hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                onClick={closeMobileMenu}
                type="button"
              >
                <Ticket className="size-4" />
                {NAVBAR_COPY.feedback.mobile}
              </button>
            </Link>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  className="w-full justify-center"
                  onClick={closeMobileMenu}
                >
                  {NAVBAR_COPY.auth.signIn}
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex justify-center pt-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "size-10 rounded-full border border-border-hairline hover:border-border-strong transition-colors duration-150",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </NavbarComp>
  );
}

export const AppNavbar = withPathname(Navbar, {
  include: ["/", "/courses*", "/privacy", "/terms", "/journey", "/dashboard"],
  exclude: [
    /^\/courses\/[^/]+\/(l|q)\/[^/]+$/,
    /^\/courses\/[^/]+\/q\/[^/]+\/(play|result)$/,
  ],
});
