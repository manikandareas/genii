"use client";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  IconBadge,
  IconBook,
  IconDashboard,
  IconFile,
  IconFileStack,
  IconVocabulary,
} from "@tabler/icons-react";
import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", href: `/admin/dashboard`, icon: IconDashboard },
    {
      name: "Topics",
      href: `/admin/topics`,
      icon: IconBadge,
    },
    {
      name: "Courses",
      href: `/admin/courses`,
      icon: IconBook,
    },
    { name: "Chapters", href: `/admin/chapters`, icon: IconFile },
    { name: "Lessons", href: `/admin/chapters`, icon: IconVocabulary },
    { name: "Quizzes", href: `/admin/chapters`, icon: IconFileStack },
  ];
  return (
    <div className="w-full bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="flex h-16 items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield size={18} className="text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">Genii Admin</span>
            </div>
          </div>

          <UserButton />
        </div>

        <div className="flex h-16 items-center justify-between px-6 py-4 w-full">
          <ul className="flex gap-6">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="flex items-center">
                  <span
                    className={cn(
                      "text-sm text-muted-foreground flex items-center gap-1.5 hover:text-primary",
                      pathname === item.href && "font-medium text-primary",
                    )}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
