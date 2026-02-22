"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormCard } from "@/components/ui/form-card";
import { useRouter } from "next/navigation";

import { DUMMY_FORMS } from "@/lib/dummy-data";

export default function DashboardPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredForms = DUMMY_FORMS.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col flex-1 min-h-screen relative bg-background">
      {/* Main Content Space */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-8 pt-10 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <h1 className="text-4xl  font-bold text-primary tracking-tight dark:text-foreground">
            Your Form
          </h1>

          <div className="flex items-center space-x-4">
            <Button className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white  rounded-xl h-12 shadow-md transition-all border-none">
              <img src="sparkle.png" alt="" className="w-5" />
              Generate With AI
            </Button>

            <Button
              variant="outline"
              className="text-primary border-primary border-2 rounded-xl h-12 shadow-sm bg-background"
            >
              <Plus className="size-5 font-bold mr-1" />
              Create New Form
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/50" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-card  placeholder:text-foreground/50 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground border-2 border-border "
            placeholder="Search your form here..."
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList variant="underline">
            <TabsTrigger value="all">All <span className="ml-2"> ({filteredForms.length})</span></TabsTrigger>
            <TabsTrigger value="published">Published <span className="ml-2"> ({filteredForms.filter((form) => form.isPublished).length})</span></TabsTrigger>
            <TabsTrigger value="not-published">Not Published <span className="ml-2"> ({filteredForms.filter((form) => !form.isPublished).length})</span></TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="">
              <div
                className={`bg-background grid gap-4 p-4 rounded-[16px] border-2 border-border ${filteredForms.length === 0 ? "grid-cols-1" : "grid-cols-2"}`}
              >
                {filteredForms.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <img src="ruby-searching.png" alt="" className="w-40" />
                    <h3 className="text-foreground font-semibold text-xl">
                      No Forms Yet
                    </h3>
                    <p className="text-foreground/50">
                      Create your first form to get started
                    </p>
                  </div>
                )}
                {filteredForms.map((form) => (
                  <FormCard
                    key={form.id}
                    title={form.title}
                    description={form.description}
                    isPublished={form.isPublished}
                    questionCount={form.questionCount}
                    date={form.date}
                    onClick={() => router.push(`/forms/${form.id}/edit`)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="published" className="mt-6">
            <div className="">
              <div
                className={`bg-background grid gap-4 p-4 rounded-[16px] border-2 border-border ${filteredForms.length === 0 ? "grid-cols-1" : "grid-cols-2"}`}
              >
                {filteredForms.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <img src="ruby-searching.png" alt="" className="w-40" />
                    <h3 className="text-foreground font-semibold text-xl">
                      No Forms Yet
                    </h3>
                    <p className="text-foreground/50">
                      Create your first form to get started
                    </p>
                  </div>
                )}
                {filteredForms
                  .filter((form) => form.isPublished)
                  .map((form) => (
                    <FormCard
                      key={form.id}
                      title={form.title}
                      description={form.description}
                      isPublished={form.isPublished}
                      questionCount={form.questionCount}
                      date={form.date}
                      onClick={() => router.push(`/forms/${form.id}/edit`)}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="not-published" className="mt-6">
            <div className="">
              <div
                className={`bg-background grid gap-4 p-4 rounded-[16px] border-2 border-border ${filteredForms.length === 0 ? "grid-cols-1" : "grid-cols-2"}`}
              >
                {filteredForms.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <img src="ruby-searching.png" alt="" className="w-40" />
                    <h3 className="text-foreground font-semibold text-xl">
                      No Forms Yet
                    </h3>
                    <p className="text-foreground/50">
                      Create your first form to get started
                    </p>
                  </div>
                )}
                {filteredForms
                  .filter((f) => !f.isPublished)
                  .map((form) => (
                    <FormCard
                      key={form.id}
                      title={form.title}
                      description={form.description}
                      isPublished={form.isPublished}
                      questionCount={form.questionCount}
                      date={form.date}
                      onClick={() => router.push(`/forms/${form.id}/edit`)}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
