"use client";

import { motion } from "framer-motion";
import { StatCard, StatusBadge } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { useFees, useResults, useAttendance, useNotices } from "@/lib/api-hooks";

export default function ParentHome() {
  const { user } = useAuth();
  const { data: feesRaw } = useFees();
  const { data: resultsRaw } = useResults();
  const { data: attendanceRaw } = useAttendance();
  const { data: noticesRaw } = useNotices("limit=5");

  const fees = Array.isArray(feesRaw) ? feesRaw : feesRaw?.data || feesRaw || [];
  const results = Array.isArray(resultsRaw) ? resultsRaw : resultsRaw?.data || resultsRaw || [];
  const attendance = Array.isArray(attendanceRaw) ? attendanceRaw : attendanceRaw || [];
  const notices = Array.isArray(noticesRaw) ? noticesRaw : noticesRaw?.data || noticesRaw || [];

  // Compute stats
  const totalPresent = attendance.filter((a: Record<string, string>) => a.status === "PRESENT").length;
  const totalDays = attendance.length || 1;
  const attendanceRate = Math.round((totalPresent / totalDays) * 100);

  const paidTotal = fees.filter((f: Record<string, string>) => f.status === "PAID").reduce((s: number, f: Record<string, number>) => s + f.amount, 0);
  const pendingTotal = fees.filter((f: Record<string, string>) => f.status !== "PAID").reduce((s: number, f: Record<string, number>) => s + f.amount, 0);

  const latestResults = results.slice(0, 6);
  const avgScore = latestResults.length > 0
    ? (latestResults.reduce((s: number, r: Record<string, number>) => s + r.obtained, 0) / latestResults.length).toFixed(1)
    : "—";

  return (
    <>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>
        <div className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full bg-white/10" />
        <div className="relative z-10">
          <h1 className="text-[24px] font-bold mb-1 font-[var(--font-heading)]">
            Welcome, {user?.name?.split(" ")[0] || "Parent"}! 👨‍👩‍👧
          </h1>
          <p className="text-white/70 text-[14px]">Monitor your children&apos;s academic progress and stay connected with SSVM.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📋" label="Attendance Rate" value={`${attendanceRate}%`} color="#10B981" />
        <StatCard icon="📊" label="Avg. Score" value={`${avgScore}%`} color="#3B82F6" />
        <StatCard icon="💰" label="Fees Paid" value={`₹${(paidTotal / 1000).toFixed(0)}K`} color="#8B5CF6" />
        <StatCard icon="⏳" label="Pending Fees" value={pendingTotal > 0 ? `₹${(pendingTotal / 1000).toFixed(0)}K` : "₹0"} color={pendingTotal > 0 ? "#F59E0B" : "#10B981"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border p-6">
          <h3 className="text-[16px] font-semibold mb-5 font-[var(--font-heading)]">📊 Recent Results</h3>
          {latestResults.length > 0 ? (
            <div className="flex flex-col gap-2">
              {latestResults.map((r: Record<string, unknown>, i: number) => {
                const student = r.student as Record<string, unknown> || {};
                const studentUser = student.user as Record<string, string> || {};
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors">
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold font-[var(--font-heading)]">{r.subject as string}</div>
                      <div className="text-[11px] text-text-secondary">{studentUser.name} · {r.examName as string}</div>
                    </div>
                    <span className="text-[14px] font-bold font-[var(--font-heading)]">{r.obtained as number}/{r.totalMarks as number}</span>
                    {r.grade ? <StatusBadge status={r.grade as string} color="#10B981" /> : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-text-secondary text-center py-6">No results yet</p>
          )}
        </motion.div>

        {/* Fee Records */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-border p-6">
          <h3 className="text-[16px] font-semibold mb-5 font-[var(--font-heading)]">💰 Fee Records</h3>
          {fees.length > 0 ? (
            <div className="flex flex-col gap-2">
              {fees.slice(0, 6).map((f: Record<string, unknown>) => {
                const student = f.student as Record<string, unknown> || {};
                const studentUser = student.user as Record<string, string> || {};
                return (
                  <div key={f.id as string} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                    <div>
                      <div className="text-[13px] font-semibold font-[var(--font-heading)]">{f.type as string}</div>
                      <div className="text-[11px] text-text-secondary">{studentUser.name} · Due: {new Date(f.dueDate as string).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[14px] font-bold font-[var(--font-heading)] ${(f.status as string) === "PAID" ? "text-success" : "text-danger"}`}>
                        ₹{(f.amount as number).toLocaleString()}
                      </span>
                      <div className="text-[10px] text-text-secondary">{f.status as string}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-text-secondary text-center py-6">No fee records</p>
          )}
        </motion.div>
      </div>

      {/* Notices */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-border p-6 mt-6">
        <h3 className="text-[16px] font-semibold mb-5 font-[var(--font-heading)]">📢 School Notices</h3>
        {notices.length > 0 ? (
          <div className="flex flex-col gap-3">
            {notices.map((n: Record<string, unknown>) => (
              <div key={n.id as string} className="p-4 rounded-xl bg-surface hover:bg-border/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <StatusBadge status={n.category as string} color="#FF6B00" />
                  <span className="text-[11px] text-text-secondary">
                    {new Date(n.createdAt as string).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <h4 className="text-[14px] font-semibold font-[var(--font-heading)] text-text-primary">{n.title as string}</h4>
                <p className="text-[12px] text-text-secondary mt-1 line-clamp-2">{n.content as string}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-text-secondary text-center py-6">No notices</p>
        )}
      </motion.div>
    </>
  );
}
