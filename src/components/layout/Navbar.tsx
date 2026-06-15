"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  Home,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  Download,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/diagnosis", label: "Konsultasi", icon: ClipboardList },
  { href: "/result", label: "Resep Solusi", icon: Stethoscope },
  { href: "/dashboard", label: "Rekam Medis", icon: BarChart3 },
];

const mobileNavLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/diagnosis", label: "Konsultasi", icon: ClipboardList },
  { href: "/result", label: "Resep Solusi", icon: Stethoscope },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard#history", label: "Riwayat", icon: Clock },
];

export function Navbar() {
  const pathname = usePathname();
  const { isInstallable, install } = usePWAInstall();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveHash(window.location.hash);
      const handleHashChange = () => {
        setActiveHash(window.location.hash);
      };
      window.addEventListener("hashchange", handleHashChange);
      // Also intercept location hash when page changes
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="size-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              DokterUsaha
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-1.5 transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground font-bold shadow-sm border border-primary-border/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                    )}
                  >
                    <link.icon className="size-3.5" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}

            {/* Desktop Install Button */}
            {isInstallable && (
              <Button
                variant="outline"
                size="sm"
                onClick={install}
                className="ml-1 gap-1.5 border-primary-border/30 text-primary-foreground bg-primary/10 hover:bg-primary/20 font-semibold transition-all duration-200"
              >
                <Download className="size-3.5" />
                Install
              </Button>
            )}
          </div>

          {/* Mobile Install Button (Moved to compact icon in header header) */}
          {isInstallable && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={install}
              className="sm:hidden text-primary-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Install Aplikasi"
            >
              <Download className="size-4" />
            </Button>
          )}
        </nav>
      </header>

      {/* Mobile Bottom Navigation Bar (PRIORITAS 7) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg py-2 px-2 flex justify-around items-center sm:hidden shadow-lg pb-[calc(env(safe-area-inset-bottom)+8px)]">
        {mobileNavLinks.map((link) => {
          const isHistory = link.href.endsWith("#history");
          const isDashboard = link.href === "/dashboard";
          
          let isActive = false;
          if (isHistory) {
            isActive = pathname === "/dashboard" && activeHash === "#history";
          } else if (isDashboard) {
            isActive = pathname === "/dashboard" && activeHash !== "#history";
          } else {
            isActive = pathname === link.href;
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-1 flex-1 py-1 text-center transition-colors"
            >
              <link.icon
                className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-primary-foreground stroke-[2.5px]" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[9px] transition-colors tracking-tight font-medium",
                  isActive ? "text-primary-foreground font-bold" : "text-muted-foreground"
                )}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
