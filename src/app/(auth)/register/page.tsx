"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (name.length === 0 || email.length === 0 || password.length === 0) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      toast.success("Successfully registered! Please login.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
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
      <div className="flex flex-col w-full my-[10%] space-y-8 max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary dark:text-primary-dark">
            Register
          </h1>
        </div>

        <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your E-mail here..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter your username here..."
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div>
            <Button
              className="w-full rounded-xl shadow-lg"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>

        <div className="text-center -mt-5">
          <p className="text-sm font-medium text-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
