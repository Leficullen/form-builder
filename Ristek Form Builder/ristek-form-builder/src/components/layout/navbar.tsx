"use client";

import { Button } from "../ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/token";

export function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-foreground/10 px-8 py-2 transition-colors duration-200 bg-background/70 backdrop-blur-md">
      <div className="flex items-center">
        <img
          src="/login-register-assets/logo-with-text.png"
          alt="Ristek Fasilkom UI Form Builder"
          className="h-16 w-auto dark:hidden"
        />
        <img
          src="/logo-with-text(dark).png"
          alt="Ristek Fasilkom UI Form Builder"
          className="h-16 w-auto dark:block hidden"
        />
      </div>

      <div className="flex items-center space-x-6">
        <ModeToggle />

        <Button
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 font-bold rounded-xl px-6 h-10 shadow-sm text-md text-white"
          onClick={() => {
            removeToken();
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
