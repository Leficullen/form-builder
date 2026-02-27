"use client";

import { Button } from "../ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter, usePathname } from "next/navigation";
import { removeToken } from "@/lib/token";
import Link from "next/link";
import { getToken } from "@/lib/token";
import { use, useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getToken();
    setAuthorized(!!token);
  }, [pathname]);

  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");

  if (isAuthPage) return null;

  const navLink = [
    {
      name: "Tutorial",
      href: "/tutorial",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
    },
  ];

  return (
    <header className="fixed top-0 z-50 flex flex-col md:flex-row w-full items-center justify-between border-b border-foreground/10 px-4 md:px-8 py-2 md:py-2 gap-2 md:gap-0 transition-colors duration-200 bg-background/70 backdrop-blur-md">
      <Link href="/" className="flex items-center w-fit cursor-pointer">
        <img
          src="/login-register-assets/logo-with-text.png"
          alt="Ristek Fasilkom UI Form Builder"
          className="h-12 md:h-16 w-auto dark:hidden"
        />
        <img
          src="/logo-with-text(dark).png"
          alt="Ristek Fasilkom UI Form Builder"
          className="h-12 md:h-16 w-auto dark:block hidden"
        />
      </Link>

      <div className="flex items-center gap-4 md:gap-10 overflow-x-auto w-full md:w-auto justify-center md:justify-end pb-2 md:pb-0 scrollbar-hide">
        <ModeToggle />
        {navLink.map((nav) => (
          <Link
            key={nav.name}
            href={nav.href}
            className={`items-center h-full hover:text-primary transition-colors duration-200 focus:font-semibold text-foreground/70 font-semibold text-sm md:text-lg whitespace-nowrap ${pathname == nav.href ? "font-semibold text-primary" : ""} `}
          >
            {nav.name}
          </Link>
        ))}

        {mounted &&
          (authorized ? (
            <Button
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 font-bold rounded-xl px-4 md:px-6 h-8 md:h-10 shadow-sm text-xs md:text-md text-white whitespace-nowrap"
              onClick={() => {
                removeToken();
                setAuthorized(false);
                router.push("/login");
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              className="bg-primary hover:bg-primary/90 active:bg-primary/80 font-bold rounded-xl px-4 md:px-6 h-8 md:h-10 shadow-sm text-xs md:text-md text-white whitespace-nowrap"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          ))}
      </div>
    </header>
  );
}
