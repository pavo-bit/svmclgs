import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest, authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", box = "inbox" } = req.query as Record<string, string | undefined>;
    const skip = (Math.max(1, +page) - 1) * Math.min(100, +limit); const take = Math.min(100, +limit);
    const where = box === "sent" ? { senderId: req.user!.id } : { receiverId: req.user!.id };
    const [data, total] = await Promise.all([
      prisma.message.findMany({ where, include: { sender: { select: { name: true, role: true } }, receiver: { select: { name: true, role: true } } }, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.message.count({ where }),
    ]);
    res.json({ success: true, data, pagination: { page: +page, limit: take, total, totalPages: Math.ceil(total / take) } });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, subject, content } = req.body;
    if (!receiverId || !subject || !content) { res.status(400).json({ success: false, error: "Required fields missing" }); return; }
    const msg = await prisma.message.create({ data: { senderId: req.user!.id, receiverId, subject, content }, include: { sender: { select: { name: true } }, receiver: { select: { name: true } } } });
    res.status(201).json({ success: true, data: msg });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

router.put("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const msg = await prisma.message.update({ where: { id: req.params.id as string, receiverId: req.user!.id }, data: { isRead: true } });
    res.json({ success: true, data: msg });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "Server error" }); }
});

export default router;
