"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/DashboardLayout";

const examResults = [
  {
    exam: "Annual Examination 2025",
    date: "March 2025",
    total: "500",
    obtained: "463",
    percentage: "92.6%",
    grade: "A++",
    rank: "3rd",
    subjects: [
      { name: "Mathematics", marks: 95, total: 100, grade: "A++" },
      { name: "Science", marks: 92, total: 100, grade: "A++" },
      { name: "English", marks: 88, total: 100, grade: "A+" },
      { name: "Hindi", marks: 94, total: 100, grade: "A++" },
      { name: "Social Science", marks: 94, total: 100, grade: "A++" },
    ],
  },
  {
    exam: "Half Yearly Examination 2024",
    date: "November 2024",
    total: "500",
    obtained: "437",
    percentage: "87.4%",
    grade: "A+",
    rank: "5th",
    subjects: [
      { name: "Mathematics", marks: 88, total: 100, grade: "A+" },
      { name: "Science", marks: 90, total: 100, grade: "A+" },
      { name: "English", marks: 82, total: 100, grade: "A" },
      { name: "Hindi", marks: 89, total: 100, grade: "A+" },
      { name: "Social Science", marks: 88, total: 100, grade: "A+" },
    ],
  },
];

export default function StudentResultsPage() {
  return (
    <>
      <PageHeader
        title="My Results"
        subtitle="View your academic performance across examinations"
        action={
          <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-info bg-info/10 border-none cursor-pointer font-[var(--font-heading)]">
            📄 Download Marksheet
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        {examResults.map((exam, ei) => (
          <motion.div
            key={exam.exam}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ei * 0.15 }}
            className="bg-white rounded-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              style={{ background: ei === 0 ? "linear-gradient(135deg, #EFF6FF, #DBEAFE)" : "white" }}
            >
              <div>
                <h3 className="text-[17px] font-bold text-text-primary font-[var(--font-heading)]">{exam.exam}</h3>
                <p className="text-[13px] text-text-secondary">{exam.date}</p>
              </div>
              <div className="flex gap-5">
                <div className="text-center">
                  <div className="text-[22px] font-bold text-info font-[var(--font-heading)]">{exam.percentage}</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-wider">Percentage</div>
                </div>
                <div className="text-center">
                  <div className="text-[22px] font-bold text-success font-[var(--font-heading)]">{exam.grade}</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-wider">Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-[22px] font-bold text-primary font-[var(--font-heading)]">{exam.rank}</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-wider">Rank</div>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="p-6">
              <div className="flex flex-col gap-3">
                {exam.subjects.map((s) => (
                  <div key={s.name} className="flex items-center gap-4">
                    <span className="text-[13px] font-medium text-text-primary w-32 font-[var(--font-heading)]">{s.name}</span>
                    <div className="flex-1 h-2.5 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.marks}%` }}
                        transition={{ delay: 0.3 + ei * 0.2 }}
                        className="h-full rounded-full"
                        style={{
                          background: s.marks >= 90 ? "#10B981" : s.marks >= 80 ? "#3B82F6" : s.marks >= 70 ? "#F59E0B" : "#EF4444",
                        }}
                      />
                    </div>
                    <span className="text-[14px] font-bold text-text-primary w-16 text-right font-[var(--font-heading)]">
                      {s.marks}/{s.total}
                    </span>
                    <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full w-12 text-center font-[var(--font-heading)]">
                      {s.grade}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                <span className="text-[13px] font-semibold text-text-secondary font-[var(--font-heading)]">Total</span>
                <span className="text-[16px] font-bold text-text-primary font-[var(--font-heading)]">
                  {exam.obtained} / {exam.total}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
