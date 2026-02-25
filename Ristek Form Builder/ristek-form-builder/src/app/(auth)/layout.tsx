import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[10fr_9fr] overflow-hidden">
      {/* Left side - Brand panel */}
      <div className="hidden md:block bg-gradient-to-b from-primary-dark to-primary relative">
        <img
          src="login-register-assets/separator.png"
          alt=""
          className="w-[5%] h-[100vh] overflow-hidden absolute  right-0"
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
          className="absolute bottom-10 w-[64px] left-[22%] animate-wave origin-bottom-left"
        />
      </div>

      {/* Right side - Form panel */}
      <div className="flex flex-col justify-center px-16 bg-card text-foreground transition-colors duration-200">
        <div className="w-full ">{children}</div>
      </div>
    </div>
  );
}
