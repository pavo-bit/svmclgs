import { Request, Response, NextFunction } from "express";
import logger from "../lib/logger";

/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 handler — catches unmatched routes.
 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: "Route not found" });
}

/**
 * Global error handler — single place for all error responses.
 */
export function globalErrorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const isOperational = "isOperational" in err ? err.isOperational : false;

  // Log the error
  if (statusCode >= 500) {
    logger.error({ err, path: req.path, method: req.method }, "Unhandled server error");
  } else {
    logger.warn({ err: err.message, path: req.path, method: req.method }, "Client error");
  }

  res.status(statusCode).json({
    success: false,
    error: isOperational || process.env.NODE_ENV !== "production"
      ? err.message
      : "An unexpected error occurred",
  });
}
