"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/DashboardLayout";

const alumniList = [
  { name: "Dr. Sanjay Panda", batch: "1995", profession: "Cardiologist", org: "AIIMS Delhi", location: "New Delhi", avatar: "👨‍⚕️" },
  { name: "Swati Mishra", batch: "2005", profession: "IAS Officer", org: "Govt. of Odisha", location: "Bhubaneswar", avatar: "👩‍💼" },
  { name: "Rajat Behera", batch: "2018", profession: "Software Engineer", org: "Google", location: "Bangalore", avatar: "👨‍💻" },
  { name: "Anita Rath", batch: "2010", profession: "Startup Founder", org: "EduTech Solutions", location: "Mumbai", avatar: "👩‍🔬" },
  { name: "Vikram Mohanty", batch: "2008", profession: "Civil Engineer", org: "L&T Infrastructure", location: "Hyderabad", avatar: "👷" },
  { name: "Priya Nanda", batch: "2012", profession: "Data Scientist", org: "Microsoft", location: "Pune", avatar: "👩‍💻" },
  { name: "Arun Sahoo", batch: "2000", profession: "Advocate", org: "High Court, Cuttack", location: "Cuttack", avatar: "⚖️" },
  { name: "Deepa Patnaik", batch: "2015", profession: "Doctor (MBBS)", org: "SCB Medical College", location: "Cuttack", avatar: "👩‍⚕️" },
  { name: "Suresh Kumar", batch: "1998", profession: "Bank Manager", org: "SBI", location: "Cuttack", avatar: "🏦" },
  { name: "Manisha Das", batch: "2020", profession: "Research Scholar", org: "IIT Kharagpur", location: "Kharagpur", avatar: "🔬" },
  { name: "Rohit Pradhan", batch: "2003", profession: "Army Officer", org: "Indian Army", location: "Jodhpur", avatar: "🎖️" },
  { name: "Kavita Swain", batch: "2016", profession: "Journalist", org: "NDTV", location: "New Delhi", avatar: "📰" },
];

export default function AlumniDirectoryPage() {
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");

  const batches = [...new Set(alumniList.map((a) => a.batch))].sort();

  const filtered = alumniList.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.profession.toLowerCase().includes(search.toLowerCase()) ||
      a.org.toLowerCase().includes(search.toLowerCase());
    const matchesBatch = batchFilter === "all" || a.batch === batchFilter;
    return matchesSearch && matchesBatch;
  });

  return (
    <>
      <PageHeader
        title="Alumni Directory"
        subtitle={`${alumniList.length} registered alumni across 18 countries`}
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, profession, or organization..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-[13px] outline-none focus:border-[#8B5CF6]"
        />
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-white text-[13px] outline-none focus:border-[#8B5CF6]"
        >
          <option value="all">All Batches</option>
          {batches.map((b) => (
            <option key={b} value={b}>Batch {b}</option>
          ))}
        </select>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-border p-5 hover:shadow-lg hover:border-[#8B5CF6]/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px] shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)" }}
              >
                {a.avatar}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-text-primary font-[var(--font-heading)] group-hover:text-[#8B5CF6] transition-colors">
                  {a.name}
                </div>
                <div className="text-[12px] text-text-secondary">{a.profession}</div>
                <div className="text-[11px] text-text-secondary mt-0.5">{a.org}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-[11px] text-[#8B5CF6] font-semibold font-[var(--font-heading)]">Batch {a.batch}</span>
              <span className="text-[11px] text-text-secondary">📍 {a.location}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <span className="text-[48px] block mb-4">🔍</span>
          <div className="text-[16px] font-semibold text-text-secondary font-[var(--font-heading)]">No alumni found</div>
          <div className="text-[13px] text-text-secondary mt-1">Try adjusting your search or filter</div>
        </div>
      )}
    </>
  );
}
