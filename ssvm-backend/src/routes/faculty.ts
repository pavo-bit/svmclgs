import { Router, Response } from "express";
import prisma from "../lib/prisma";
import logger from "../lib/logger";
import { AuthRequest, authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", async (req, res: Response) => {
  try {
    const faculty = await prisma.faculty.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } });
    res.json({ success: true, data: faculty });
  } catch (e) { logger.error({ err: e }, "Faculty fetch error"); res.status(500).json({ success: false, error: "Server error" }); }
});

router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { name, designation, department, qualification, experience, email, phone } = req.body;
    if (!name || !designation || !department) { res.status(400).json({ success: false, error: "Required fields missing" }); return; }
    const f = await prisma.faculty.create({ data: { name, designation, department, qualification, experience, email, phone } });
    res.status(201).json({ success: true, data: f });
  } catch (e) { logger.error({ err: e }, "Faculty create error"); res.status(500).json({ success: false, error: "Server error" }); }
});

router.put("/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const b = req.body;
    const id = req.params.id as string;
    const f = await prisma.faculty.update({ where: { id }, data: { ...(b.name && { name: b.name }), ...(b.designation && { designation: b.designation }), ...(b.department && { department: b.department }), ...(b.isActive !== undefined && { isActive: b.isActive }) } });
    res.json({ success: true, data: f });
  } catch (e) { logger.error({ err: e }, "Faculty update error"); res.status(500).json({ success: false, error: "Server error" }); }
});

router.delete("/:id", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.faculty.delete({ where: { id } });
    res.json({ success: true, message: "Deleted" });
  } catch (e) { logger.error({ err: e }, "Faculty delete error"); res.status(500).json({ success: false, error: "Server error" }); }
});

export default router;
