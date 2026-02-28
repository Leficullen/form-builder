import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId, unauthorized, forbidden, notFound, serverError } from "@/lib/api-helpers";
import { z } from "zod";

const questionSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
});

const formUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  questions: z.array(questionSchema).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const form = await prisma.form.findUnique({
      where: { id },
      include: { questions: { orderBy: { createdAt: "asc" } } },
    });
    if (!form) return notFound("Form not found");
    return NextResponse.json({ form: { ...form, date: form.createdAt.toISOString().split("T")[0] } });
  } catch (e) {
    return serverError(e);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const userId = getAuthUserId(req);
  if (!userId) return unauthorized();

  try {
    const body = formUpdateSchema.parse(await req.json());

    const existing = await prisma.form.findUnique({ where: { id } });
    if (!existing) return notFound("Form not found");
    if (existing.ownerId !== userId) return forbidden();

    if (body.questions) {
      const submissionCount = await prisma.submission.count({ where: { formId: id } });
      if (submissionCount > 0) {
        const keepIds = body.questions
          .filter((q: any) => q.id && !q.id.startsWith("new-"))
          .map((q: any) => q.id);
        const existingQuestions = await prisma.question.findMany({ where: { formId: id } });
        const deletedQuestions = existingQuestions.filter((eq) => !keepIds.includes(eq.id));
        if (deletedQuestions.length > 0) {
          return NextResponse.json(
            { message: "Cannot delete questions because submissions already exist for this form." },
            { status: 400 }
          );
        }
      }
    }

    await prisma.form.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status !== undefined && { status: body.status }),
      },
    });

    if (body.questions) {
      const keepIds: string[] = [];
      for (const q of body.questions) {
        const processedOptions = q.options ? q.options.filter(Boolean) : [];
        if (q.id && !q.id.startsWith("new-")) {
          await prisma.question.update({
            where: { id: q.id },
            data: { title: q.title, type: q.type, required: q.required ?? false, options: processedOptions },
          });
          keepIds.push(q.id);
        } else {
          const newQ = await prisma.question.create({
            data: { formId: id, title: q.title, type: q.type, required: q.required ?? false, options: processedOptions },
          });
          keepIds.push(newQ.id);
        }
      }
      await prisma.question.deleteMany({ where: { formId: id, id: { notIn: keepIds } } });
    }

    const finalForm = await prisma.form.findUnique({
      where: { id },
      include: { questions: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json({ form: finalForm });
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const userId = getAuthUserId(_req);
  if (!userId) return unauthorized();

  try {
    const existing = await prisma.form.findUnique({ where: { id } });
    if (!existing) return notFound("Form not found");
    if (existing.ownerId !== userId) return forbidden();
    await prisma.form.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return serverError(e);
  }
}
