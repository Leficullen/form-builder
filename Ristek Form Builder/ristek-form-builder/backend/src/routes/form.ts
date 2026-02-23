import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

const formCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
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
      },
    });

    const mappedForms = forms.map((f:any) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      isPublished: f.status === "PUBLISHED",
      date: f.createdAt.toISOString().split("T")[0],
      questionCount: 0,
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
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
      },
    });
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json({ form });
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

    const updated = await prisma.form.update({
      where: { id: req.params.id },
      data: body,
    });

    res.json({ form: updated });
  } catch (e) {
    next(e);
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
