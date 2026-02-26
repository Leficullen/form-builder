"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, CheckCircle2, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { FormQuestion } from "@/components/FormQuestion";
import { fetchApi } from "@/lib/api";

export default function EditFormPage() {
  const params = useParams();
  const formId = params.formId as string;
  const [questions, setQuestions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadForm() {
      try {
        const data = await fetchApi(`/forms/${formId}`);
        if (data?.form) {
          setTitle(data.form.title || "");
          setDescription(data.form.description || "");
          setQuestions(data.form.questions || []);
        }
      } catch (err) {
        console.error("Failed to fetch form:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadForm();
  }, [formId]);

  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "error" | ""
  >("");

  const latestData = useRef({ title, description, questions });
  useEffect(() => {
    latestData.current = { title, description, questions };
  }, [title, description, questions]);

  useEffect(() => {
    return () => {
      const {
        title: finalTitle,
        description: finalDesc,
        questions: finalQuestions,
      } = latestData.current;
      if (!finalTitle && !finalDesc && !finalQuestions.length) return;

      fetchApi(`/forms/${formId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: finalTitle,
          description: finalDesc,
          questions: finalQuestions,
        }),
        keepalive: true,
      }).catch((err) => {
        console.error("Failed to save on unmount:", err);
      });
    };
  }, [formId]);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    setSaveStatus("saving");
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetchApi(`/forms/${formId}`, {
          method: "PUT",
          body: JSON.stringify({
            title,
            description,
            questions,
          }),
        });

        if (res?.form?.questions) {
          setQuestions((prevData) => {
            if (prevData.length !== res.form.questions.length) return prevData;

            let changed = false;
            const newData = prevData.map((q, i) => {
              if (q.id && q.id.startsWith("new-") && res.form.questions[i].id) {
                changed = true;
                return { ...q, id: res.form.questions[i].id };
              }
              return q;
            });

            return changed ? newData : prevData;
          });
        }

        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to auto-save form:", error);
        setSaveStatus("error");
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [title, description, questions, formId]);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `new-${Date.now()}`,
      formId,
      type: "SHORT ANSWER" as const,
      title: "Untitled Question",
      required: false,
    };
    setQuestions([...questions, newQuestion] as any);
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto w-full p-8 flex flex-col gap-5 flex-1 pb-16 relative">
        {/* Save Status Indicator */}
        <div className="absolute top-2 right-8 flex items-center justify-end text-xs font-medium text-muted-foreground/80">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving changes...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-primary/80">
              <CheckCircle2 className="w-3.5 h-3.5" /> All changes saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-destructive">Failed to save changes</span>
          )}
        </div>

        {/* Banner */}
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
            <textarea
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              rows={1}
              placeholder="Untitled Form"
              className="text-white text-2xl font-bold tracking-tight rounded-lg px-4 py-2 w-full max-w-2xl text-center bg-transparent border-transparent outline-none focus:ring-0 focus:bg-white/10 hover:bg-white/5 transition-colors placeholder:text-white cursor-text resize-none overflow-hidden mb-3"
            />

            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              rows={1}
              placeholder="Form Description"
              className="text-white/90 text-sm rounded-lg px-4 py-2 w-full max-w-xl text-center bg-transparent border-transparent outline-none focus:ring-0 focus:bg-white/10 hover:bg-white/5 transition-colors placeholder:text-white cursor-text resize-none overflow-hidden"
            />
          </div>
        </div>

        {/* Form Questions */}
        {questions.map((q, idx) => (
          <FormQuestion
            key={idx}
            question={q as any}
            viewState="edit"
            onTitleChange={(newTitle) => {
              const newQuestions = [...questions];
              newQuestions[idx] = {
                ...newQuestions[idx],
                title: newTitle,
              } as any;
              setQuestions(newQuestions);
            }}
            onOptionChange={(optIdx, newOpt) => {
              const newQuestions = [...questions];
              const qOpts = [...((newQuestions[idx] as any).options || [])];
              qOpts[optIdx] = newOpt;
              newQuestions[idx] = {
                ...newQuestions[idx],
                options: qOpts,
              } as any;
              setQuestions(newQuestions);
            }}
            onRemoveOption={(optIdx) => {
              const newQuestions = [...questions];
              const qOpts = [...((newQuestions[idx] as any).options || [])];
              qOpts.splice(optIdx, 1);
              newQuestions[idx] = {
                ...newQuestions[idx],
                options: qOpts,
              } as any;
              setQuestions(newQuestions);
            }}
            onTypeChange={(newType) => {
              const newQuestions = [...questions];
              newQuestions[idx] = {
                ...newQuestions[idx],
                type: newType,
              } as any;
              if (
                ["MULTIPLE CHOICE", "CHECKBOXES", "DROPDOWN"].includes(
                  newType,
                ) &&
                !(newQuestions[idx] as any).options
              ) {
                (newQuestions[idx] as any).options = ["Option 1"];
              }
              setQuestions(newQuestions);
            }}
            onRequiredChange={(req) => {
              const newQuestions = [...questions];
              newQuestions[idx] = {
                ...newQuestions[idx],
                required: req,
              } as any;
              setQuestions(newQuestions);
            }}
            onDelete={() => {
              const newQuestions = questions.filter((_, i) => i !== idx);
              setQuestions(newQuestions);
            }}
            onAddOption={() => {
              const newQuestions = [...questions];
              const qOpts = (newQuestions[idx] as any).options || [];
              newQuestions[idx] = {
                ...newQuestions[idx],
                options: [...qOpts, `Option ${qOpts.length + 1}`],
              } as any;
              setQuestions(newQuestions);
            }}
          />
        ))}

        {/* Add Question Button */}
        <div className="mt-2 w-full">
          <button
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-primary/20"
            onClick={handleAddQuestion}
          >
            <Plus className="w-[18px] h-[18px]" /> Add Question
          </button>
        </div>
      </div>
    </>
  );
}
