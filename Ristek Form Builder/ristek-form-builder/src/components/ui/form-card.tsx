import React from "react";
import { Trash2, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormCardProps {
  title: string;
  isPublished: boolean;
  description: string;
  questionCount: number;
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
  date,
  className,
  onDelete,
  onClick,
}: FormCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative border-border/50 bg-card transition-all duration-200 rounded-xl p-8 shadow-sm hover:border-primary/50 border-2 cursor-pointer overflow-hidden flex flex-col h-full",
        className,
      )}
    >
      {/* Top Section */}

      <div className="space-y-1 mb-2 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground leading-tight tracking-tight">
            {title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(e);
            }}
            className="text-muted-foreground/40 hover:text-destructive transition-colors p-2 -mr-2"
          >
            <Trash2 className="w-7 h-7" />
          </button>
        </div>

        <div>
          <span
            className={cn(
              "px-5 py-2 rounded-full text-sm -ml-2 font-semibold inline-block transition-colors",
              isPublished
                ? "bg-[#DCFCE7] text-[#15803D] dark:bg-green-950/40 dark:text-green-400"
                : "bg-[#FBD3D4] text-[#D20004] dark:bg-orange-950/40 dark:text-orange-400",
            )}
          >
            {isPublished ? "Published" : "Not Published"}
          </span>
        </div>
        <p className="text-foreground/70 dark:text-foreground/60 text-md leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Footer Section */}
      <div className="pt-6 border-t border-foreground/10 dark:border-foreground/5 flex items-center justify-between text-muted-foreground font-regular text-sm">
        <span>{questionCount} Questions</span>
        <span>{date}</span>
      </div>
    </div>
  );
}
