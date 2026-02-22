import React from "react";
import { Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type QuestionType =
  | "SHORT ANSWER"
  | "PARAGRAPH"
  | "MULTIPLE CHOICE"
  | "CHECKBOXES"
  | "DROPDOWN"
  | "SHORT TEXT"; // In responses it uses SHORT TEXT

export type ViewState = "edit" | "preview" | "response";

// Data structures for response stats
export interface ResponseStat {
  label: string;
  count: number;
  percentage: string;
  color: string;
}

export interface QuestionData {
  type: QuestionType;
  title: string;
  required?: boolean;
  options?: string[];
  // Response specific fields
  responsesCount?: number;
  answers?: string[];
  stats?: ResponseStat[];
}

interface FormQuestionProps {
  question: QuestionData;
  viewState: ViewState;

  // Callbacks for edit mode
  onTypeChange?: (newType: QuestionType) => void;
  onRequiredChange?: (isRequired: boolean) => void;
  onDelete?: () => void;
  onAddOption?: () => void;
}

export function FormQuestion({
  question,
  viewState,
  onTypeChange,
  onRequiredChange,
  onDelete,
  onAddOption,
}: FormQuestionProps) {
  const isEdit = viewState === "edit";
  const isPreview = viewState === "preview";
  const isResponse = viewState === "response";

  // Shared Type Labels across Preview and Response
  const fixedTypeLabel = (
    <div className="shrink-0 flex items-center md:items-start pt-1.5 md:pl-4">
      <span className="text-[10px] font-bold tracking-widest text-foreground leading-none uppercase">
        {question.type}
      </span>
    </div>
  );

  return (
    <div className="bg-card border border-foreground/10 rounded-[20px] p-7 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-3">
      {/* Header section (Title + Type Dropdown / Label) */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <h3 className="text-md font-semibold text-foreground pt-1.5 flex items-center flex-wrap">
          {question.title}
          {question.required && (
            <span className="text-[#D20004] font-bold ml-0.5">*</span>
          )}
          {isResponse && question.responsesCount && (
            <span className="ml-2 font-medium text-muted-foreground text-xs">
              ({question.responsesCount} Responses)
            </span>
          )}
        </h3>

        {/* Type selector (Edit) or Label (Preview/Response) */}
        {isEdit ? (
          <div className="relative shrink-0 w-[200px] md:w-[180px]">
            <Select
              defaultValue={question.type}
              onValueChange={(val) => onTypeChange?.(val as QuestionType)}
            >
              <SelectTrigger className="h-11 font-bold tracking-widest text-[11px] uppercase">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHORT ANSWER">SHORT ANSWER</SelectItem>
                <SelectItem value="PARAGRAPH">PARAGRAPH</SelectItem>
                <SelectItem value="MULTIPLE CHOICE">MULTIPLE CHOICE</SelectItem>
                <SelectItem value="CHECKBOXES">CHECKBOXES</SelectItem>
                <SelectItem value="DROPDOWN">DROPDOWN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          fixedTypeLabel
        )}
      </div>

      {/* Content Area Based on State and Question Type */}
      <div className={`pl-0.5 ${isPreview ? "pb-2" : ""}`}>
        {/* SHORT ANSWER / PARAGRAPH */}
        {(question.type === "SHORT ANSWER" ||
          question.type === "SHORT TEXT" ||
          question.type === "PARAGRAPH") && (
          <>
            {isEdit && (
              <Input
                type="text"
                placeholder="Enter your answer here..."
                className="w-full bg-transparent pb-3 pt-1 text-xs text-foreground outline-none font-medium placeholder:text-muted-foreground focus:border-primary transition-colors cursor-text"
                readOnly
              />
            )}
            {isPreview && (
              <div className="w-full  pb-3">
                <Input
                  type="text"
                  placeholder="Enter your answer here..."
                  className="w-full text-sm"
                />
              </div>
            )}
            {isResponse && question.answers && (
              <div className="flex flex-col gap-2.5">
                {question.answers.map((ans, i) => (
                  <div
                    key={i}
                    className="bg-muted/50 rounded-xl px-4 py-3 border border-transparent dark:border-foreground/5"
                  >
                    <span className="text-[13px] text-foreground font-medium">
                      {ans}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MULTIPLE CHOICE */}
        {question.type === "MULTIPLE CHOICE" && (
          <div className="flex flex-col gap-4">
            {isEdit ? (
              <RadioGroup disabled className="flex flex-col gap-4">
                {question.options?.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3 w-full group">
                    <RadioGroupItem
                      value={opt}
                      className="opacity-100 border-foreground/30"
                    />
                    <div className="border-b border-foreground/20 w-full pb-2">
                      <span className="text-[13px] font-medium text-foreground">
                        {opt}
                      </span>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : isPreview ? (
              <RadioGroup name={`question-${question.title}`} className="gap-5">
                {question.options?.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3 w-full">
                    <RadioGroupItem
                      value={opt}
                      id={`q-${question.title}-${i}`}
                    />
                    <Label
                      htmlFor={`q-${question.title}-${i}`}
                      className="text-[13px] font-medium text-foreground cursor-pointer"
                    >
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : null}

            {isEdit && (
              <div className="flex items-center gap-3 w-full pt-0.5">
                <div className="w-4 h-4 shrink-0" />
                <div className="border-b border-foreground/20 w-full pb-2">
                  <span
                    className="text-[13px] font-bold text-[#3e2e85] dark:text-[#b19df5] cursor-pointer hover:underline"
                    onClick={onAddOption}
                  >
                    + Add Option
                  </span>
                </div>
              </div>
            )}

            {isResponse && question.stats && (
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pl-2 mt-2">
                <div className="w-[120px] h-[120px] shrink-0 rounded-full bg-[#b1229f] shadow-inner border-[4px] border-card"></div>
                <div className="flex w-full flex-col gap-3">
                  {question.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[13px] bg-muted/30 rounded-lg px-3 py-2 border border-transparent dark:border-foreground/5"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${stat.color}`}
                        ></div>
                        <span className="font-medium text-foreground">
                          {stat.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground font-medium">
                        <span>{stat.count}</span>
                        <span className="w-[45px] text-right">
                          {stat.percentage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHECKBOXES */}
        {question.type === "CHECKBOXES" && (
          <div className="flex flex-col gap-4">
            {isEdit ? (
              <div className="flex flex-col gap-4">
                {question.options?.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3 w-full group">
                    <Checkbox
                      disabled
                      className="opacity-100 border-foreground/30 shadow-none"
                    />
                    <div className="border-b border-foreground/20 w-full pb-2">
                      <span className="text-[13px] font-medium text-foreground">
                        {opt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : isPreview ? (
              <div className="flex flex-col gap-5">
                {question.options?.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3 w-full">
                    <Checkbox id={`q-${question.title}-${i}`} />
                    <Label
                      htmlFor={`q-${question.title}-${i}`}
                      className="text-[13px] font-medium text-foreground cursor-pointer"
                    >
                      {opt}
                    </Label>
                  </div>
                ))}
              </div>
            ) : null}

            {isEdit && (
              <div className="flex items-center gap-3 w-full pt-0.5">
                <div className="w-4 h-4 shrink-0" />
                <div className="border-b border-foreground/20 w-full pb-2">
                  <span
                    className="text-[13px] font-bold text-[#3e2e85] dark:text-[#b19df5] cursor-pointer hover:underline"
                    onClick={onAddOption}
                  >
                    + Add Option
                  </span>
                </div>
              </div>
            )}

            {isResponse && question.stats && (
              <div className="flex flex-col gap-5 mt-2">
                {question.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-foreground">
                        {stat.label}
                      </span>
                      <div className="flex items-center gap-4 text-muted-foreground font-medium">
                        <span>{stat.count}</span>
                        <span className="w-[45px] text-right">
                          {stat.percentage}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-[10px] bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color}`}
                        style={{ width: stat.percentage.replace(",", ".") }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DROPDOWN */}
        {question.type === "DROPDOWN" && (
          <div className="flex flex-col gap-4">
            {isEdit &&
              question.options?.map((opt, i) => (
                <div key={i} className="flex items-center w-full">
                  <div className="border-b border-foreground/20 w-full pb-2">
                    <span className="text-[13px] font-medium text-foreground">
                      {opt}
                    </span>
                  </div>
                </div>
              ))}
            {isEdit && (
              <div className="flex items-center w-full pt-0.5">
                <div className="border-b border-foreground/20 w-full pb-2">
                  <span
                    className="text-[13px] font-bold text-[#3e2e85] dark:text-[#b19df5] cursor-pointer hover:underline"
                    onClick={onAddOption}
                  >
                    + Add Option
                  </span>
                </div>
              </div>
            )}

            {isPreview && (
              <div className="w-full sm:w-1/2 md:w-[220px]">
                <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Click here to select" />
                  </SelectTrigger>
                  <SelectContent>
                    {question.options?.map((opt, i) => (
                      <SelectItem key={i} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isResponse && question.stats && (
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pl-2 mt-2">
                <div className="w-[120px] h-[120px] shrink-0 rounded-full bg-[#b1229f] shadow-inner border-[4px] border-card"></div>
                <div className="flex w-full flex-col gap-3">
                  {question.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[13px] bg-muted/30 rounded-lg px-3 py-2 border border-transparent dark:border-foreground/5"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${stat.color}`}
                        ></div>
                        <span className="font-medium text-foreground">
                          {stat.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground font-medium">
                        <span>{stat.count}</span>
                        <span className="w-[45px] text-right">
                          {stat.percentage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Mode Footer */}
      {isEdit && (
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-transparent">
          <div className="flex items-center gap-3">
            <Checkbox
              id={`required-${question.title}`}
              checked={question.required}
              onCheckedChange={(checked) =>
                onRequiredChange?.(checked === true)
              }
            />
            <Label
              htmlFor={`required-${question.title}`}
              className="text-[13px] font-semibold text-foreground/70 cursor-pointer"
            >
              Required
            </Label>
          </div>

          <button
            className="p-2 -mr-2 text-muted-foreground/50 hover:text-destructive transition-colors rounded-full hover:bg-muted"
            onClick={onDelete}
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      )}
    </div>
  );
}
