"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="flex flex-col space-y-8 h-screen">
      <div className="mt-10">
        <img
          src="login-register-assets/logo-with-text.png"
          alt=""
          className="w-[50%] mx-auto block dark:hidden"
        />
        <img
          src="logo-with-text(dark).png"
          alt=""
          className="w-[50%] mx-auto hidden dark:block"
        />
      </div>
      <div className="flex flex-col my-[7%] space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Login</h1>
        </div>

        <form
          className="flex flex-col space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-4">
            <Input type="email" placeholder="Enter your E-mail here..." />
            <Input type="password" placeholder="Enter your Password here..." />
          </div>

          <div className="pt-4">
            <Button className="w-full rounded-xl shadow-lg" type="submit">
                <Link href="/dashboard">
                Login
                </Link>
            </Button>
          </div>
        </form>

        <div className="text-center -mt-5">
          <p className="text-sm font-medium text-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
