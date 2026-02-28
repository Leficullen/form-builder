import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/forms/:shareId", async (req, res, next) => {
  try {
    const form = await prisma.form.findUnique({
      where: { shareId: req.params.shareId },
      include: {
        questions: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!form || !form.isPublic || form.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({
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
    next(e);
  }
});

router.post("/forms/:shareId/submissions", async (req, res, next) => {
  try {
    const form = await prisma.form.findUnique({
      where: { shareId: req.params.shareId },
      include: { questions: true },
    });

    if (!form || !form.isPublic || form.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Form not found" });
    }

    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ message: "Invalid request format: answers must be an array" });
    }

    // Validation
    const errors: string[] = [];
    for (const q of form.questions) {
      const answer = answers.find((a: any) => a.questionId === q.id);
      if (
        q.required &&
        (!answer ||
          answer.value === undefined ||
          answer.value === null ||
          answer.value === "")
      ) {
        errors.push(`Question "${q.title}" is required.`);
        continue;
      }

      if (
        answer &&
        answer.value !== undefined &&
        answer.value !== null &&
        answer.value !== ""
      ) {
        // Option validation
        if (q.type === "MULTIPLE_CHOICE" || q.type === "DROPDOWN") {
          if (!q.options.includes(String(answer.value))) {
            errors.push(`Invalid option for "${q.title}".`);
          }
        }
        if (q.type === "CHECKBOX") {
          if (!Array.isArray(answer.value)) {
            errors.push(`Invalid format for "${q.title}", must be an array.`);
          } else {
            for (const val of answer.value) {
              if (!q.options.includes(String(val))) {
                errors.push(
                  `Invalid option "${val}" for checking "${q.title}".`,
                );
              }
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // Save
    const submission = await prisma.$transaction(async (tx) => {
      const sub = await tx.submission.create({
        data: {
          formId: form.id,
          userAgent: req.headers["user-agent"] || null,
        },
      });

      for (const answer of answers) {
        const q = form.questions.find((fq) => fq.id === answer.questionId);
        if (
          q &&
          answer.value !== undefined &&
          answer.value !== null &&
          answer.value !== ""
        ) {
          await tx.answer.create({
            data: {
              submissionId: sub.id,
              questionId: q.id,
              value: answer.value as any,
            },
          });
        }
      }

      return sub;
    });

    res.status(201).json({ submissionId: submission.id });
  } catch (e) {
    next(e);
  }
});

export default router;
