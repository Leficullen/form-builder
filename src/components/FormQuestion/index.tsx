import React from "react";
import { RiDeleteBinLine as Trash2, RiCloseLine as X } from "@remixicon/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
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
  | "SHORT TEXT";

export type ViewState = "edit" | "preview" | "response" | "fill";

// Data structures for response stats
export interface ResponseStat {
  label: string;
  count: number;
  percentage: string;
  color: string;
  hexColor?: string;
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

  // Callbacks for fill mode
  answer?: any;
  onAnswerChange?: (newAnswer: any) => void;

  // Callbacks for edit mode
  onTitleChange?: (newTitle: string) => void;
  onTypeChange?: (newType: QuestionType) => void;
  onRequiredChange?: (isRequired: boolean) => void;
  onDelete?: () => void;
  onAddOption?: () => void;
  onOptionChange?: (index: number, newOption: string) => void;
  onRemoveOption?: (index: number) => void;
}

export function FormQuestion({
  question,
  viewState,
  answer,
  onAnswerChange,
  onTitleChange,
  onTypeChange,
  onRequiredChange,
  onDelete,
  onAddOption,
  onOptionChange,
  onRemoveOption,
}: FormQuestionProps) {
  const isEdit = viewState === "edit";
  const isPreview = viewState === "preview" || viewState === "fill";
  const isResponse = viewState === "response";

  const onDeleteQuestion = () => {
    onDelete?.();
  };

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
      {/* Header section*/}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 w-full">
        {/* Title Area */}
        <div className="flex items-start  gap-1 w-full">
          {isEdit ? (
            <div className="flex items-center gap-2 w-full">
              {question.required && (
                <span className="text-[#D20004] font-bold mt-1.5">*</span>
              )}
              <textarea
                className="text-base font-semibold text-foreground bg-transparent border-transparent outline-none focus:ring-0 focus:bg-muted/50 hover:bg-muted/30 transition-colors rounded-md px-2 py-1 -ml-2 flex-1 w-full cursor-text placeholder:text-muted-foreground/40 resize-none overflow-hidden"
                placeholder="Untitled Question"
                value={question.title}
                rows={1}
                onChange={(e) => {
                  onTitleChange?.(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
            </div>
          ) : (
            <h3 className="text-base font-semibold text-foreground pt-1.5 px-0.5 break-words flex items-center gap-1">
              {question.title || "Untitled Question"}
              {question.required && (
                <span className="text-[#D20004] font-bold">*</span>
              )}
            </h3>
          )}

          {isResponse && question.responsesCount && (
            <span className="ml-2 mt-1.5 font-medium text-muted-foreground text-xs">
              ({question.responsesCount} Responses)
            </span>
          )}
        </div>

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

      <div className={`pl-0.5 w-full${isPreview ? "pb-2" : ""}`}>
        {/* SHORT ANSWER / PARAGRAPH */}
        {(question.type === "SHORT ANSWER" ||
          question.type === "SHORT TEXT" ||
          question.type === "PARAGRAPH") && (
          <>
            {isEdit && (
              <Input
                type="text"
                value={question.options?.[0] || ""}
                onChange={(e) => onOptionChange?.(0, e.target.value)}
                placeholder={
                  question.type === "PARAGRAPH"
                    ? "Long answer text"
                    : "Short answer text"
                }
                className=" sm:w-1/2 bg-transparent border-t-0 border-x-0 border-b border-foreground/20 rounded-none pb-2 pt-1 px-0 text-sm text-muted-foreground outline-none font-medium placeholder:text-muted-foreground focus-visible:ring-0 shadow-none hover:bg-muted/10 cursor-text w-full"
              />
            )}
            {isPreview && (
              <div className="w-full pb-3">
                <Input
                  type="text"
                  placeholder={
                    question.options?.[0] || "Enter your answer here..."
                  }
                  className={
                    viewState === "fill"
                      ? "w-full text-sm text-foreground"
                      : "w-full text-sm text-foreground/50 "
                  }
                  value={viewState === "fill" ? answer || "" : undefined}
                  onChange={(e) => {
                    if (viewState === "fill" && onAnswerChange) {
                      onAnswerChange(e.target.value);
                    }
                  }}
                  required={viewState === "fill" ? question.required : false}
                />
              </div>
            )}
            {isResponse && question.answers && (
              <div className="flex flex-col gap-2.5 mt-2">
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
              <RadioGroup disabled className="flex flex-col gap-3">
                {question.options?.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3 w-full group">
                    <RadioGroupItem
                      value={opt}
                      className="opacity-100 border-foreground/30"
                    />
                    <div className="w-full">
                      <Input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          onOptionChange?.(i, e.target.value);
                        }}
                        placeholder={`Option ${i + 1}`}
                        className="text-[13px] font-medium text-foreground bg-transparent border-transparent outline-none focus:ring-0 focus:bg-muted/50 hover:bg-muted/30 transition-colors rounded px-2 py-1.5 -ml-2 w-full cursor-text"
                      />
                    </div>
                    {(question.options?.length || 0) > 1 && (
                      <button
                        className="p-1.5 shrink-0 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        onClick={() => onRemoveOption?.(i)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </RadioGroup>
            ) : isPreview ? (
              <RadioGroup
                name={`question-${question.title}`}
                className="gap-5 mt-2"
                value={viewState === "fill" ? answer : undefined}
                onValueChange={(val) => {
                  if (viewState === "fill" && onAnswerChange) {
                    onAnswerChange(val);
                  }
                }}
                required={viewState === "fill" ? question.required : false}
              >
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
              <div className="flex items-center gap-3 w-full pt-1">
                <div className="w-4 h-4 shrink-0" />
                <div className="w-full">
                  <span
                    className="text-[13px] font-bold text-primary dark:text-[#b19df5] cursor-pointer hover:underline px-0"
                    onClick={onAddOption}
                  >
                    + Add Option
                  </span>
                </div>
              </div>
            )}

            {isResponse && question.stats && (
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pl-2 mt-2">
                <div className="w-[120px] h-[120px] shrink-0">
                  {question.stats.some((s) => s.count > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={question.stats}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={55}
                          dataKey="count"
                          stroke="none"
                          isAnimationActive={false}
                        >
                          {question.stats.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.hexColor || "#ccc"}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            padding: "4px 8px",
                          }}
                          itemStyle={{
                            color: "#000",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center border-[4px] border-card shadow-sm text-[10px] text-muted-foreground font-medium">
                      No Data
                    </div>
                  )}
                </div>
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
              <div className="flex flex-col gap-3">
                {question.options?.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3 w-full group">
                    <Checkbox
                      disabled
                      className="opacity-100 border-foreground/30 shadow-none mt-0.5"
                    />
                    <div className="w-full">
                      <Input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          onOptionChange?.(i, e.target.value);
                        }}
                        placeholder={`Option ${i + 1}`}
                        className="text-[13px] font-medium text-foreground bg-transparent border-transparent outline-none focus:ring-0 focus:bg-muted/50 hover:bg-muted/30 transition-colors rounded px-2 py-1.5 -ml-2 w-full cursor-text"
                      />
                    </div>
                    {(question.options?.length || 0) > 1 && (
                      <button
                        className="p-1.5 shrink-0 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        onClick={() => onRemoveOption?.(i)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : isPreview ? (
              <div className="flex flex-col gap-5 mt-2">
                {question.options?.map((opt, i) => {
                  const isChecked =
                    viewState === "fill" ? (answer || []).includes(opt) : false;
                  return (
                    <div key={i} className="flex items-center gap-3 w-full">
                      <Checkbox
                        id={`q-${question.title}-${i}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (viewState === "fill" && onAnswerChange) {
                            const current = answer || [];
                            if (checked) {
                              onAnswerChange([...current, opt]);
                            } else {
                              onAnswerChange(
                                current.filter((v: string) => v !== opt),
                              );
                            }
                          }
                        }}
                      />
                      <Label
                        htmlFor={`q-${question.title}-${i}`}
                        className="text-[13px] font-medium text-foreground cursor-pointer"
                      >
                        {opt}
                      </Label>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {isEdit && (
              <div className="flex items-center gap-3 w-full pt-1">
                <div className="w-4 h-4 shrink-0" />
                <div className="w-full">
                  <span
                    className="text-[13px] font-bold text-primary dark:text-[#b19df5] cursor-pointer hover:underline px-0"
                    onClick={onAddOption}
                  >
                    + Add Option
                  </span>
                </div>
              </div>
            )}

            {isResponse && question.stats && (
              <div
                className="w-full mt-4"
                style={{
                  height: Math.max(150, question.stats.length * 45 + 40),
                }}
              >
                {question.stats.some((s) => s.count > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={question.stats}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        opacity={0.3}
                      />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="label"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "currentColor",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                        width={120}
                      />
                      <RechartsTooltip
                        cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          padding: "4px 8px",
                        }}
                        itemStyle={{
                          color: "#000",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      />
                      <Bar
                        dataKey="count"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                        label={{
                          position: "right",
                          fill: "currentColor",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {question.stats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.hexColor || "#ccc"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full rounded-2xl bg-muted flex items-center justify-center border border-card shadow-sm text-[13px] text-muted-foreground font-medium">
                    No Data
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* DROPDOWN */}
        {question.type === "DROPDOWN" && (
          <div className="flex flex-col gap-4">
            {isEdit &&
              question.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 w-full">
                  <span className="text-sm font-semibold text-muted-foreground/60 w-4 text-right">
                    {i + 1}.
                  </span>
                  <div className="w-full">
                    <Input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        onOptionChange?.(i, e.target.value);
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="text-[13px] font-medium text-foreground bg-transparent border-transparent outline-none focus:ring-0 focus:bg-muted/50 hover:bg-muted/30 transition-colors rounded px-2 py-1.5 -ml-2 w-full cursor-text"
                    />
                  </div>
                  {(question.options?.length || 0) > 1 && (
                    <button
                      className="p-1.5 shrink-0 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      onClick={() => onRemoveOption?.(i)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

            {isEdit && (
              <div className="flex items-center gap-3 w-full pt-1">
                <div className="w-4 shrink-0" />
                <div className="w-full">
                  <span
                    className="text-[13px] font-bold text-primary dark:text-[#b19df5] cursor-pointer hover:underline px-0"
                    onClick={onAddOption}
                  >
                    + Add Option
                  </span>
                </div>
              </div>
            )}

            {isPreview && (
              <div className="w-full sm:w-1/2 md:w-[220px] mt-2">
                <Select
                  value={viewState === "fill" ? answer : undefined}
                  onValueChange={(val) => {
                    if (viewState === "fill" && onAnswerChange) {
                      onAnswerChange(val);
                    }
                  }}
                  required={viewState === "fill" ? question.required : false}
                >
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
                <div className="w-[120px] h-[120px] shrink-0">
                  {question.stats.some((s) => s.count > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={question.stats}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={55}
                          dataKey="count"
                          stroke="none"
                          isAnimationActive={false}
                        >
                          {question.stats.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.hexColor || "#ccc"}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            padding: "4px 8px",
                          }}
                          itemStyle={{
                            color: "#000",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center border-[4px] border-card shadow-sm text-[10px] text-muted-foreground font-medium">
                      No Data
                    </div>
                  )}
                </div>
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
        <div className="flex items-center justify-between  border-foreground/70">
          <div className="flex items-center gap-3 pl-2">
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
            className="p-2 -mr-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      )}
    </div>
  );
}
