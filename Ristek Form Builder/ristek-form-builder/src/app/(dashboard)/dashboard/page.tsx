"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormCard } from "@/components/ui/form-card";
import { useRouter } from "next/navigation";

import { fetchApi } from "@/lib/api";
import { getToken } from "@/lib/token";
import { toast } from "sonner";

type FormProps = {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  questionCount: number;
  responseCount: number;
  date: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [forms, setForms] = useState<FormProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showMore, setShowMore]  = useState(false);

  // AI Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!getToken()) {
      setTimeout(
        () => toast.error("You are not logged in!", { id: "not-logged-in" }),
        0,
      );
      router.push("/login");
    }

    const fetchUser = async () => {
      try {
        const response = await fetchApi("/user");
        console.log("Fetch user response:", response);
        const userData = response?.user || response;
        if (userData && userData.name) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!getToken()) return;

    const fetchForms = async () => {
      try {
        const response = await fetchApi("/forms");
        if (response && response.forms) {
          setForms(response.forms);
        }
      } catch (error) {
        console.error("Failed to fetch forms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleCreateForm = async () => {
    try {
      setIsCreating(true);
      const payload = {
        title: "Untitled Form",
        description: "",
      };
      const data = await fetchApi("/forms", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (data && data.form) {
        router.push(`/forms/${data.form.id}/edit`);
      }
    } catch (error) {
      console.error("Failed to create form:", error);
      setIsCreating(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const resp = await fetch("/api/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const aiData = await resp.json();
      if (!resp.ok) {
        throw new Error(aiData.message || "Failed to generate AI form");
      }

      const typeMapping: Record<string, string> = {
        SHORT_ANSWER: "SHORT ANSWER",
        PARAGRAPH: "PARAGRAPH",
        MULTIPLE_CHOICE: "MULTIPLE CHOICE",
        CHECKBOXES: "CHECKBOXES",
        DROPDOWN: "DROPDOWN",
      };

      const finalQuestions = aiData.questions.map((q: any, i: number) => ({
        id: `new-${Date.now()}-${i}`,
        title: q.title,
        type: typeMapping[q.type] || "SHORT ANSWER",
        required: q.required,
        options: q.options || [],
      }));

      const payload = {
        title: aiData.title,
        description: aiData.description,
        questions: finalQuestions,
      };

      const data = await fetchApi("/forms", {
        method: "POST",
        body: JSON.stringify({
          title: payload.title,
          description: payload.description,
        }),
      });

      if (data && data.form) {
        await fetchApi(`/forms/${data.form.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Form generated successfully!");
        router.push(`/forms/${data.form.id}/edit`);
      }
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      toast.error(error.message || "Failed to generate form");
      setIsGenerating(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isMounted || !getToken()) {
    return null;
  }

  

  return (
    <div className="flex flex-col flex-1 min-h-screen relative bg-background">
      {/* Main Content Space */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-8 pt-10 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <h1 className="text-4xl  font-bold text-primary tracking-tight dark:text-foreground">
            Hello, {user?.name || "..."}
          </h1>

          <div className="flex items-center space-x-4">
            <Button
              className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white  rounded-xl h-12 shadow-md transition-all border-none"
              onClick={() => setIsAiModalOpen(true)}
            >
              <img src="sparkle.png" alt="" className="w-5" />
              Generate With AI
            </Button>

            <Button
              variant="outline"
              className="text-primary border-primary border-2 rounded-xl h-12 shadow-sm bg-background disabled:opacity-50"
              onClick={handleCreateForm}
              disabled={isCreating}
            >
              <Plus className="size-5 font-bold mr-1" />
              {isCreating ? "Creating..." : "Create New Form"}
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
            className="w-full pl-12 pr-4 py-3 rounded-full bg-card  placeholder:text-foreground/50 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground border-2 border-border "
            placeholder="Search your form here..."
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>

        {/* Forms Content */}
        <div className="bg-background px-6 py-8 border-border border-2 rounded-2xl">
          <Tabs defaultValue="all" className="w-full mb-8">
            <TabsList variant="underline">
              <TabsTrigger value="all">
                All <span className="ml-2"> ({filteredForms.length})</span>
              </TabsTrigger>
              <TabsTrigger value="published">
                Published{" "}
                <span className="ml-2">
                  {" "}
                  ({filteredForms.filter((form) => form.isPublished).length})
                </span>
              </TabsTrigger>
              <TabsTrigger value="not-published">
                Not Published{" "}
                <span className="ml-2">
                  {" "}
                  ({filteredForms.filter((form) => !form.isPublished).length})
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="">
                <div
                  className={`grid gap-4 rounded-2xl ${filteredForms.length === 0 || isLoading ? "grid-cols-1" : "grid-cols-2"}`}
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full w-full py-10">
                      <p className="text-foreground animate-pulse font-medium">
                        Loading forms...
                      </p>
                    </div>
                  ) : filteredForms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full w-full py-10">
                      <img src="ruby-searching.png" alt="" className="w-40" />
                      <h3 className="text-foreground font-semibold text-xl">
                        No Forms Yet
                      </h3>
                      <p className="text-foreground/50">
                        Create your first form to get started
                      </p>
                    </div>
                  ) : (
                    filteredForms.map((form) => (
                      <FormCard
                        key={form.id}
                        title={form.title}
                        description={form.description}
                        isPublished={form.isPublished}
                        questionCount={form.questionCount}
                        responseCount={form.responseCount}
                        date={form.date}
                        onClick={() => router.push(`/forms/${form.id}/edit`)}
                      />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="published" className="mt-6">
              <div className="">
                <div
                  className={`grid gap-4 rounded-2xl ${filteredForms.filter((f) => f.isPublished).length === 0 || isLoading ? "grid-cols-1" : "grid-cols-2"}`}
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full w-full py-10">
                      <p className="text-foreground animate-pulse font-medium">
                        Loading forms...
                      </p>
                    </div>
                  ) : filteredForms.filter((f) => f.isPublished).length ===
                    0 ? (
                    <div className="flex flex-col items-center justify-center h-full w-full py-10">
                      <img src="ruby-searching.png" alt="" className="w-40" />
                      <h3 className="text-foreground font-semibold text-xl">
                        No Published Forms
                      </h3>
                      <p className="text-foreground/50">
                        You haven't published any forms yet
                      </p>
                    </div>
                  ) : (
                    filteredForms
                      .filter((form) => form.isPublished)
                      .map((form) => (
                        <FormCard
                          key={form.id}
                          title={form.title}
                          description={form.description}
                          isPublished={form.isPublished}
                          questionCount={form.questionCount}
                          responseCount={form.responseCount}
                          date={form.date}
                          onClick={() => router.push(`/forms/${form.id}/edit`)}
                        />
                      ))
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="not-published" className="mt-6">
              <div className="">
                <div
                  className={`grid gap-4 rounded-2xl ${filteredForms.filter((f) => !f.isPublished).length === 0 || isLoading ? "grid-cols-1" : "grid-cols-2"}`}
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full w-full py-10">
                      <p className="text-foreground animate-pulse font-medium">
                        Loading forms...
                      </p>
                    </div>
                  ) : filteredForms.filter((f) => !f.isPublished).length ===
                    0 ? (
                    <div className="flex flex-col items-center justify-center h-full w-full py-10">
                      <img src="ruby-searching.png" alt="" className="w-40" />
                      <h3 className="text-foreground font-semibold text-xl">
                        No Draft Forms
                      </h3>
                      <p className="text-foreground/50">
                        You don't have any unpublished forms
                      </p>
                    </div>
                  ) : (
                    filteredForms
                      .filter((f) => !f.isPublished)
                      .map((form) => (
                        <FormCard
                          key={form.id}
                          title={form.title}
                          description={form.description}
                          isPublished={form.isPublished}
                          questionCount={form.questionCount}
                          responseCount={form.responseCount}
                          date={form.date}
                          onClick={() => router.push(`/forms/${form.id}/edit`)}
                        />
                      ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Tabs */}
      </main>

      {/* AI Modals */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl p-6 shadow-xl border border-border flex flex-col gap-4 relative">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsAiModalOpen(false)}
              disabled={isGenerating}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <img src="sparkle.png" alt="" className="w-6" />
              <h2 className="text-xl font-bold text-foreground">
                Generate with AI
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm text-foreground/70">
                Describe the form you want to create, and our AI will build it
                for you instantly. (e.g., "Buatkan form pendaftaran futsal")
              </p>

              <textarea
                className="w-full text-foreground bg-background rounded-xl p-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-30 resize-none"
                placeholder="Type your prompt here..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={isGenerating}
              />

              <button
                className="w-full bg-[#D946EF] hover:bg-[#D946EF]/90 text-white font-semibold py-3 flex items-center justify-center gap-2 rounded-xl transition-all disabled:opacity-50"
                onClick={handleGenerateAI}
                disabled={isGenerating || !aiPrompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "✨ Generate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
