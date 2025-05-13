"use client";

import React from "react";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-white">
      {/* Subtle gradient overlay for depth */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white via-blue-50/20 to-green-50/30 pointer-events-none" />

      {/* Main content with proper z-index and padding to avoid navbar overlay */}
      <main className="flex-grow relative z-0 pt-20">{children}</main>
    </div>
  );
}
