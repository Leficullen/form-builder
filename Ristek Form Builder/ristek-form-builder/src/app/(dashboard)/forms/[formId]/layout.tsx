"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Eye, BarChart2, Share2 } from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import { getFormById } from "@/lib/dummy-data";
import { fetchApi } from "@/lib/api";




export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const formId = params.formId as string;
  const [title, setTitle] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const form = getFormById(formId);

  useEffect(() => {
      async function loadForm() {
        try {
          const data = await fetchApi(`/forms/${formId}`);
          if (data?.form) {
            setTitle(data.form.title || "");
          }
        } catch (err) {
          console.error("Failed to fetch form:", err);
        } finally {
          setIsLoaded(true);
        }
      }
      loadForm();
    }, [formId]);

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
      <div className=" hidden lg:flex flex-col w-[320px] shrink-0 border-r border-foreground/10 h-vh sticky top-0 bg-card">
        {/* Sidebar Header */}
        <div className="p-8 pb-6 flex items-center gap-4 border-b border-transparent">
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors shadow-sm"
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
                    ? "bg-hover dark:bg-primary/20 text-primary dark:text-[#b19df5]"
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
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-primary/20">
            <Share2 className="w-[18px] h-[18px]" /> Share
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-background">
        {children}
      </div>    
    </div>
  );
}
