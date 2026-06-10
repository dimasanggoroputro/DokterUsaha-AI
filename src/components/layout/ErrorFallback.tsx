"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface ErrorFallbackProps {
  description?: string;
  onRetry?: () => void;
}

export function ErrorFallback({ description, onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[calc(100vh-240px)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl border-border/30 bg-muted/50 shadow-sm">
        <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-sm">
            <ShieldAlert className="size-10" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-xl font-semibold">
              Terjadi Kendala
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {description ??
                "Maaf, terjadi gangguan saat memproses permintaan Anda. Silakan coba lagi atau kembali ke beranda."}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onRetry ? (
              <Button onClick={onRetry} size="sm" className="gap-2">
                <RefreshCcw className="size-4" />
                Coba Lagi
              </Button>
            ) : null}
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="size-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
