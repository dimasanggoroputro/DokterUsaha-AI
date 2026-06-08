import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

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
  other: {
    "dicoding:email": "dimasanggoro806@gmail.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Navbar />
        {children}
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
