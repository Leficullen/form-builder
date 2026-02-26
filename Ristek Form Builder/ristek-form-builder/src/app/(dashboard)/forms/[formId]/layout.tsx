"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Eye, BarChart2, Share2 } from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Copy, CheckCircle2, RotateCw, X } from "lucide-react";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const formId = params.formId as string;
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [shareId, setShareId] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    async function loadForm() {
      try {
        const data = await fetchApi(`/forms/${formId}`);
        if (data?.form) {
          setTitle(data.form.title || "");
          setStatus(data.form.status || "");
          setIsPublic(data.form.isPublic || false);
          setShareId(data.form.shareId || "");
        }
      } catch (err) {
        console.error("Failed to fetch form:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadForm();
  }, [formId]);

  const handleShareEnable = async () => {
    if (status !== "PUBLISHED") {
      toast.error("Form must be published before you can share it.");
      return;
    }

    setIsSharing(true);
    try {
      const resp = await fetchApi(`/forms/${formId}/share/enable`, {
        method: "POST",
      });
      setIsPublic(resp.isPublic);
      setShareId(resp.shareId);
      toast.success("Sharing enabled");
    } catch (err: any) {
      toast.error(err.message || "Failed to enable sharing");
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareDisable = async () => {
    setIsSharing(true);
    try {
      const resp = await fetchApi(`/forms/${formId}/share/disable`, {
        method: "POST",
      });
      setIsPublic(resp.isPublic);
      toast.success("Sharing disabled");
    } catch (err: any) {
      toast.error(err.message || "Failed to disable sharing");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRegenerate = async () => {
    setIsSharing(true);
    try {
      const resp = await fetchApi(`/forms/${formId}/share/regenerate`, {
        method: "POST",
      });
      setShareId(resp.shareId);
      toast.success("Link regenerated");
    } catch (err: any) {
      toast.error(err.message || "Failed to regenerate link");
    } finally {
      setIsSharing(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/f/${shareId}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

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
    <div className="flex w-full bg-background relative z-20 h-vh">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-[320px] shrink-0 border-r border-foreground/10 h-vh sticky top-0 bg-card ">

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
              {title || "Loading..."}
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
                <Icon className="w-4.5 h-4.5" />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Bottom Button */}
        <div className="p-6">
          <button
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-primary/20"
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share2 className="w-4.5 h-4.5" /> Share
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-col bg-background min-h-screen max-w-4xl mx-auto w-full p-8 gap-5 flex py-16 relative">
        {children}
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl p-6 shadow-xl border border-border flex flex-col gap-4 relative">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsShareModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-foreground mb-2">
              Share Form
            </h2>

            {status !== "PUBLISHED" ? (
              <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-4 rounded-xl text-sm mb-4">
                You must publish this form to share it with others. Go to Edit
                and change its status to PUBLISHED first.
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {!isPublic ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-foreground/70">
                      Sharing is currently disabled.
                    </p>
                    <button
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center"
                      onClick={handleShareEnable}
                      disabled={isSharing}
                    >
                      {isSharing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Enable Sharing"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-foreground/70">
                      Anyone with this link can view and submit the form.
                    </p>

                    <div className="flex items-center gap-2 border border-border p-2 rounded-xl bg-muted/50">
                      <input
                        className="flex-1 bg-transparent text-sm focus:outline-none text-foreground truncate px-2"
                        readOnly
                        value={`${typeof window !== "undefined" ? window.location.origin : ""}/f/${shareId}`}
                      />
                      <button
                        className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-colors"
                        onClick={copyLink}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center text-sm"
                        onClick={handleShareDisable}
                        disabled={isSharing}
                      >
                        {isSharing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Disable Link"
                        )}
                      </button>

                      <button
                        className="flex-1 border border-border bg-background hover:bg-muted font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm text-foreground"
                        onClick={handleRegenerate}
                        disabled={isSharing}
                      >
                        {isSharing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <RotateCw className="w-4 h-4" /> Regenerate
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
