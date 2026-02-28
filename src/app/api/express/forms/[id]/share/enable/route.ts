import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId, unauthorized, forbidden, notFound, serverError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const userId = getAuthUserId(req);
  if (!userId) return unauthorized();

  try {
    const form = await prisma.form.findUnique({ where: { id } });
    if (!form) return notFound("Form not found");
    if (form.ownerId !== userId) return forbidden();
    if (form.status !== "PUBLISHED") {
      return NextResponse.json({ message: "Form must be published to share" }, { status: 400 });
    }

    const shareId = form.shareId ?? crypto.randomUUID();
    const updated = await prisma.form.update({
      where: { id: form.id },
      data: { isPublic: true, shareId },
    });

    return NextResponse.json({ formId: updated.id, isPublic: updated.isPublic, shareId: updated.shareId });
  } catch (e) {
    return serverError(e);
  }
}
