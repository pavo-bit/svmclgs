import { Router, Response } from "express";
import prisma from "../lib/prisma";
import logger from "../lib/logger";

const router = Router();

/**
 * GET /api/stats/public
 * Public stats for homepage (no auth required)
 * Returns: board results, student count, teacher count, awards
 */
router.get("/public", async (_req, res: Response) => {
  try {
    // Check if manual override exists in SiteContent
    const manualStats = await prisma.siteContent.findMany({
      where: { section: "homepage_stats" },
    });

    const statsMap: Record<string, string> = {};
    manualStats.forEach((stat) => {
      statsMap[stat.key] = stat.value;
    });

    // Calculate board results from Result model if not manually set
    let boardResults = statsMap.board_results || null;
    if (!boardResults) {
      const currentSession = "2025-26";
      const totalResults = await prisma.result.count({
        where: { session: currentSession },
      });

      if (totalResults > 0) {
        // Count students who passed (obtained >= 33% of total marks)
        const results = await prisma.result.findMany({
          where: { session: currentSession },
          select: { obtained: true, totalMarks: true },
        });

        const passedCount = results.filter(
          (r) => r.obtained >= r.totalMarks * 0.33
        ).length;

        boardResults = Math.round((passedCount / totalResults) * 100).toString();
      } else {
        boardResults = "98"; // Default fallback
      }
    }

    // Get student count
    const studentCount = statsMap.student_count || (await prisma.student.count()).toString();

    // Get teacher count
    const teacherCount = statsMap.teacher_count || (await prisma.faculty.count({ where: { isActive: true } })).toString();

    // Get awards count (from SiteContent or default)
    const awardsCount = statsMap.awards_count || "250";

    // Get establishment year
    const establishmentYear = statsMap.establishment_year || "1952";

    const stats = {
      boardResults: `${boardResults}%`,
      studentCount: `${studentCount}+`,
      teacherCount: `${teacherCount}+`,
      awardsCount: `${awardsCount}+`,
      establishmentYear,
    };

    logger.info({ stats }, "Public stats fetched");
    res.json({ success: true, data: stats });
  } catch (e) {
    logger.error({ err: e }, "Stats fetch error");
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * GET /api/stats/detailed
 * Detailed stats calculation (for admin dashboard)
 */
router.get("/detailed", async (_req, res: Response) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalAlumni,
      totalNotices,
      totalEvents,
      totalGalleryImages,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.faculty.count({ where: { isActive: true } }),
      prisma.alumni.count(),
      prisma.notice.count({ where: { status: "PUBLISHED" } }),
      prisma.event.count({ where: { status: { in: ["UPCOMING", "COMPLETED"] } } }),
      prisma.galleryImage.count({ where: { isPublished: true } }),
    ]);

    // Calculate board results
    const currentSession = "2025-26";
    const results = await prisma.result.findMany({
      where: { session: currentSession },
      select: { obtained: true, totalMarks: true },
    });

    let boardPassPercentage = 98; // Default
    if (results.length > 0) {
      const passedCount = results.filter(
        (r) => r.obtained >= r.totalMarks * 0.33
      ).length;
      boardPassPercentage = Math.round((passedCount / results.length) * 100);
    }

    // Calculate average score
    let averageScore = 0;
    if (results.length > 0) {
      const totalPercentage = results.reduce(
        (sum, r) => sum + (r.obtained / r.totalMarks) * 100,
        0
      );
      averageScore = Math.round(totalPercentage / results.length);
    }

    // Get attendance rate for current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalAtt = await prisma.attendance.count({
      where: { date: { gte: monthStart } },
    });
    const presentAtt = await prisma.attendance.count({
      where: { date: { gte: monthStart }, status: "PRESENT" },
    });
    const attendanceRate = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 0;

    const stats = {
      students: totalStudents,
      teachers: totalTeachers,
      alumni: totalAlumni,
      notices: totalNotices,
      events: totalEvents,
      galleryImages: totalGalleryImages,
      boardPassPercentage,
      averageScore,
      attendanceRate,
    };

    logger.info({ stats }, "Detailed stats calculated");
    res.json({ success: true, data: stats });
  } catch (e) {
    logger.error({ err: e }, "Detailed stats error");
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
