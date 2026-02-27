import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative transition-colors duration-200 mt-32 md:mt-24">
      <div className="flex-1 flex flex-col z-10 relative">{children}</div>
    </div>
  );
}
