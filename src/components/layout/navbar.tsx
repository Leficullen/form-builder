"use client";

import { Button } from "../ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter, usePathname } from "next/navigation";
import { removeToken } from "@/lib/token";
import Link from "next/link";
import { getToken } from "@/lib/token";
import { use, useEffect, useState } from "react";
import { RiMenuLine, RiCloseLine } from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getToken();
    setAuthorized(!!token);
  }, [pathname]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");

  if (isAuthPage) return null;

  const navLink = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-foreground/10 transition-colors duration-200 bg-background/70 backdrop-blur-md">
      <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center w-fit cursor-pointer shrink-0">
          <img
            src="/login-register-assets/logo-with-text.png"
            alt="Ristek Fasilkom UI Form Builder"
            className="h-10 md:h-16 w-auto dark:hidden"
          />
          <img
            src="/logo-with-text(dark).png"
            alt="Ristek Fasilkom UI Form Builder"
            className="h-10 md:h-16 w-auto dark:block hidden"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 mr-4">
            {navLink.map((nav) => (
              <Link
                key={nav.name}
                href={nav.href}
                className={`text-lg font-semibold hover:text-primary transition-colors duration-200 ${
                  pathname && pathname === nav.href
                    ? "text-primary"
                    : "text-foreground/70"
                }`}
              >
                {nav.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-foreground/10 pl-8">
            <ModeToggle />
            {mounted &&
              (authorized ? (
                <Button
                  className="bg-red-500 hover:bg-red-600 active:bg-red-700 font-bold rounded-xl px-6 h-10 shadow-sm text-white"
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
                  className="bg-primary hover:bg-primary/90 active:bg-primary/80 font-bold rounded-xl px-6 h-10 shadow-sm text-white"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
              ))}
          </div>
        </div>

        {/* Mobile Actions (Toggle + Menu Button) */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-primary hover:bg-hover/50 rounded-full transition-colors"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <RiCloseLine className="size-8" />
            ) : (
              <RiMenuLine className="size-8" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-foreground/10 bg-background overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLink.map((nav) => (
                <Link
                  key={nav.name}
                  href={nav.href}
                  className={`text-lg font-semibold py-2 px-4 rounded-xl hover:bg-primary/10 transition-colors ${
                    pathname && pathname === nav.href
                      ? "text-primary bg-primary/5"
                      : "text-foreground/70"
                  }`}
                >
                  {nav.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-foreground/10 flex flex-col gap-4">
                {mounted &&
                  (authorized ? (
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 font-bold rounded-xl text-white"
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
                      className="w-full bg-primary hover:bg-primary/90 font-bold rounded-xl text-white"
                      onClick={() => router.push("/login")}
                    >
                      Login
                    </Button>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
