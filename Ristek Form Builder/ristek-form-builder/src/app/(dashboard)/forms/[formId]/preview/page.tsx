"use client";

import { useParams } from "next/navigation";
import { FormQuestion } from "@/components/FormQuestion";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function PreviewFormPage() {
  const params = useParams();
  const formId = params.formId as string;
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadForm() {
      try {
        const data = await fetchApi(`/forms/${formId}`);
        if (data?.form?.questions) {
          setQuestions(data.form.questions);
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
        questions.map((q, idx) => (
          <FormQuestion key={q.id || idx} question={q} viewState="preview" />
        ))
      )}
    </>
  );
}
