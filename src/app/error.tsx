"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/layout/ErrorFallback";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Route error boundary:", error);
  }, [error]);

  return (
    <ErrorFallback
      description="Maaf, terjadi gangguan saat memproses permintaan Anda. Silakan coba lagi atau kembali ke beranda."
      onRetry={reset}
    />
  );
}
