"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/app/components/UserNav";

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-4">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 text-lg py-2 font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 ease-in-out",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="w-6 h-6 mr-4 text-primary" />
            <span className="hidden md:inline-flex">{item.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
