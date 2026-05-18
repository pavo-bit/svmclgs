"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader, DataTable, StatusBadge } from "@/components/DashboardLayout";
import { apiCall, invalidateAll } from "@/lib/api-hooks";
import useSWR from "swr";

const fetcher = async (url: string) => { const r = await fetch(url, { credentials: "include" }); const d = await r.json(); return d.data ?? d; };

export default function ParentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fEmail, setFEmail] = useState("");
  const [fPassword, setFPassword] = useState("");
  const [fName, setFName] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fOccupation, setFOccupation] = useState("");
  const [fAddress, setFAddress] = useState("");

  const { data: studRaw, isLoading } = useSWR("/api/students?limit=200", fetcher);
  const students = Array.isArray(studRaw) ? studRaw : studRaw?.data || studRaw || [];

  // Group students by parent
  const parentMap = new Map<string, { parent: Record<string, unknown>; children: Record<string, unknown>[] }>();
  students.forEach((s: Record<string, unknown>) => {
    if (s.parentId) {
      if (!parentMap.has(s.parentId as string)) parentMap.set(s.parentId as string, { parent: {} as Record<string, unknown>, children: [] });
      parentMap.get(s.parentId as string)!.children.push(s);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await apiCall("/api/auth/register", "POST", { email: fEmail, password: fPassword, name: fName, role: "PARENT", phone: fPhone, occupation: fOccupation, address: fAddress });
      invalidateAll("/api/students"); setShowModal(false);
      setFEmail(""); setFPassword(""); setFName(""); setFPhone(""); setFOccupation(""); setFAddress("");
    } catch (err) { alert((err as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <>
      <PageHeader title="Parent Management" subtitle="View parents and register new parent accounts"
        action={<button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer gradient-btn font-[var(--font-heading)]">+ Register Parent</button>} />
      {isLoading ? <div className="bg-white rounded-2xl border border-border p-12 text-center"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div> : (
        <DataTable headers={["Student", "Class", "Section", "Guardian", "Roll No"]}
          rows={students.map((s: Record<string, unknown>) => {
            const u = s.user as Record<string, string>;
            return [
              <span key="n" className="font-medium font-[var(--font-heading)]">{u?.name || "—"}</span>,
              <StatusBadge key="c" status={s.class as string} color="#3B82F6" />,
              s.section as string,
              (s.guardianName as string) || "—",
              <span key="r" className="text-[12px] text-text-secondary font-mono">{s.rollNo as string}</span>,
            ];
          })} />
      )}
      <AnimatePresence>
        {showModal && (<>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/40 z-[100]" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] max-w-[520px] bg-white rounded-2xl p-8 z-[101] shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-bold font-[var(--font-heading)]">Register Parent</h3>
              <button onClick={() => setShowModal(false)} className="text-[20px] text-text-secondary bg-transparent border-none cursor-pointer">✕</button>
            </div>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Full Name" required className="w-full px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-3">
                <input type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="Email" required className="px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none focus:border-primary" />
                <input type="password" value={fPassword} onChange={(e) => setFPassword(e.target.value)} placeholder="Password" required className="px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={fPhone} onChange={(e) => setFPhone(e.target.value)} placeholder="Phone" className="px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none focus:border-primary" />
                <input type="text" value={fOccupation} onChange={(e) => setFOccupation(e.target.value)} placeholder="Occupation" className="px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none focus:border-primary" />
              </div>
              <input type="text" value={fAddress} onChange={(e) => setFAddress(e.target.value)} placeholder="Address" className="w-full px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none focus:border-primary" />
              <button type="submit" disabled={saving} className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer gradient-btn font-[var(--font-heading)] disabled:opacity-50 mt-1">{saving ? "Registering..." : "Register Parent"}</button>
            </form>
          </motion.div>
        </>)}
      </AnimatePresence>
    </>
  );
}
