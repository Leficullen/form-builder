"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Instagram, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) return null;

  return (
    <footer className="w-full bg-card border-t border-foreground/5 pt-16 pb-8 px-8 mt-auto">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <img
              src="/login-register-assets/logo-with-text.png"
              alt="Ristek Fasilkom UI"
              className="h-12 w-auto dark:hidden"
            />
            <img
              src="/logo-with-text(dark).png"
              alt="Ristek Fasilkom UI"
              className="h-12 w-auto dark:block hidden"
            />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The most intuitive way to build, manage, and analyze your forms.
            Empowering students and organizations with professional tools.
          </p>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="p-2 rounded-lg bg-hover/50 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Github size={18} />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-lg bg-hover/50 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href=""
              className="p-2 rounded-lg bg-hover/50 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Linkedin size={18} />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-foreground">Product</h3>
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/tutorial"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Tutorial
              </Link>
            </li>
            <li>
              <Link
                href="/design-system"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                Design System
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        

        {/* Contact/Support */}
        <div className="justify-right">
          <h3 className="font-bold text-lg mb-6 text-foreground">Support</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 group cursor-pointer">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Email us
                </p>
                <p className="text-xs text-muted-foreground">
                  hello@ristek.fasilkom.ui
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Developed by
            </p>
            <p className="text-sm font-bold text-foreground">Leficullen</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm italic">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} All rights reserved.
        </p>
        <div className="flex items-center text-muted-foreground">
          Doain moga lolos yak guyss awowkwkwk  
        </div>
      </div>
    </footer>
  );
}
