import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import logger from "../lib/logger";
import { getEnv } from "../config/env";

// ─── Types ───
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export interface JWTSignOptions {
  expiresIn: string | number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    avatar: string | null;
    phone: string | null;
  };
}

// ─── Password Helpers ───
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

// ─── JWT Helpers ───
export function signToken(payload: TokenPayload): string {
  const env = getEnv();
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const env = getEnv();
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// ─── Auth Middleware (async/await — no race conditions) ───
export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.auth_token;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : cookieToken;

  if (!token) {
    res.status(401).json({ success: false, error: "Unauthorized — please log in" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true, avatar: true, phone: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, error: "Account not found or deactivated" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error({ err }, "Auth middleware DB error");
    res.status(500).json({ success: false, error: "Auth check failed" });
  }
}

// ─── Role Guard ───
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: "Forbidden — insufficient permissions" });
      return;
    }
    next();
  };
}

// ─── Optional Auth (doesn't fail if no token) ───
export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.auth_token;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : cookieToken;

  if (!token) {
    next();
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    next();
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true, avatar: true, phone: true },
    });
    if (user && user.isActive) req.user = user;
  } catch (err) {
    logger.warn({ err }, "Optional auth DB error — continuing without user");
  }

  next();
}
