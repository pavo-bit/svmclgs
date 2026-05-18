import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest, authenticate, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/results
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", studentId, examName } = req.query as Record<string, string | undefined>;
    const skip = (Math.max(1, +page) - 1) * Math.min(100, +limit);
    const take = Math.min(100, +limit);
    const where: Record<string, unknown> = {};
    if (studentId) where.studentId = studentId;
    if (examName) where.examName = examName;
    if (req.user!.role === "STUDENT") { const s = await prisma.student.findUnique({ where: { userId: req.user!.id } }); if (s) where.studentId = s.id; }
    if (req.user!.role === "PARENT") { const p = await prisma.parent.findUnique({ where: { userId: req.user!.id }, include: { children: { select: { id: true } } } }); if (p) where.studentId = { in: p.children.map(c => c.id) }; }

    const [data, total] = await Promise.all([
      prisma.result.findMany({ where, include: { student: { include: { user: { select: { name: true } } } } }, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.result.count({ where }),
    ]);
    res.json({ success: true, data, pagination: { page: +page, limit: take, total, totalPages: Math.ceil(total / take) } });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

// POST /api/results
router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, examName, subject, totalMarks, obtained, grade, session } = req.body;
    if (!studentId || !examName || !subject || totalMarks === undefined || obtained === undefined) { res.status(400).json({ success: false, error: "Required fields missing" }); return; }
    const result = await prisma.result.create({
      data: { studentId, examName, subject, totalMarks: parseFloat(totalMarks), obtained: parseFloat(obtained), grade: grade || null, session: session || "2025-26" },
      include: { student: { include: { user: { select: { name: true } } } } },
    });
    res.status(201).json({ success: true, data: result });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

export default router;
