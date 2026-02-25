"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

  const handleTextChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleCheckboxChange = (qId: string, val: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = prev[qId] || [];
      if (checked) {
        return { ...prev, [qId]: [...current, val] };
      } else {
        return { ...prev, [qId]: current.filter((v: string) => v !== val) };
      }
    });
  };

  const handleRadioChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSelectChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

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
      <div className="min-h-screen bg-[#F3E8FF] dark:bg-background pt-16 p-4">
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
    <div className="min-h-screen bg-[#F3E8FF] dark:bg-background py-16 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex flex-col gap-6"
      >
        {/* Form Header */}
        <div className="bg-card rounded-2xl p-8 border-t-[12px] border-primary shadow-sm">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {form.description}
            </p>
          )}
          <div className="text-destructive mt-6 text-sm font-medium">
            * Indicates required question
          </div>
        </div>

        {/* Questions */}
        {form.questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-card rounded-2xl p-8 shadow-sm border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {idx + 1}. {q.title}
              {q.required && <span className="text-destructive ml-1">*</span>}
            </h2>

            {q.type === "SHORT ANSWER" && (
              <input
                type="text"
                required={q.required}
                className="w-full border-b-2 border-border focus:border-primary bg-transparent py-2 outline-none transition-colors text-foreground"
                placeholder="Your answer"
                value={answers[q.id] || ""}
                onChange={(e) => handleTextChange(q.id, e.target.value)}
              />
            )}

            {q.type === "MULTIPLE CHOICE" && (
              <div className="flex flex-col gap-3">
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        required={q.required}
                        checked={answers[q.id] === opt}
                        onChange={() => handleRadioChange(q.id, opt)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 rounded-full border-2 border-border peer-checked:border-primary flex items-center justify-center transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform"></div>
                      </div>
                    </div>
                    <span className="text-foreground/90">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "CHECKBOXES" && (
              <div className="flex flex-col gap-3">
                {q.options.map((opt, i) => {
                  const isChecked = (answers[q.id] || []).includes(opt);
                  return (
                    <label
                      key={i}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          value={opt}
                          checked={isChecked}
                          onChange={(e) =>
                            handleCheckboxChange(q.id, opt, e.target.checked)
                          }
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 rounded-[4px] border-2 border-border peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-colors">
                          <svg
                            className={`w-3 h-3 text-white ${isChecked ? "opacity-100" : "opacity-0"} transition-opacity`}
                            viewBox="0 0 14 10"
                            fill="none"
                          >
                            <path
                              d="M1 5L4.5 8.5L13 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <span className="text-foreground/90">{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {q.type === "DROPDOWN" && (
              <select
                required={q.required}
                className="w-full md:max-w-xs border border-border rounded-xl px-4 py-3 bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                value={answers[q.id] || ""}
                onChange={(e) => handleSelectChange(q.id, e.target.value)}
              >
                <option value="" disabled>
                  Choose
                </option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
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
