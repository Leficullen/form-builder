import Link from "next/link";
import React from "react";
import { RiArrowLeftLine as ArrowLeft } from "@remixicon/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[10fr_9fr] overflow-hidden">
      {/* Left side */}
      <div className="hidden md:block bg-linear-to-b from-primary-dark to-primary relative">
        <div className="ml-[2%] mt-[3%]">
          <Link
            href="/"
            className="font-semibold text-white flex items-center gap-2 hover:bg-foreground/20 w-fit px-3 rounded-full transition-all py-1"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            Back to home
          </Link>
        </div>

        <img
          src="login-register-assets/separator.png"
          alt=""
          className="w-[5%] h-screen overflow-hidden absolute  right-0"
        />
        <img
          src="login-register-assets/R-lettter.png"
          alt=""
          className="w-[75%] overflow-hidden absolute left-0"
        />
        <img
          src="login-register-assets/ruby-without-hand.png"
          alt=""
          className="absolute -bottom-2 w-[25%]"
        />
        <img
          src="login-register-assets/ruby-hand.png"
          alt=""
          className="absolute bottom-10 w-16   left-[22%] animate-wave origin-bottom-left"
        />
      </div>

      {/* Right side - Form panel */}
      <div className="flex flex-col justify-center px-16 bg-card text-foreground transition-colors duration-200">
        <div className="w-full ">{children}</div>
      </div>
    </div>
  );
}
