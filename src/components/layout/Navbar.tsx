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
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/diagnosis", label: "Konsultasi", icon: ClipboardList },
  { href: "/result", label: "Resep Solusi", icon: Stethoscope },
  { href: "/dashboard", label: "Rekam Medis", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          onClick={() => setMobileMenuOpen(false)}
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

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileMenuOpen ? (
            <X className="size-4" />
          ) : (
            <Menu className="size-4" />
          )}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "absolute top-14 left-0 right-0 z-40 bg-background/98 backdrop-blur-sm shadow-md sm:hidden transform transition-all duration-300 ease-in-out",
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none",
        )}
      >
        <div className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="lg"
                  className={cn(
                    "w-full justify-start gap-2 transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold border border-primary-border/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                  )}
                >
                  <link.icon className="size-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}

          {isInstallable && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                install();
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2 border-primary-border/30 text-primary-foreground bg-primary/10 hover:bg-primary/20 font-semibold mt-1"
            >
              <Download className="size-4" />
              Install Aplikasi
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
