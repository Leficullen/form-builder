import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId, unauthorized, forbidden, notFound, serverError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const userId = getAuthUserId(req);
  if (!userId) return unauthorized();

  try {
    const form = await prisma.form.findUnique({
      where: { id },
      include: { questions: { orderBy: { createdAt: "asc" } } },
    });
    if (!form) return notFound("Form not found");
    if (form.ownerId !== userId) return forbidden();

    const submissions = await prisma.submission.findMany({
      where: { formId: form.id },
      orderBy: { createdAt: "asc" },
      include: { answers: true },
    });

    return NextResponse.json({ form, submissions });
  } catch (e) {
    return serverError(e);
  }
}
