import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#C6E7FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "DokterUsaha AI — Dokter Bisnis Digital UMKM",
    template: "%s — DokterUsaha AI",
  },
  description:
    "Platform diagnosa bisnis berbasis AI untuk membantu pelaku UMKM mengidentifikasi masalah usaha dan mendapatkan rekomendasi solusi yang dapat diterapkan.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DokterUsaha AI",
  },
  other: {
    "dicoding:email": "dimasanggoro806@gmail.com",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground pb-20 sm:pb-0">
        <ServiceWorkerRegistrar />
        <Navbar />
        {children}
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
