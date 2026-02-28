import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notFound, serverError } from "@/lib/api-helpers";

type Params = { params: Promise<{ shareId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { shareId } = await params;
  try {
    const form = await prisma.form.findUnique({
      where: { shareId },
      include: { questions: { orderBy: { createdAt: "asc" } } },
    });

    if (!form || !form.isPublic || form.status !== "PUBLISHED") {
      return notFound("Form not found");
    }

    return NextResponse.json({
      form: {
        id: form.id,
        title: form.title,
        description: form.description,
        questions: form.questions.map((q) => ({
          id: q.id,
          type: q.type,
          title: q.title,
          required: q.required,
          options: q.options,
        })),
      },
    });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const { shareId } = await params;
  try {
    const form = await prisma.form.findUnique({
      where: { shareId },
      include: { questions: true },
    });

    if (!form || !form.isPublic || form.status !== "PUBLISHED") {
      return notFound("Form not found");
    }

    const { answers } = await req.json();
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ message: "Invalid request format: answers must be an array" }, { status: 400 });
    }

    const errors: string[] = [];
    for (const q of form.questions) {
      const answer = answers.find((a: any) => a.questionId === q.id);
      if (q.required && (!answer || answer.value === undefined || answer.value === null || answer.value === "")) {
        errors.push(`Question "${q.title}" is required.`);
      }
    }
    if (errors.length > 0) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const sub = await prisma.submission.create({
      data: { formId: form.id, userAgent: req.headers.get("user-agent") || null },
    });

    for (const answer of answers) {
      const q = form.questions.find((fq: any) => fq.id === answer.questionId);
      if (q && answer.value !== undefined && answer.value !== null && answer.value !== "") {
        await prisma.answer.create({
          data: { submissionId: sub.id, questionId: q.id, value: answer.value },
        });
      }
    }

    return NextResponse.json({ submissionId: sub.id }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
