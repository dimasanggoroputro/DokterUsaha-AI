import { Stethoscope } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-6 text-center sm:px-6">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Stethoscope className="size-3.5" />
          <span className="text-sm font-medium">DokterUsaha AI</span>
        </div>
        <p className="text-xs text-muted-foreground/70">
          © {currentYear} DokterUsaha AI. Dokter Bisnis Digital untuk UMKM
          Indonesia.
        </p>
      </div>
    </footer>
  );
}
