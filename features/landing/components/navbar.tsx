"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Ticket } from "lucide-react";
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
} from "@/features/shared/components/ui/resizable-navbar";

export function Navbar() {
  const navItems = [
    {
      name: NAVBAR_COPY.navigation.home,
      link: "/",
    },
    {
      name: NAVBAR_COPY.navigation.courses,
      link: "/courses",
    },
    {
      name: NAVBAR_COPY.navigation.progress,
      link: "/progress",
      isAuthRequired: true,
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
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="z-50" type="button">
                {NAVBAR_COPY.auth.signIn}
              </Button>
            </SignInButton>
            {/* <SignUpButton mode="modal">
              <Button className="z-50" type="button">
                {NAVBAR_COPY.auth.getStarted}
              </Button>
            </SignUpButton> */}
          </SignedOut>
          <SignedIn>
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
          </SignedIn>
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
            className=" flex w-full flex-col gap-4"
          >
            {navItems.map((item, idx) => (
              <Link
                className="relative rounded-lg px-3 py-2.5 font-medium text-base text-text-secondary transition-all duration-150 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                key={`mobile-link-${idx.toString()}`}
                onClick={closeMobileMenu}
                href={item.link}
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex w-full flex-col gap-4 border-border-hairline border-t pt-6">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  className="w-full justify-center"
                  onClick={closeMobileMenu}
                >
                  {NAVBAR_COPY.auth.signIn}
                </Button>
              </SignInButton>
              {/* <SignUpButton mode="modal">
                <Button
                  className="w-full justify-center"
                  onClick={closeMobileMenu}
                >
                  {NAVBAR_COPY.auth.getStarted}
                </Button>
              </SignUpButton> */}
            </SignedOut>
            <SignedIn>
              <Link
                target="_blank"
                href={process.env.NEXT_PUBLIC_QUESTIONER_URL as string}
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
