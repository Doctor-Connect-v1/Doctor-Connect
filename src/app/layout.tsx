import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/common/landing/Navbar";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocConnect - Your Health Partner",
  description: "Connecting patients and doctors seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Don't render navbar on authentication pages */}
        {/* We check if the current path is for auth by looking for children's specific structure */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
