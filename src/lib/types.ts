export type QuestionType =
  | "SHORT ANSWER"
  | "PARAGRAPH"
  | "MULTIPLE CHOICE"
  | "CHECKBOXES"
  | "DROPDOWN"
  | "SHORT TEXT";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  isPublished: boolean;
  questionCount: number;
  date: string; // ISO or formatted
  bannerColor?: string;
}

export interface Question {
  id: string;
  formId: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: string[];
}

export interface ResponseStat {
  label: string;
  count: number;
  percentage: string;
  color: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  questionId: string;
  type: QuestionType;
  answers?: string[]; // for text answers
  stats?: ResponseStat[]; // for aggregate stats
  responsesCount?: number;
}
