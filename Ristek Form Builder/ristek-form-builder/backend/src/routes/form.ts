import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

const questionSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
});

const formCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  questions: z.array(questionSchema).optional(),
});

router.get("/", requireAuth as any, async (req: any, res, next) => {
  try {
    const forms = await prisma.form.findMany({
      where: { ownerId: req.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        _count: {
          select: { questions: true },
        },
      },
    });

    const mappedForms = forms.map((f: any) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      isPublished: f.status === "PUBLISHED",
      date: f.createdAt.toISOString().split("T")[0],
      questionCount: f._count.questions,
    }));

    res.json({ forms: mappedForms });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const form = await prisma.form.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json({
      form: { ...form, date: form.createdAt.toISOString().split("T")[0] },
    });
  } catch (e) {
    next(e);
  }
});

router.post("/", requireAuth as any, async (req: any, res, next) => {
  try {
    const body = formCreateSchema.parse(req.body);

    const form = await prisma.form.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status ?? "DRAFT",
        ownerId: req.userId,
      },
    });

    res.status(201).json({ form });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", requireAuth as any, async (req: any, res, next) => {
  try {
    const body = formCreateSchema.partial().parse(req.body);

    const existing = await prisma.form.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) return res.status(404).json({ message: "Form not found" });
    if (existing.ownerId !== req.userId)
      return res.status(403).json({ message: "Forbidden" });

    // Use a top level transaction to ensure the questions logic reliably completes without partial deletions
    const finalForm = await prisma.$transaction(async (tx: any) => {
      const updated = await tx.form.update({
        where: { id: req.params.id },
        data: {
          title: body.title,
          description: body.description,
          status: body.status,
        },
      });

      if (body.questions) {
        const keepIds: string[] = [];

        for (const q of body.questions) {
          const processedOptions = q.options ? q.options.filter(Boolean) : []; // ensure clean options string array

          if (q.id && !q.id.startsWith("new-")) {
            const updatedQ = await tx.question.upsert({
              where: { id: q.id },
              update: {
                title: q.title,
                type: q.type,
                required: q.required ?? false,
                options: processedOptions,
              },
              create: {
                formId: updated.id,
                title: q.title,
                type: q.type,
                required: q.required ?? false,
                options: processedOptions,
              },
            });
            keepIds.push(updatedQ.id);
          } else {
            const newQ = await tx.question.create({
              data: {
                formId: updated.id,
                title: q.title,
                type: q.type,
                required: q.required ?? false,
                options: processedOptions,
              },
            });
            keepIds.push(newQ.id);
          }
        }

        // Delete any questions not explicitly kept in the latest update
        await tx.question.deleteMany({
          where: {
            formId: updated.id,
            id: { notIn: keepIds },
          },
        });
      }

      // Re-fetch populated object representing full state
      return await tx.form.findUnique({
        where: { id: updated.id },
        include: { questions: { orderBy: { createdAt: "asc" } } },
      });
    });

    res.json({ form: finalForm });
  } catch (e) {
    console.error("PUT /forms/:id ERROR CAUGHT:", e);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: String(e) });
  }
});

router.delete("/:id", requireAuth as any, async (req: any, res, next) => {
  try {
    const existing = await prisma.form.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) return res.status(404).json({ message: "Form not found" });
    if (existing.ownerId !== req.userId)
      return res.status(403).json({ message: "Forbidden" });

    await prisma.form.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
