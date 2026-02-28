"use client";

import {
  RiCheckboxCircleFill as CircleCheckIcon,
  RiInformationFill as InfoIcon,
  RiLoader4Line as Loader2Icon,
  RiCloseCircleFill as OctagonXIcon,
  RiAlertFill as TriangleAlertIcon,
} from "@remixicon/react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast flex items-center gap-3 w-full p-5 rounded-2xl border shadow-lg transition-all text-base sm:text-lg font-medium bg-transparent",
          error: "bg-[#ef4444] text-white border-[#ef4444]",
          success: "bg-[#22c55e] text-white border-[#22c55e]",
          default: "bg-card text-card-foreground border-border",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "#22c55e",
          "--success-text": "#ffffff",
          "--error-bg": "#ef4444",
          "--error-text": "#ffffff",
          "--border-radius": "var(--radius)",
          "--width": "420px",
          "--height": "100px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
