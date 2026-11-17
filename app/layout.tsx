import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Preloader } from "@/components/ui/Preloader";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["500", "600"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "FESTRONIX 2026 — Vardhaman College of Engineering",
  description: "A two-day national technical symposium and competitive engineering conclave organized by the Student Affairs Cell at Vardhaman College of Engineering, Hyderabad. December 1 & 2, 2026.",
  keywords: ["Festronix", "Festronix 2026", "Vardhaman College of Engineering", "VCE Hyderabad", "Technical Fest", "Hackathon", "Robotics", "Code Sprint"],
  authors: [{ name: "Student Affairs Cell, VCE" }],
  openGraph: {
    title: "FESTRONIX 2026 — National Technical Fest",
    description: "Two days of competitive software architecture, autonomous robotics, and silicon engineering at Vardhaman College of Engineering, Hyderabad. December 1 & 2, 2026.",
    url: "https://festronix.vardhaman.org",
    siteName: "FESTRONIX 2026",
    images: [
      {
        url: "/assets/branding/festronix_wordmark.png",
        width: 1200,
        height: 630,
        alt: "FESTRONIX 2026 Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FESTRONIX 2026 — VCE Hyderabad",
    description: "Two days of competitive software architecture, autonomous robotics, and silicon engineering at Vardhaman College of Engineering, Hyderabad. December 1 & 2, 2026.",
    images: ["/assets/branding/festronix_wordmark.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jakarta.variable} ${jetbrains.variable} dark`}
    >
      <body className="bg-[#06080C] text-[#EEF0F5] antialiased selection:bg-[#12A4C4] selection:text-black">
        <SmoothScrollProvider>
          <Preloader />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <MobileBottomNav />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
