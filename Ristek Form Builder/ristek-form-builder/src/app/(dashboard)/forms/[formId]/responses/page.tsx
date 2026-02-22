"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormQuestion } from "@/components/FormQuestion";
import { getResponsesByFormId } from "@/lib/dummy-data";

export default function ResponsesPage() {
  const params = useParams();
  const formId = params.formId as string;

  const responses = getResponsesByFormId(formId);

  return (
    <>
      {/* Total Responses Banner */}
      <div className="w-full rounded-[20px] bg-gradient-to-r from-[#b1229f] to-[#e446ab] p-6 text-white shadow-sm flex flex-col shrink-0">
        <span className="text-sm font-semibold mb-2">Total Responses</span>
        <span className="text-4xl font-bold tracking-tight">24</span>
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
            {responses.map((q, idx) => (
              <FormQuestion
                key={q.id || idx}
                question={q as any}
                viewState="response"
              />
            ))}
          </TabsContent>

          <TabsContent value="individual">
            <div className="p-8 text-center text-muted-foreground w-full border border-foreground/10 rounded-2xl bg-background mt-6 font-medium">
              Individual responses will appear here.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
