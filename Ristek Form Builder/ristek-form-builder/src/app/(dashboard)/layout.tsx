import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative transition-colors duration-200">
      <Navbar />
      <div className="flex-1 flex flex-col z-10 relative">{children}</div>
      <Footer />
    </div>
  );
}
