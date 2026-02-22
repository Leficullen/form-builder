"use client";

import { useParams } from "next/navigation";
import { FormQuestion } from "@/components/FormQuestion";
import { getQuestionsByFormId } from "@/lib/dummy-data";

export default function PreviewFormPage() {
  const params = useParams();
  const formId = params.formId as string;

  const questions = getQuestionsByFormId(formId);

  return (
    <>
      {/* Form Questions */}
      {questions.map((q, idx) => (
        <FormQuestion key={q.id || idx} question={q} viewState="preview" />
      ))}
    </>
  );
}
