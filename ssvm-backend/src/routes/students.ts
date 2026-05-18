import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest, authenticate, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/students
router.get("/", authenticate, requireRole("ADMIN", "PARENT"), async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", class: cls, search } = req.query as Record<string, string | undefined>;
    const skip = (Math.max(1, +page) - 1) * Math.min(100, +limit);
    const take = Math.min(100, +limit);
    const where: Record<string, unknown> = {};
    if (cls) where.class = cls;
    if (search) where.OR = [{ user: { name: { contains: search, mode: "insensitive" } } }, { rollNo: { contains: search, mode: "insensitive" } }];
    if (req.user!.role === "PARENT") {
      const parent = await prisma.parent.findUnique({ where: { userId: req.user!.id } });
      if (parent) where.parentId = parent.id;
    }
    const [data, total] = await Promise.all([
      prisma.student.findMany({ where, include: { user: { select: { id: true, name: true, email: true, phone: true, avatar: true, isActive: true } } }, orderBy: { class: "asc" }, skip, take }),
      prisma.student.count({ where }),
    ]);
    res.json({ success: true, data, pagination: { page: +page, limit: take, total, totalPages: Math.ceil(total / take) } });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

// GET /api/students/:id
router.get("/:id", authenticate, async (req, res: Response) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id as string },
      include: { user: { select: { id: true, name: true, email: true, phone: true, avatar: true } }, attendance: { orderBy: { date: "desc" }, take: 30 }, results: { orderBy: { createdAt: "desc" } }, fees: { orderBy: { dueDate: "desc" } }, submissions: { include: { assignment: true } } },
    });
    if (!student) { res.status(404).json({ success: false, error: "Not found" }); return; }
    res.json({ success: true, data: student });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

// PUT /api/students/:id
router.put("/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const student = await prisma.student.update({
      where: { id: req.params.id as string },
      data: { ...(b.class && { class: b.class }), ...(b.section && { section: b.section }), ...(b.rollNo && { rollNo: b.rollNo }), ...(b.session && { session: b.session }), ...(b.parentId !== undefined && { parentId: b.parentId }) },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json({ success: true, data: student });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

export default router;
