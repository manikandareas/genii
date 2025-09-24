import { useAuth } from "@clerk/nextjs";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
    isAuthRequired?: boolean;
    upcoming?: boolean;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      className={cn("sticky inset-x-0 top-0 z-50 w-full", className)}
      ref={ref}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        opacity: visible ? 1 : 0.98,
        scale: visible ? 0.95 : 1,
        y: visible ? 8 : 0,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-2xl px-6 py-4 lg:flex",
        visible ? "border border-border-strong" : "bg-transparent",
        className,
      )}
      style={{
        minWidth: "800px",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);

  const { isSignedIn } = useAuth();
  return (
    // biome-ignore lint/nursery/noNoninteractiveElementInteractions: false positive
    <nav
      aria-label="Navigasi utama"
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 font-medium text-sm text-text-primary transition duration-150 lg:flex lg:space-x-2",
        className,
      )}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, idx) => {
        if (item.isAuthRequired && !isSignedIn) {
          return null;
        }
        if (item.upcoming) {
          return (
            <button
              className="relative rounded-full px-4 py-2.5 text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              disabled
              key={`link-${idx.toString()}`}
              onBlur={() => setFocused(null)}
              onFocus={() => setFocused(idx)}
              onMouseEnter={() => setHovered(idx)}
              type="button"
            >
              {(hovered === idx || focused === idx) && (
                <motion.div
                  className="absolute inset-0 h-full w-full rounded-full border border-border-hairline bg-white/10"
                  layoutId={focused === idx ? "focused" : "hovered"}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />
              )}

              <span className="relative z-20 text-muted-foreground">
                {item.name}
              </span>
            </button>
          );
        }
        return (
          <Link
            className="relative rounded-full px-4 py-2.5 text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            key={`link-${idx.toString()}`}
            onBlur={() => setFocused(null)}
            onClick={onItemClick}
            onFocus={() => setFocused(idx)}
            onMouseEnter={() => setHovered(idx)}
            href={item.link}
          >
            {(hovered === idx || focused === idx) && (
              <motion.div
                className="absolute inset-0 h-full w-full rounded-full border border-border-hairline bg-white/10"
                layoutId={focused === idx ? "focused" : "hovered"}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
            )}

            <span className="relative z-20">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        opacity: visible ? 1 : 0.98,
        scale: visible ? 0.95 : 1,
        y: visible ? 4 : 0,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1rem)] flex-col items-center justify-between rounded-2xl px-4 py-4 lg:hidden",
        visible ? " border border-border-strong" : "bg-transparent",
        className,
      )}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = React.forwardRef<HTMLElement, MobileNavMenuProps>(
  ({ children, className, isOpen }, ref) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.section
            animate={{ opacity: 1, y: 0, scale: 1 }}
            aria-label="Mobile navigation menu"
            className={cn(
              "absolute inset-x-0 top-20 z-50 flex w-full flex-col items-start justify-start gap-6 text-text-primary",
              className,
            )}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            ref={ref}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {children}
          </motion.section>
        )}
      </AnimatePresence>
    );
  },
);

MobileNavMenu.displayName = "MobileNavMenu";

export const MobileNavToggle = React.forwardRef<
  HTMLButtonElement,
  {
    isOpen: boolean;
    onClick: () => void;
  }
>(({ isOpen, onClick }, ref) => {
  return (
    <motion.button
      aria-expanded={isOpen}
      aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
      className="inline-flex size-11 items-center justify-center rounded-full border border-border-hairline bg-white/5 transition-all duration-150 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 active:translate-y-[1px]"
      onClick={onClick}
      ref={ref}
      type="button"
      whileTap={{ scale: 0.95 }}
    >
      {isOpen ? (
        <IconX aria-hidden="true" className="size-5 text-text-primary" />
      ) : (
        <IconMenu2 aria-hidden="true" className="size-5 text-text-primary" />
      )}
    </motion.button>
  );
});

MobileNavToggle.displayName = "MobileNavToggle";

export const NavbarLogo = () => {
  return (
    <Link
      aria-label="Kembali ke beranda"
      className="group relative z-20 mr-4 flex items-center space-x-3 rounded-full px-3 py-2 transition-all duration-150 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      href="/"
    >
      <div
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-alt"
        role="img"
      >
        <img
          alt=""
          className="invert filter"
          height={20}
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
        />
      </div>
      <span className="font-medium text-base text-text-primary transition-colors duration-150 group-hover:text-accent">
        Genii
      </span>
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const variantStyles = {
    primary: "btn-primary",
    secondary: "btn-ghost",
  };

  return (
    <Tag
      className={cn(variantStyles[variant], className)}
      href={href || undefined}
      {...props}
    >
      {children}
    </Tag>
  );
};
