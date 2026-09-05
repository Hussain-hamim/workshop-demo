import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deal Prep & Discovery Intelligence",
  description:
    "Workshop demo: account research to proposal with Next.js and SQLite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(dmSans.variable, fraunces.variable)}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
