"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader, StatusBadge } from "@/components/DashboardLayout";
import { useAlumni, apiCall, invalidateAll } from "@/lib/api-hooks";

export default function AlumniMgmtPage() {
  const [search, setSearch] = useState("");
  const { data: raw, isLoading } = useAlumni(search ? `search=${search}` : "");
  const alumni = Array.isArray(raw) ? raw : raw?.data || raw || [];

  const toggleFeatured = async (id: string, current: boolean) => {
    try { await apiCall("/api/alumni", "PUT", { id, isFeatured: !current }); invalidateAll("/api/alumni"); }
    catch (err) { alert((err as Error).message); }
  };

  return (
    <>
      <PageHeader title="Alumni Management" subtitle="Manage alumni profiles and featured alumni" />
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search alumni by name..."
        className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-[13px] outline-none focus:border-primary mb-6" />
      {isLoading ? <div className="bg-white rounded-2xl border border-border p-12 text-center"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alumni.map((a: Record<string, unknown>, i: number) => {
            const user = a.user as Record<string, string>;
            return (
              <motion.div key={a.id as string} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-[20px] bg-gradient-to-br from-primary/10 to-primary/5">🎓</div>
                  {a.isFeatured ? <StatusBadge status="Featured" color="#FF6B00" /> : null}
                </div>
                <h4 className="text-[15px] font-semibold text-text-primary font-[var(--font-heading)]">{user?.name}</h4>
                <p className="text-[12px] text-primary font-semibold mb-1">Batch of {a.batch as string}</p>
                <div className="flex flex-col gap-1 text-[12px] text-text-secondary mb-3">
                  {a.currentRole ? <span>💼 {a.currentRole as string}</span> : null}
                  {a.company ? <span>🏢 {a.company as string}</span> : null}
                  {a.achievement ? <span>🏆 {a.achievement as string}</span> : null}
                </div>
                <button onClick={() => toggleFeatured(a.id as string, a.isFeatured as boolean)}
                  className={`text-[12px] font-semibold bg-transparent border-none cursor-pointer font-[var(--font-heading)] ${a.isFeatured ? "text-danger" : "text-primary"}`}>
                  {a.isFeatured ? "Remove Featured" : "⭐ Make Featured"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
