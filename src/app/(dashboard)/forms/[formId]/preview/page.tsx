"use client";

import { useParams } from "next/navigation";
import { FormQuestion } from "@/components/FormQuestion";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { RiLoader4Line as Loader2 } from "@remixicon/react";

export default function PreviewFormPage() {
  const params = useParams();
  const formId = (params?.formId as string) || "";
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadForm() {
      try {
        const data = await fetchApi(`/forms/${formId}`);
        if (data?.form) {
          setTitle(data.form.title || "");
          setDescription(data.form.description || "");
          if (data.form.questions) {
            setQuestions(data.form.questions);
          }
        }
      } catch (err) {
        console.error("Failed to fetch form for preview:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadForm();
  }, [formId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Form Questions */}
      {questions.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground w-full border border-foreground/10 rounded-2xl bg-background mt-6 font-medium">
          No questions yet.
        </div>
      ) : (
        // Banner
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
              {title}
            </h1>

            <p className="text-white/90 text-sm rounded-lg px-4 w-full max-w-xl text-center bg-transparent border-transparent outline-none overflow-hidden pb-6 pt-2 -mt-5">
              {description}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {questions.map((q, idx) => (
          <FormQuestion key={q.id || idx} question={q} viewState="preview" />
        ))}
      </div>
    </>
  );
}
