import React from "react";
import {
  RiDeleteBinLine as Trash2,
  RiListCheck as ListTodo,
} from "@remixicon/react";
import { cn } from "@/lib/utils";

interface FormCardProps {
  title: string;
  isPublished: boolean;
  description: string;
  questionCount: number;
  responseCount: number;
  date: string;   
  className?: string;
  onDelete?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

export function FormCard({
  title,
  isPublished,
  description,
  questionCount,
  responseCount,
  date,
  className,
  onDelete,
  onClick,
}: FormCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative border-border/50 bg-card transition-all duration-200 rounded-xl  hover:border-primary/50 border-2 hover:shadow-xs shadow-primary/30 cursor-pointer overflow-hidden flex flex-col h-full",
        className,
      )}
    >
      {/* Top Section */}

      <div className="space-y-2 mb-2 flex-1">
        <div className="flex items-center justify-between bg-linear-to-b from-primary to-primary/80  px-4 py-3">
          {/* Title */}
          <div>
            <h3 className="text-md md:text-xl font-semibold text-white leading-tight tracking-tight ">
              {title}
            </h3>
          </div>
          {/* Delete button */}
          <button
            type="button"
            className="rounded-full hover:text-destructive transition-colors p-1 -mr-2"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(e);
            }}
          >
            <Trash2 className="w-5 h-5 text-white hover:text-red-600 cursor-pointer transition-all duration-100 ease-in-out" />
          </button>
        </div>

        <div className="px-4 grid grid-cols-[1fr] gap-3 md:grid-cols-[4fr_1fr] w-full  justify-between">
          {/* Description */}
          <p className="text-foreground/70 dark:text-foreground/60 text-md leading-relaxed line-clamp-2 mt-2">
            {description}
          </p>
          {/* Status badges */}
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-semibold -ml-2 inline-block transition-colors items-center h-fit my-auto text-center items-center my-auto",
              isPublished
                ? "bg-[#DCFCE7] text-[#15803D] dark:bg-green-950/40 dark:text-green-400"
                : "bg-[#FBD3D4] text-[#D20004] dark:bg-orange-950/40 dark:text-orange-400",
            )}
          >
            {isPublished ? "Published" : "Not Published"}
          </span>
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-foreground/10 dark:border-foreground/5 flex items-center justify-between text-foreground/50 font-regular text-sm px-4 py-2">
        <div className="flex items-center gap-2">
          <span>{questionCount} Questions</span>
          <span>|</span>
          <span>{responseCount} Responses</span>
        </div>
        <span>{date}</span>
      </div>
    </div>
  );
}
