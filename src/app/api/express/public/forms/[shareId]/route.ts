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


