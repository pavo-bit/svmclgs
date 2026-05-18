import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest, authenticate, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/fees
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", status, studentId } = req.query as Record<string, string | undefined>;
    const skip = (Math.max(1, +page) - 1) * Math.min(100, +limit);
    const take = Math.min(100, +limit);
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (studentId) where.studentId = studentId;
    if (req.user!.role === "STUDENT") {
      const s = await prisma.student.findUnique({ where: { userId: req.user!.id } });
      if (s) where.studentId = s.id;
    }
    if (req.user!.role === "PARENT") {
      const p = await prisma.parent.findUnique({ where: { userId: req.user!.id }, include: { children: { select: { id: true } } } });
      if (p) where.studentId = { in: p.children.map(c => c.id) };
    }
    const [data, total] = await Promise.all([
      prisma.fee.findMany({ where, include: { student: { include: { user: { select: { name: true } } } } }, orderBy: { dueDate: "desc" }, skip, take }),
      prisma.fee.count({ where }),
    ]);
    res.json({ success: true, data, pagination: { page: +page, limit: take, total, totalPages: Math.ceil(total / take) } });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

// POST /api/fees
router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, amount, type, status, dueDate, session, remarks } = req.body;
    if (!studentId || !amount || !type || !dueDate) { res.status(400).json({ success: false, error: "Required fields missing" }); return; }
    const fee = await prisma.fee.create({
      data: { studentId, amount: parseFloat(amount), type, status: status || "PENDING", dueDate: new Date(dueDate), session: session || "2025-26", remarks: remarks || null },
      include: { student: { include: { user: { select: { name: true } } } } },
    });
    res.status(201).json({ success: true, data: fee });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

// PUT /api/fees/:id
router.put("/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const fee = await prisma.fee.update({
      where: { id: req.params.id as string },
      data: { ...(b.status && { status: b.status }), ...(b.paidDate && { paidDate: new Date(b.paidDate) }), ...(b.receiptNo && { receiptNo: b.receiptNo }), ...(b.remarks !== undefined && { remarks: b.remarks }) },
      include: { student: { include: { user: { select: { name: true } } } } },
    });
    res.json({ success: true, data: fee });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

export default router;
