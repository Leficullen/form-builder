"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { RiLoader4Line as Loader2 } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { FormQuestion, QuestionType } from "@/components/FormQuestion";

type Question = {
  id: string;
  type: string;
  title: string;
  required: boolean;
  options: string[];
};

type Form = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
};

export default function PublicFormPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const router = useRouter();

  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    async function load() {
      try {
        const resp = await fetchApi(`/public/forms/${shareId}`);
        if (resp?.form) {
          setForm(resp.form);
        }
      } catch (err: any) {
        toast.error("Form not found or unavailable.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [shareId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Build payload
    const payload = {
      answers: form.questions
        .map((q) => ({
          questionId: q.id,
          value: answers[q.id],
        }))
        .filter(
          (a) =>
            a.value !== undefined &&
            a.value !== "" &&
            (Array.isArray(a.value) ? a.value.length > 0 : true),
        ),
    };

    setIsSubmitting(true);
    try {
      await fetchApi(`/public/forms/${shareId}/submissions`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setIsSubmitted(true);
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((er: string) => toast.error(er));
      } else {
        toast.error(err.message || "Failed to submit form");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Form out of reach</h1>
          <p className="text-muted-foreground">
            This form might have been deleted or sharing is disabled.
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-primary dark:bg-background pt-16 p-4">
        <div className="max-w-2xl mx-auto bg-card rounded-xl p-8 shadow-sm border border-border text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Response submitted!
          </h1>
          <p className="text-muted-foreground">
            Your response has been successfully recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hover dark:bg-background py-16 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex flex-col gap-6"
      >
        {/* Form Header */}
        <div className="bg-primary rounded-2xl p-6 text-center flex flex-col items-center justify-center mt-2 relative overflow-hidden">
          <img
            src="/banner-pattern-left.png"
            alt=""
            className="absolute -left-1 2 w-30 -top-3"
          />
          <img
            src="/banner-pattern-right.png"
            alt=""
            className="absolute -right-1 2 w-30 -bottom-3"
          />
          <div className="pt-6 w-full flex flex-col items-center">
            <h1 className="text-white text-2xl font-bold tracking-tight rounded-lg px-4 py-2 w-full max-w-2xl text-center bg-transparent border-transparent outline-none overflow-hidden mb-3">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-white/90 text-sm rounded-lg px-4 w-full max-w-xl text-center bg-transparent border-transparent outline-none overflow-hidden pb-6 pt-2 -mt-5 whitespace-pre-wrap leading-relaxed">
                {form.description}
              </p>
            )}
          </div>
        </div>
        <div className="text-destructive mt-1 text-sm font-medium px-2">
          * Indicates required question
        </div>

        {/* Questions */}
        {form.questions.map((q) => (
          <FormQuestion
            key={q.id}
            question={{
              type: q.type as QuestionType,
              title: q.title,
              required: q.required,
              options: q.options,
            }}
            viewState="fill"
            answer={answers[q.id]}
            onAnswerChange={(val) => {
              setAnswers((prev) => ({ ...prev, [q.id]: val }));
            }}
          />
        ))}

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-2 shadow-md transition-all focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Submit"
            )}
          </button>
          <a
            href="#"
            className="hidden text-sm text-primary hover:underline font-medium"
          >
            Clear form
          </a>
        </div>
      </form>
    </div>
  );
}
