"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormQuestion } from "@/components/FormQuestion";
import { fetchApi } from "@/lib/api";
import {
  RiLoader4Line as Loader2,
  RiArrowLeftSLine as ChevronLeft,
  RiArrowRightSLine as ChevronRight,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";

export default function ResponsesPage() {
  const params = useParams();
  const formId = (params?.formId as string) || "";

  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [summaryQuestions, setSummaryQuestions] = useState<any[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadResponses() {
      try {
        const res = await fetchApi(`/forms/${formId}/submissions`);
        if (res.form && res.submissions) {
          setForm(res.form);
          setSubmissions(res.submissions);

          const colorsPairs = [
            { bgClass: "bg-[#6be0ff]", hex: "#6be0ff" },
            { bgClass: "bg-[#b1229f]", hex: "#b1229f" },
            { bgClass: "bg-[#ffdf6b]", hex: "#ffdf6b" },
            { bgClass: "bg-[#059669]", hex: "#059669" },
            { bgClass: "bg-[#b91c1c]", hex: "#b91c1c" },
          ];

          const summary = res.form.questions.map((q: any) => {
            const questionAnswers = res.submissions
              .map(
                (sub: any) =>
                  sub.answers.find((a: any) => a.questionId === q.id)?.value,
              )
              .filter(
                (val: any) => val !== undefined && val !== null && val !== "",
              );

            let stats: any[] | undefined = undefined;
            let formattedAnswers: string[] | undefined = undefined;

            if (
              ["MULTIPLE CHOICE", "DROPDOWN", "CHECKBOXES"].includes(q.type)
            ) {
              stats = (q.options || []).map((opt: string, i: number) => {
                let count = 0;
                questionAnswers.forEach((ans: any) => {
                  if (typeof ans === "string") {
                    // Checkboxes store as JSON array string
                    if (ans.startsWith("[")) {
                      try {
                        const parsed = JSON.parse(ans);
                        if (Array.isArray(parsed) && parsed.includes(opt))
                          count++;
                      } catch (e) {}
                    } else if (ans === opt) {
                      count++;
                    }
                  }
                });
                const percentage =
                  questionAnswers.length > 0
                    ? ((count / questionAnswers.length) * 100).toFixed(1) + "%"
                    : "0%";

                const pair = colorsPairs[i % colorsPairs.length];
                return {
                  label: opt,
                  count,
                  percentage: percentage.replace(".0%", "%"),
                  color: pair.bgClass,
                  hexColor: pair.hex,
                };
              });
            } else {
              formattedAnswers = questionAnswers;
            }

            return {
              ...q,
              responsesCount: questionAnswers.length,
              answers: formattedAnswers,
              stats,
            };
          });

          setSummaryQuestions(summary);
        }
      } catch (error) {
        console.error("Failed to load responses:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadResponses();
  }, [formId]);

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentSubmission = submissions[currentIndex];

  const handleNext = () => {
    if (currentIndex < submissions.length - 1)
      setCurrentIndex(currentIndex + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-16 pt-4 md:pt-0">
      {/* Total Responses Banner */}
      <div className="w-full rounded-[20px] bg-gradient-to-r from-[#b1229f] to-[#e446ab] p-6 text-white shadow-sm flex flex-col shrink-0">
        <span className="text-sm font-semibold mb-2">Total Responses</span>
        <span className="text-4xl font-bold tracking-tight">
          {submissions.length}
        </span>
      </div>

      {/* Tabs for Summary/Individual */}
      <div className="w-full">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList variant="underline" className="w-full flex">
            <TabsTrigger value="summary" className="flex-1 text-center">
              Summary
            </TabsTrigger>
            <TabsTrigger value="individual" className="flex-1 text-center">
              Individual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6 flex flex-col gap-5">
            {submissions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground w-full border border-foreground/10 rounded-2xl bg-background mt-6 font-medium">
                No responses yet.
              </div>
            ) : (
              summaryQuestions.map((q, idx) => (
                <FormQuestion
                  key={q.id || idx}
                  question={q}
                  viewState="response"
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="individual">
            {submissions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground w-full border border-foreground/10 rounded-2xl bg-background mt-6 font-medium">
                No individual responses.
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border rounded-2xl p-4 shadow-sm bg-primary">
                  <span className="font-semibold text-sm text-white">
                    Response {currentIndex + 1} of {submissions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="p-2 rounded-full hover:bg-background/20 disabled:opacity-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 cursor-pointer text-white" />
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={currentIndex === submissions.length - 1}
                      className="p-2 rounded-full hover:bg-background/20 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="w-full rounded-2xl bg-card border shadow-sm p-6 mb-2">
                    <p className="text-sm text-muted-foreground mb-1">
                      Submitted at
                    </p>
                    <p className="font-medium text-foreground">
                      {new Date(currentSubmission.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {form?.questions.map((q: any) => {
                    const ans = currentSubmission.answers.find(
                      (a: any) => a.questionId === q.id,
                    )?.value;
                    let displayValue = ans;
                    if (typeof ans === "string" && ans.startsWith("[")) {
                      try {
                        const parsed = JSON.parse(ans);
                        displayValue = Array.isArray(parsed)
                          ? parsed.join(", ")
                          : ans;
                      } catch (e) {}
                    }
                    return (
                      <div
                        key={q.id}
                        className="w-full rounded-2xl bg-card border shadow-sm p-6 flex flex-col gap-2"
                      >
                        <span className="font-medium text-lg">{q.title}</span>
                        <div className="text-base text-muted-foreground/90 mt-2 bg-muted/50 p-4 rounded-xl">
                          {displayValue || (
                            <span className="italic opacity-50">
                              No answer provided
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
