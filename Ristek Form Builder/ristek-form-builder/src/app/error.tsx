"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshCcw, Home, Rocket, AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden mt-20">
      <div className="absolute top-0 left-0 w-[20%] opacity-10 pointer-events-none">
        <img src="/ornament-left.png" alt="" className="dark:hidden block" />
        <img
          src="/ornament-left(dark).png"
          alt=""
          className="dark:block hidden"
        />
      </div>
      <div className="absolute bottom-0 right-0 w-[20%] opacity-10 pointer-events-none rotate-180">
        <img src="/ornament-left.png" alt="" className="dark:hidden block" />
        <img
          src="/ornament-left(dark).png"
          alt=""
          className="dark:block hidden"
        />
      </div>

      <div className="max-w-xl w-full text-center space-y-12 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse"></div>
          <div className="relative flex justify-center">
            <div className="bg-primary/10 p-8 rounded-full border border-primary/20">
              <AlertCircle
                size={80}
                className="text-primary animate-bounce shadow-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Oops! <span className="text-primary italic">Something broke.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
            Even the best engines encounter a few hiccups. Don't worry, we're on
            it!
          </p>
        </div>

        {/* Error Details (Optional/Debug) */}
        {process.env.NODE_ENV === "development" && (
          <div className="p-4 bg-muted/50 rounded-2xl border border-border text-left overflow-auto max-h-32">
            <code className="text-xs text-destructive font-mono uppercase tracking-widest block mb-2 opacity-50">
              Debug info:
            </code>
            <p className="text-sm font-mono text-muted-foreground">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-6 h-auto bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/25 transition-all transform hover:-translate-y-1 gap-2"
          >
            <RefreshCcw size={20} />
            Try Again
          </Button>

          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto px-8 py-6 h-auto bg-background text-foreground border-2 border-border rounded-2xl font-bold text-lg hover:bg-hover transition-all transform hover:-translate-y-1 gap-2"
          >
            <Link href="/">
              <Home size={20} />
              Go Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Fun Footer message */}
      <div className="mt-20 flex items-center space-x-2 text-muted-foreground italic text-sm opacity-50">
        <Rocket size={16} />
        <span>We'll be back in orbit soon!</span>
      </div>
    </div>
  );
}
