"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { FormQuestion } from "@/components/FormQuestion";
import { getQuestionsByFormId } from "@/lib/dummy-data";

export default function EditFormPage() {
  const params = useParams();
  const formId = params.formId as string;

  const questions = getQuestionsByFormId(formId);

  return (
    <>
      {/* Form Questions */}
      {questions.map((q, idx) => (
        <FormQuestion
          key={q.id || idx}
          question={q}
          viewState="edit"
          onTypeChange={(newType) => console.log(`Changed type to ${newType}`)}
          onRequiredChange={(req) => console.log(`Required changed to ${req}`)}
          onDelete={() => console.log("Delete question")}
          onAddOption={() => console.log("Add option")}
        />
      ))}

      {/* Add Question Button */}
      <div className="mt-2 w-full">
        <button className="w-full bg-[#3e2e85] hover:bg-[#3e2e85]/90 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-primary/20">
          <Plus className="w-[18px] h-[18px]" /> Add Question
        </button>
      </div>
    </>
  );
}
