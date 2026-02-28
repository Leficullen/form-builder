import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId, unauthorized, serverError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const userId = getAuthUserId(req);
  if (!userId) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const forms = await prisma.form.findMany({
      where: {
        ownerId: userId,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        _count: { select: { questions: true, submissions: true } },
      },
    });

    const mappedForms = forms.map((f: any) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      isPublished: f.status === "PUBLISHED",
      date: f.createdAt.toISOString().split("T")[0],
      questionCount: f._count.questions,
      responseCount: f._count.submissions,
    }));

    return NextResponse.json({ forms: mappedForms });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const userId = getAuthUserId(req);
  if (!userId) return unauthorized();

  try {
    const body = await req.json();
    const form = await prisma.form.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status ?? "DRAFT",
        ownerId: userId,
      },
    });
    return NextResponse.json({ form }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
