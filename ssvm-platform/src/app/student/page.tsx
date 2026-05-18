"use client";

import { motion } from "framer-motion";
import { StatusBadge } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { useAssignments, useAttendance, useResults } from "@/lib/api-hooks";

export default function StudentHome() {
  const { user } = useAuth();
  const student = user?.student as Record<string, string> | undefined;

  const { data: assignmentsRaw } = useAssignments();
  const { data: attendanceRaw } = useAttendance();
  const { data: resultsRaw } = useResults();

  const assignments = Array.isArray(assignmentsRaw) ? assignmentsRaw : assignmentsRaw?.data || assignmentsRaw || [];
  const attendance = Array.isArray(attendanceRaw) ? attendanceRaw : attendanceRaw || [];
  const results = Array.isArray(resultsRaw) ? resultsRaw : resultsRaw?.data || resultsRaw || [];

  // Calculate stats
  const totalDays = attendance.length || 1;
  const presentDays = attendance.filter((a: Record<string, string>) => a.status === "PRESENT").length;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);
  const pendingAssignments = assignments.filter((a: Record<string, unknown>) => {
    const subs = a.submissions as Record<string, string>[] || [];
    return subs.length === 0 || subs.some(s => s.status === "PENDING");
  }).length;

  // Last exam average
  const latestResults = results.slice(0, 3);
  const lastExamAvg = latestResults.length > 0
    ? (latestResults.reduce((s: number, r: Record<string, number>) => s + r.obtained, 0) / latestResults.length).toFixed(1)
    : "—";

  return (
    <>
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" }}
      >
        <div className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-30px] left-[60%] w-[120px] h-[120px] rounded-full bg-white/5" />
        <div className="relative z-10">
          <h1 className="text-[24px] font-bold mb-1 font-[var(--font-heading)]">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user?.name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="text-white/70 text-[14px] mb-4">
            {student ? `Class ${student.class}-${student.section} · Roll No. ${student.rollNo} · Session ${student.session}` : "Student Portal"}
          </p>
          <div className="flex gap-6 flex-wrap">
            <div>
              <div className="text-[20px] font-bold font-[var(--font-heading)]">{attendanceRate}%</div>
              <div className="text-[11px] text-white/60 uppercase tracking-wider">Attendance</div>
            </div>
            <div>
              <div className="text-[20px] font-bold font-[var(--font-heading)]">{lastExamAvg}%</div>
              <div className="text-[11px] text-white/60 uppercase tracking-wider">Last Exam</div>
            </div>
            <div>
              <div className="text-[20px] font-bold font-[var(--font-heading)]">{pendingAssignments}</div>
              <div className="text-[11px] text-white/60 uppercase tracking-wider">Pending Tasks</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Results */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
          <h3 className="text-[16px] font-semibold mb-5 font-[var(--font-heading)]">📊 Recent Results</h3>
          {results.length > 0 ? (
            <div className="flex flex-col gap-2">
              {results.slice(0, 8).map((r: Record<string, unknown>, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface transition-colors">
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold font-[var(--font-heading)] text-text-primary">{r.subject as string}</div>
                    <div className="text-[12px] text-text-secondary">{r.examName as string}</div>
                  </div>
                  <span className="text-[15px] font-bold text-text-primary font-[var(--font-heading)]">{r.obtained as number}/{r.totalMarks as number}</span>
                  {r.grade ? <StatusBadge status={r.grade as string} color="#10B981" /> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-text-secondary text-center py-8">No results published yet</p>
          )}
        </motion.div>

        {/* Assignments */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-border p-6">
          <h3 className="text-[16px] font-semibold mb-5 font-[var(--font-heading)]">📝 Assignments</h3>
          <div className="flex flex-col gap-3">
            {assignments.length > 0 ? assignments.slice(0, 5).map((a: Record<string, unknown>) => {
              const subs = a.submissions as Record<string, string>[] || [];
              const status = subs.length > 0 ? subs[0].status : "PENDING";
              const statusColor = status === "GRADED" ? "#3B82F6" : status === "SUBMITTED" ? "#10B981" : "#F59E0B";
              return (
                <div key={a.id as string} className="p-3 rounded-xl bg-surface">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-info font-[var(--font-heading)]">{a.subject as string}</span>
                    <StatusBadge status={status} color={statusColor} />
                  </div>
                  <div className="text-[13px] font-medium text-text-primary font-[var(--font-heading)]">{a.title as string}</div>
                  <div className="text-[11px] text-text-secondary mt-1">Due: {new Date(a.dueDate as string).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                </div>
              );
            }) : (
              <p className="text-[13px] text-text-secondary text-center py-6">No assignments yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Attendance Heatmap */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-border p-6 mt-6">
        <h3 className="text-[16px] font-semibold mb-5 font-[var(--font-heading)]">
          📋 Attendance — {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-[11px] text-text-secondary text-center font-semibold font-[var(--font-heading)]">{d}</div>
          ))}
          {Array.from({ length: 30 }, (_, i) => {
            const record = attendance.find((a: Record<string, string>) => {
              const d = new Date(a.date);
              return d.getDate() === i + 1;
            }) as Record<string, string> | undefined;
            const status = record?.status?.toLowerCase() || "future";
            const colors: Record<string, string> = { present: "#10B981", absent: "#EF4444", late: "#F59E0B", holiday: "#E5E7EB", future: "#F8F9FA" };
            return (
              <motion.div
                key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.01 }}
                className="aspect-square rounded-lg flex items-center justify-center text-[11px] font-semibold"
                style={{ background: colors[status] || "#F8F9FA", color: status === "present" || status === "absent" ? "white" : status === "late" ? "white" : "#9CA3AF" }}
              >
                {i + 1}
              </motion.div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          {[
            { color: "#10B981", label: "Present" },
            { color: "#EF4444", label: "Absent" },
            { color: "#F59E0B", label: "Late" },
            { color: "#E5E7EB", label: "Holiday" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: l.color }} />
              <span className="text-[11px] text-text-secondary">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
