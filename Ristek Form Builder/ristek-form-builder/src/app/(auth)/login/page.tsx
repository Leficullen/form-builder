"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";
import { setToken } from "@/lib/token";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email.length === 0 || password.length === 0) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response && response.token) {
        setToken(response.token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("User not found or incorrect password");
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex flex-col space-y-8 w-full max-w-lg mx-auto my-[10%]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary dark:text-primary-dark">
            Login
          </h1>
        </div>

        <form className="flex flex-col space-y-4 " onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your E-mail here..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Enter your Password here..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="animate-in duration-300 ease-in-out text-sm bg-red-600 text-white px-5 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="">
            <Button
              className="w-full rounded-xl shadow-lg"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>

        <div className="text-center -mt-5">
          <p className="text-sm font-medium text-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary dark:text-primary-dark hover:underline"
            >
              Register  
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
