import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest, authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, month, date } = req.query as Record<string, string | undefined>;
    const where: Record<string, unknown> = {};
    if (studentId) where.studentId = studentId;
    if (req.user!.role === "STUDENT") { const s = await prisma.student.findUnique({ where: { userId: req.user!.id } }); if (s) where.studentId = s.id; }
    if (req.user!.role === "PARENT") { const p = await prisma.parent.findUnique({ where: { userId: req.user!.id }, include: { children: { select: { id: true } } } }); if (p) where.studentId = { in: p.children.map(c => c.id) }; }
    if (month) { const [y, m] = month.split("-").map(Number); where.date = { gte: new Date(y, m - 1, 1), lt: new Date(y, m, 1) }; }
    if (date) where.date = new Date(date);
    const data = await prisma.attendance.findMany({ where, include: { student: { include: { user: { select: { name: true } } } } }, orderBy: { date: "desc" } });
    res.json({ success: true, data });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { records } = req.body;
    if (!records?.length) { res.status(400).json({ success: false, error: "Records required" }); return; }
    const created = await prisma.$transaction(
      records.map((r: { studentId: string; date: string; status: string; remarks?: string }) =>
        prisma.attendance.upsert({
          where: { studentId_date: { studentId: r.studentId, date: new Date(r.date) } },
          create: { studentId: r.studentId, date: new Date(r.date), status: r.status as "PRESENT" | "ABSENT" | "LATE" | "HOLIDAY", remarks: r.remarks || null },
          update: { status: r.status as "PRESENT" | "ABSENT" | "LATE" | "HOLIDAY" },
        })
      )
    );
    res.status(201).json({ success: true, data: created });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

export default router;
