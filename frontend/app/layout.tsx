import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const brandFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CompBase | Direktori Kompetisi",
    template: "%s — CompBase",
  },
  description:
    "CompBase membantu mahasiswa dan praktisi menemukan kompetisi Statistik & Data Science berdasarkan urgensi deadline.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "CompBase | Direktori Kompetisi",
    description:
      "CompBase membantu mahasiswa dan praktisi menemukan kompetisi Statistik & Data Science berdasarkan urgensi deadline.",
    siteName: "CompBase",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${bodyFont.variable} ${brandFont.variable} h-full antialiased`}>
      <body className="compbase-canvas min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
