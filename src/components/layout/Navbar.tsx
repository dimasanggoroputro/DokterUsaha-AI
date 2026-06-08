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
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/diagnosis", label: "Konsultasi", icon: ClipboardList },
  { href: "/result", label: "Resep Solusi", icon: Stethoscope },
  { href: "/dashboard", label: "Rekam Medis", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  )}
                >
                  <link.icon className="size-3.5" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
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
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background px-4 pb-4 pt-2 sm:hidden">
          <div className="flex flex-col gap-1">
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
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                    )}
                  >
                    <link.icon className="size-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
