"use client";

import { PageHeader, DataTable, StatusBadge } from "@/components/DashboardLayout";
import { useStudents } from "@/lib/api-hooks";

export default function StudentsPage() {
  const { data: raw, isLoading } = useStudents("limit=50");
  const students = Array.isArray(raw) ? raw : raw?.data || raw || [];

  const totalStudents = students.length;
  const stats = [
    { label: "Total Students", value: String(totalStudents), icon: "👨‍🎓" },
    { label: "Classes", value: [...new Set(students.map((s: Record<string, string>) => s.class))].length.toString(), icon: "🏫" },
    { label: "This Session", value: students.filter((s: Record<string, string>) => s.session === "2025-26").length.toString(), icon: "📅" },
  ];

  return (
    <>
      <PageHeader
        title="Student Management"
        subtitle="View and manage all enrolled students"
        action={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer gradient-btn font-[var(--font-heading)]">
            + Add Student
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-border flex items-center gap-3">
            <span className="text-[24px]">{s.icon}</span>
            <div>
              <div className="text-[18px] font-bold text-text-primary font-[var(--font-heading)]">{s.value}</div>
              <div className="text-[12px] text-text-secondary">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] text-text-secondary">Loading students...</p>
        </div>
      ) : (
        <DataTable
          headers={["Name", "Roll No.", "Class", "Section", "Session", "Actions"]}
          rows={students.map((s: Record<string, unknown>) => {
            const user = s.user as Record<string, unknown> || {};
            return [
              <span key="n" className="font-medium font-[var(--font-heading)]">{user.name as string}</span>,
              <span key="r" className="text-[12px] font-mono text-text-secondary">{s.rollNo as string}</span>,
              s.class as string,
              s.section as string,
              <StatusBadge key="ses" status={s.session as string} color="#3B82F6" />,
              <button key="v" className="text-[12px] text-primary font-semibold bg-transparent border-none cursor-pointer font-[var(--font-heading)]">
                View Profile
              </button>,
            ];
          })}
        />
      )}
    </>
  );
}
