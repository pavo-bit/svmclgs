"use client";

import { motion } from "framer-motion";
import { StatCard, StatusBadge } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { useAlumni, useContributions, useEvents } from "@/lib/api-hooks";

export default function AlumniHome() {
  const { user } = useAuth();
  const alumni = user?.alumni as Record<string, string> | undefined;

  const { data: alumniList } = useAlumni("featured=true");
  const { data: contributions } = useContributions();
  const { data: eventsRaw } = useEvents("limit=4&status=UPCOMING");

  const featured = Array.isArray(alumniList) ? alumniList : alumniList || [];
  const contribs = Array.isArray(contributions) ? contributions : contributions || [];
  const events = Array.isArray(eventsRaw) ? eventsRaw : eventsRaw?.data || eventsRaw || [];

  const totalContributions = contribs.reduce((s: number, c: Record<string, number>) => s + c.amount, 0);

  return (
    <>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 mb-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}>
        <div className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full bg-white/10" />
        <div className="relative z-10">
          <h1 className="text-[24px] font-bold mb-1 font-[var(--font-heading)]">
            Welcome back, {user?.name?.split(" ")[0] || "Alumnus"}! 🌐
          </h1>
          <p className="text-white/70 text-[14px]">
            {alumni ? `Batch of ${alumni.batch} · ${alumni.currentRole || "SSVM Alumnus"}` : "Alumni Network Portal"}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Featured Alumni" value={String(featured.length)} color="#8B5CF6" />
        <StatCard icon="📅" label="Upcoming Events" value={String(events.length)} color="#3B82F6" />
        <StatCard icon="💝" label="Total Contributions" value={`₹${(totalContributions / 100000).toFixed(1)}L`} color="#FF6B00" />
        <StatCard icon="🤝" label="Contributions" value={String(contribs.length)} color="#10B981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Alumni */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border p-6">
          <h3 className="text-[16px] font-semibold mb-5 font-[var(--font-heading)]">⭐ Featured Alumni</h3>
          <div className="flex flex-col gap-3">
            {featured.length > 0 ? featured.map((a: Record<string, unknown>, i: number) => {
              const aUser = a.user as Record<string, string> || {};
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-border/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-[18px]">🎓</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold font-[var(--font-heading)] truncate">{aUser.name}</div>
                    <div className="text-[11px] text-text-secondary truncate">Batch {a.batch as string} · {a.currentRole as string}</div>
                  </div>
                  {a.achievement ? <StatusBadge status={a.achievement as string} color="#8B5CF6" /> : null}
                </div>
              );
            }) : (
              <p className="text-[13px] text-text-secondary text-center py-6">No featured alumni yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Contributions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-border p-6">
          <h3 className="text-[16px] font-semibold mb-5 font-[var(--font-heading)]">💝 Recent Contributions</h3>
          <div className="flex flex-col gap-3">
            {contribs.length > 0 ? contribs.slice(0, 6).map((c: Record<string, unknown>) => {
              const cAlumni = c.alumni as Record<string, unknown> || {};
              const cUser = cAlumni.user as Record<string, string> || {};
              return (
                <div key={c.id as string} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                  <div>
                    <div className="text-[13px] font-semibold font-[var(--font-heading)]">{cUser.name || "Alumnus"}</div>
                    <div className="text-[11px] text-text-secondary">{c.purpose as string} · {new Date(c.date as string).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div>
                  </div>
                  <span className="text-[14px] font-bold text-success font-[var(--font-heading)]">
                    ₹{(c.amount as number).toLocaleString()}
                  </span>
                </div>
              );
            }) : (
              <p className="text-[13px] text-text-secondary text-center py-6">No contributions yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-border p-6 mt-6">
        <h3 className="text-[16px] font-semibold mb-5 font-[var(--font-heading)]">📅 Upcoming Events</h3>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {events.map((e: Record<string, unknown>) => (
              <div key={e.id as string} className="p-4 rounded-xl bg-surface hover:bg-border/30 transition-colors">
                <h4 className="text-[14px] font-semibold font-[var(--font-heading)] text-text-primary mb-1">{e.title as string}</h4>
                <div className="text-[12px] text-text-secondary">
                  📅 {new Date(e.date as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · 📍 {e.venue as string}
                </div>
                {(e.rsvpCount as number) > 0 ? <div className="text-[11px] text-primary mt-1">✋ {e.rsvpCount as number} RSVPs</div> : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-text-secondary text-center py-6">No upcoming events</p>
        )}
      </motion.div>
    </>
  );
}
