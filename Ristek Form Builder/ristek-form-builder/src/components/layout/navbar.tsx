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
    <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-foreground/10 px-8 py-2 transition-colors duration-200 bg-background/70 backdrop-blur-md">
      <Link href="/"
        className="flex items-center w-fit cursor-pointer"
      >
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
      </Link>

      <div className="flex items-center space-x-10">
        <ModeToggle />
        {navLink.map((nav) => (
          <Link
            key={nav.name}
            href={nav.href}
            className={`items-center h-full hover:text-primary transition-colors duration-200 focus:font-semibold text-foreground/70 font-semibold text-lg ${pathname == nav.href ? "font-semibold text-primary" : ""} `}
          >
            {nav.name}
          </Link>
        ))}

        {mounted &&
          (authorized ? (
            <Button
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 font-bold rounded-xl px-6 h-10 shadow-sm text-md text-white"
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
              className="bg-primary hover:bg-primary/90 active:bg-primary/80 font-bold rounded-xl px-6 h-10 shadow-sm text-md text-white"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          ))}
      </div>
    </header>
  );
}
