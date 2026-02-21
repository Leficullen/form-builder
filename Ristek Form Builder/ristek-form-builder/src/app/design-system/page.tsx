"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ColorSwatch = ({
  name,
  color,
  hex,
  description,
}: {
  name: string;
  color: string;
  hex: string;
  description: string;
}) => (
  <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div
      className={`h-24 w-full rounded-xl ${color} border border-black/5`}
    ></div>
    <div>
      <h3 className="font-bold text-foreground capitalize">{name}</h3>
      <code className="text-xs text-primary font-mono bg-hover px-2 py-1 rounded">
        {hex}
      </code>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  </div>
);

const TypeSample = ({
  weight,
  label,
  weightClass,
}: {
  weight: string;
  label: string;
  weightClass: string;
}) => (
  <div className="flex items-baseline gap-8 py-4 border-b border-gray-50">
    <span className="text-sm text-gray-400 w-24">{label}</span>
    <span className={`text-4xl text-foreground ${weightClass}`}>
      The quick brown fox jumps over the lazy dog.
    </span>
  </div>
);

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-primary tracking-tight mb-4">
            Design System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Welcome to the Ristek Form Builder design language. This system is
            now powered by
            <span className="font-bold text-primary"> shadcn/ui</span>,
            customized to our brand.
          </p>
        </header>

        {/* Colors Section */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Color Palette
            </h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ColorSwatch
              name="Primary"
              color="bg-primary"
              hex="#5038BC"
              description="Used for primary actions, branding, and key UI elements."
            />
            <ColorSwatch
              name="Primary Dark"
              color="bg-primary-dark"
              hex="#6248DC"
              description="Used for hover states on primary components and emphasized depth."
            />
            <ColorSwatch
              name="Hover / Accent"
              color="bg-hover"
              hex="#E1E5FE"
              description="Used for subtle backgrounds on interactive items and secondary actions."
            />
            <ColorSwatch
              name="Background"
              color="bg-background"
              hex="#FFFFFF"
              description="The main workspace and page background color."
            />
            <ColorSwatch
              name="Foreground"
              color="bg-foreground"
              hex="#333333"
              description="Primary text color ensuring high readability."
            />
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">Typography</h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-primary font-mono uppercase tracking-wider text-sm">
                Primary Font: Poppins
              </CardTitle>
              <CardDescription>
                A geometric sans-serif typeface that's clean, modern, and highly
                legible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TypeSample
                weightClass="font-light"
                weight="300"
                label="Light 300"
              />
              <TypeSample
                weightClass="font-normal"
                weight="400"
                label="Regular 400"
              />
              <TypeSample
                weightClass="font-medium"
                weight="500"
                label="Medium 500"
              />
              <TypeSample
                weightClass="font-semibold"
                weight="600"
                label="Semibold 600"
              />
              <TypeSample
                weightClass="font-bold"
                weight="700"
                label="Bold 700"
              />
            </CardContent>
          </Card>
        </section>

        {/* shadcn UI Section */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              shadcn/ui Components
            </h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <Tabs defaultValue="buttons" className="w-full">
            <TabsList className="bg-hover mb-8">
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="forms">Forms & Inputs</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>

            <TabsContent value="buttons" className="space-y-8">
              <Card className="rounded-2xl">
                <CardContent className="pt-6 flex flex-wrap gap-4">
                  <Button>Primary Action</Button>
                  <Button variant="outline">Outline Action</Button>
                  <Button
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    Custom Secondary
                  </Button>
                  <Button variant="ghost">Ghost Action</Button>
                  <Button variant="destructive">Destructive</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forms" className="space-y-8">
              <Card className="rounded-2xl">
                <CardContent className="pt-6 space-y-6 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="example@ristek.com" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cards" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-2xl border-2 border-primary/5">
                  <CardHeader>
                    <CardTitle>Feature Title</CardTitle>
                    <CardDescription>
                      Short description of this amazing feature.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      This card is built using shadcn/ui and follows our design
                      system tokens.
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl bg-primary text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Premium Card</CardTitle>
                    <CardDescription className="text-white/70">
                      Using primary background color.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" className="w-full">
                      Action Point
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <footer className="text-center text-gray-400 text-sm py-8 border-t border-gray-100">
          &copy; 2026 Ristek Form Builder. Hybrid shadcn/ui + Poppins Design
          System.
        </footer>
      </div>
    </div>
  );
}
