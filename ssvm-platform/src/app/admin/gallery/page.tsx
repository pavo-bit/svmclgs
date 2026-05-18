"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, StatusBadge } from "@/components/DashboardLayout";
import { useGallery, apiCall, invalidateAll } from "@/lib/api-hooks";

const categoryColors: Record<string, string> = {
  Campus: "#FF6B00", Facilities: "#3B82F6", Events: "#8B5CF6", Academic: "#10B981", Sports: "#F59E0B",
};

export default function GalleryPage() {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Campus");
  const [formDesc, setFormDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filter, setFilter] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: raw, isLoading } = useGallery(filter !== "all" ? filter : undefined);
  const images = Array.isArray(raw) ? raw : raw?.data || raw || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { alert("Please select an image"); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", formTitle);
      formData.append("category", formCategory);
      formData.append("description", formDesc);
      await apiCall("/api/gallery", "POST", formData);
      invalidateAll("/api/gallery");
      setShowModal(false);
      setFormTitle(""); setFormDesc(""); setFile(null);
    } catch (err) { alert((err as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { 
      await apiCall(`/api/gallery/${id}`, "DELETE"); 
      invalidateAll("/api/gallery"); 
    }
    catch (err) { alert((err as Error).message); }
    finally { 
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Gallery Management"
        subtitle="Upload and manage school photos"
        action={
          <button onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer gradient-btn font-[var(--font-heading)]">
            + Upload Photo
          </button>
        }
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "Hero", "Campus", "Facilities", "Events", "Academic", "Sports"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-[12px] font-semibold border cursor-pointer font-[var(--font-heading)] transition-all
              ${filter === f ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary"}`}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-text-secondary">No images found. Upload your first photo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img: Record<string, unknown>, i: number) => (
            <motion.div key={img.id as string} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-border overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-surface relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img.imageUrl as string} 
                  alt={img.title as string}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop if fallback also fails
                    target.src = `https://via.placeholder.com/800x600/FF6B00/FFFFFF?text=${encodeURIComponent(img.title as string)}`;
                  }}
                />
                <div className="absolute top-2 right-2">
                  <StatusBadge status={img.category as string} color={categoryColors[img.category as string] || "#6B7280"} />
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-[14px] font-semibold text-text-primary font-[var(--font-heading)] mb-1">{img.title as string}</h4>
                {img.description ? <p className="text-[12px] text-text-secondary mb-3 line-clamp-2">{img.description as string}</p> : null}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[11px] text-text-secondary">
                    {new Date(img.createdAt as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {confirmDeleteId === img.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-text-secondary font-medium">Are you sure?</span>
                      <button onClick={() => handleDelete(img.id as string)} disabled={deletingId === img.id}
                        className="text-[12px] text-danger font-semibold bg-transparent border-none cursor-pointer hover:underline disabled:opacity-50">
                        {deletingId === img.id ? "..." : "Yes"}
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} disabled={deletingId === img.id}
                        className="text-[12px] text-text-secondary font-semibold bg-transparent border-none cursor-pointer hover:underline disabled:opacity-50">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDeleteId(img.id as string)}
                      className="text-[12px] text-danger font-semibold bg-transparent border-none cursor-pointer font-[var(--font-heading)] hover:underline">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/40 z-[100]" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] max-w-[520px] bg-white rounded-2xl p-8 z-[101] shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[20px] font-bold font-[var(--font-heading)]">Upload Photo</h3>
                <button onClick={() => setShowModal(false)} className="text-[20px] text-text-secondary bg-transparent border-none cursor-pointer">✕</button>
              </div>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1 font-[var(--font-heading)]">Title</label>
                  <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Photo title" required
                    className="w-full px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1 font-[var(--font-heading)]">Category</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none focus:border-primary bg-white">
                    <option>Hero</option><option>Campus</option><option>Facilities</option><option>Events</option><option>Academic</option><option>Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1 font-[var(--font-heading)]">Image File</label>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required
                    className="w-full px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-text-primary mb-1 font-[var(--font-heading)]">Description</label>
                  <textarea rows={2} value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Optional description..."
                    className="w-full px-4 py-2.5 rounded-lg border border-border text-[13px] outline-none focus:border-primary resize-none" />
                </div>
                <button type="submit" disabled={saving}
                  className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer gradient-btn font-[var(--font-heading)] disabled:opacity-50">
                  {saving ? "Uploading..." : "Upload Photo"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
