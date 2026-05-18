import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest, authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", class: cls, subject } = req.query as Record<string, string | undefined>;
    const skip = (Math.max(1, +page) - 1) * Math.min(100, +limit); const take = Math.min(100, +limit);
    const where: Record<string, unknown> = {};
    if (cls) where.class = cls; if (subject) where.subject = subject;
    if (req.user!.role === "STUDENT") { const s = await prisma.student.findUnique({ where: { userId: req.user!.id } }); if (s) where.class = s.class; }
    const [data, total] = await Promise.all([
      prisma.assignment.findMany({ where, include: { submissions: { select: { id: true, studentId: true, status: true } } }, orderBy: { dueDate: "desc" }, skip, take }),
      prisma.assignment.count({ where }),
    ]);
    res.json({ success: true, data, pagination: { page: +page, limit: take, total, totalPages: Math.ceil(total / take) } });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { title, subject, class: cls, description, dueDate } = req.body;
    if (!title || !subject || !cls || !dueDate) { res.status(400).json({ success: false, error: "Required fields missing" }); return; }
    const a = await prisma.assignment.create({ data: { title, subject, class: cls, description: description || null, dueDate: new Date(dueDate) } });
    res.status(201).json({ success: true, data: a });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

export default router;
