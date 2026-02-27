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
          select: { questions: true, submissions: true },
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
      responseCount: f._count.submissions,
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

    const submissionCount = await prisma.submission.count({
      where: { formId: req.params.id },
    });

    if (submissionCount > 0 && body.questions) {
      const keepIds = body.questions
        .filter((q: any) => q.id && !q.id.startsWith("new-"))
        .map((q: any) => q.id);
      const existingQuestions = await prisma.question.findMany({
        where: { formId: req.params.id },
      });

      const deletedQuestions = existingQuestions.filter(
        (eq) => !keepIds.includes(eq.id),
      );
      if (deletedQuestions.length > 0) {
        return res.status(400).json({
          message:
            "Cannot delete questions because submissions already exist for this form.",
        });
      }

      for (const q of body.questions) {
        if (q.id && !q.id.startsWith("new-")) {
          const eq = existingQuestions.find((ex) => ex.id === q.id);
          if (eq && eq.type !== q.type) {
            return res.status(400).json({
              message: `Cannot change type of a question because submissions already exist for this form.`,
            });
          }
        }
      }
    }

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
          const processedOptions = q.options ? q.options.filter(Boolean) : []; 

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

        await tx.question.deleteMany({
          where: {
            formId: updated.id,
            id: { notIn: keepIds },
          },
        });
      }

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

import crypto from "crypto";

router.post(
  "/:id/share/enable",
  requireAuth as any,
  async (req: any, res, next) => {
    try {
      const form = await prisma.form.findUnique({
        where: { id: req.params.id },
      });
      if (!form) return res.status(404).json({ message: "Form not found" });
      if (form.ownerId !== req.userId)
        return res.status(403).json({ message: "Forbidden" });
      if (form.status !== "PUBLISHED")
        return res
          .status(400)
          .json({ message: "Form must be published to share" });

      let shareId = form.shareId;
      if (!shareId) {
        shareId = crypto.randomUUID();
      }

      const updated = await prisma.form.update({
        where: { id: form.id },
        data: { isPublic: true, shareId },
      });

      res.json({
        formId: updated.id,
        isPublic: updated.isPublic,
        shareId: updated.shareId,
      });
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  "/:id/share/disable",
  requireAuth as any,
  async (req: any, res, next) => {
    try {
      const form = await prisma.form.findUnique({
        where: { id: req.params.id },
      });
      if (!form) return res.status(404).json({ message: "Form not found" });
      if (form.ownerId !== req.userId)
        return res.status(403).json({ message: "Forbidden" });

      const updated = await prisma.form.update({
        where: { id: form.id },
        data: { isPublic: false },
      });

      res.json({ formId: updated.id, isPublic: updated.isPublic });
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  "/:id/share/regenerate",
  requireAuth as any,
  async (req: any, res, next) => {
    try {
      const form = await prisma.form.findUnique({
        where: { id: req.params.id },
      });
      if (!form) return res.status(404).json({ message: "Form not found" });
      if (form.ownerId !== req.userId)
        return res.status(403).json({ message: "Forbidden" });
      if (form.status !== "PUBLISHED")
        return res
          .status(400)
          .json({ message: "Form must be published to share" });

      const shareId = crypto.randomUUID();
      const updated = await prisma.form.update({
        where: { id: form.id },
        data: { isPublic: true, shareId },
      });

      res.json({
        formId: updated.id,
        isPublic: updated.isPublic,
        shareId: updated.shareId,
      });
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/:id/submissions",
  requireAuth as any,
  async (req: any, res, next) => {
    try {
      const form = await prisma.form.findUnique({
        where: { id: req.params.id },
        include: {
          questions: { orderBy: { createdAt: "asc" } },
        },
      });
      if (!form) return res.status(404).json({ message: "Form not found" });
      if (form.ownerId !== req.userId)
        return res.status(403).json({ message: "Forbidden" });

      const submissions = await prisma.submission.findMany({
        where: { formId: form.id },
        orderBy: { createdAt: "asc" },
        include: {
          answers: true,
        },
      });

      res.json({ form, submissions });
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/:id/submissions/:submissionId",
  requireAuth as any,
  async (req: any, res, next) => {
    try {
      const form = await prisma.form.findUnique({
        where: { id: req.params.id },
      });
      if (!form) return res.status(404).json({ message: "Form not found" });
      if (form.ownerId !== req.userId)
        return res.status(403).json({ message: "Forbidden" });

      const submission = await prisma.submission.findUnique({
        where: { id: req.params.submissionId },
        include: {
          answers: {
            include: {
              question: true,
            },
          },
        },
      });

      if (!submission || submission.formId !== form.id) {
        return res.status(404).json({ message: "Submission not found" });
      }

      const formattedAnswers = submission.answers.map((a: any) => ({
        questionId: a.questionId,
        questionLabel: a.question.title,
        questionType: a.question.type,
        value: a.value,
      }));

      res.json({
        submission: {
          id: submission.id,
          createdAt: submission.createdAt,
          answers: formattedAnswers,
        },
      });
    } catch (e) {
      next(e);
    }
  },
);

export default router;
