"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/layout/ErrorFallback";

interface GlobalErrorProps {
  error: Error;
}

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <ErrorFallback
      description="Maaf, terjadi gangguan saat memproses permintaan Anda. Silakan coba lagi atau kembali ke beranda."
      onRetry={() => window.location.reload()}
    />
  );
}
