"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Eye, BarChart2, Share2 } from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import { getFormById } from "@/lib/dummy-data";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const formId = params.formId as string;

  const form = getFormById(formId);

  const navLinks = [
    {
      name: "Edit",
      href: `/forms/${formId}/edit`,
      icon: Pencil,
      active: pathname.includes(`/forms/${formId}/edit`),
    },
    {
      name: "Preview",
      href: `/forms/${formId}/preview`,
      icon: Eye,
      active: pathname.includes(`/forms/${formId}/preview`),
    },
    {
      name: "Response",
      href: `/forms/${formId}/responses`,
      icon: BarChart2,
      active: pathname.includes(`/forms/${formId}/responses`),
    },
  ];

  return (
    <div className="flex w-full bg-background relative z-20">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-[320px] shrink-0 border-r border-foreground/10 h-[calc(100vh-97px)] sticky top-[97px] bg-card">
        {/* Sidebar Header */}
        <div className="p-8 pb-6 flex items-center gap-4 border-b border-transparent">
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-full bg-[#3e2e85] flex items-center justify-center shrink-0 hover:bg-[#3e2e85]/90 transition-colors shadow-sm"
          >
            <ArrowLeft className="text-white w-4 h-4" />
          </Link>
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-[13px] font-bold text-foreground leading-tight truncate">
              {form?.title || "Form Not Found"}
            </h2>
            <span className="text-[10px] text-muted-foreground mt-0.5 tracking-wide">
              All Changes Saved
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-6 flex flex-col gap-2 flex-1 pt-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 w-full px-5 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                  link.active
                    ? "bg-hover dark:bg-[#3e2e85]/20 text-[#3e2e85] dark:text-[#b19df5]"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Bottom Button */}
        <div className="p-6">
          <button className="w-full bg-[#3e2e85] hover:bg-[#3e2e85]/90 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-primary/20">
            <Share2 className="w-[18px] h-[18px]" /> Share
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="max-w-[800px] mx-auto w-full p-8 flex flex-col gap-5 flex-1 pb-16">
          {/* Banner */}
          <div
            className="relative w-full rounded-[24px] overflow-hidden shadow-sm min-h-[160px] flex flex-col items-center justify-center text-center p-8 border border-foreground/5 shrink-0"
            style={{ backgroundColor: form?.bannerColor || "#3e2e85" }}
          >
            {/* Geometric SVG Background Simulation */}
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
              <svg width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                    <stop
                      offset="100%"
                      stopColor="transparent"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient id="g2" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop
                      offset="100%"
                      stopColor="transparent"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path d="M 0 0 L 100 100 L 0 200 Z" fill="url(#g1)" />
                <path d="M 100% 100% L 100% 0 L 80% 100% Z" fill="url(#g2)" />
              </svg>
            </div>

            <h1 className="text-white text-2xl md:text-[28px] font-bold tracking-tight z-10 mb-2 drop-shadow-md">
              {form?.title || "Form Not Found"}
            </h1>
            <p className="text-white/90 text-xs md:text-sm font-medium z-10 drop-shadow-md">
              {form?.description ||
                "The form you are looking for does not exist."}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
