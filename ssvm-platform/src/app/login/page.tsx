"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const roles = [
  { key: "admin", label: "Admin", icon: "🛡️", desc: "School management & CMS", color: "#FF6B00", defaultEmail: "admin@ssvm-cuttack.org" },
  { key: "student", label: "Student", icon: "🎓", desc: "Academic portal", color: "#3B82F6", defaultEmail: "student@ssvm-cuttack.org" },
  { key: "parent", label: "Parent", icon: "👨‍👩‍👧", desc: "Monitor & communicate", color: "#10B981", defaultEmail: "parent@ssvm-cuttack.org" },
  { key: "alumni", label: "Alumni", icon: "🌐", desc: "Network & contribute", color: "#8B5CF6", defaultEmail: "alumni@ssvm-cuttack.org" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (key: string) => {
    setSelectedRole(key);
    const role = roles.find((r) => r.key === key);
    if (role) {
      setEmail(role.defaultEmail);
      setPassword("");
    }
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(160deg, #111827 0%, #1f2937 50%, #CC5500 150%)" }}
      >
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-primary/10" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-saffron/[0.08]" />

        <Link href="/" className="relative z-10 flex items-center gap-3 no-underline">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px] shadow-[0_4px_12px_rgba(255,153,51,0.3)]"
            style={{ background: "linear-gradient(135deg, #FF9933, #8B0000)" }}
          >
            🪷
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-primary-light tracking-[0.03em] font-[var(--font-heading)]">
              SSVM College Square
            </span>
            <span className="text-[11px] font-medium text-white/40 tracking-[0.05em] uppercase font-[var(--font-heading)]">
              Digital Ecosystem
            </span>
          </div>
        </Link>

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[clamp(32px,3.5vw,48px)] font-extrabold text-white leading-[1.15] mb-6 font-[var(--font-heading)]"
          >
            Welcome to the
            <br />
            <span className="gradient-text">School Portal</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/50 text-[16px] leading-[1.75] max-w-[380px]"
          >
            Access your personalized dashboard — manage academics, track progress,
            and stay connected with the SSVM community.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex gap-8 text-center"
        >
          {[
            { num: "3,200+", label: "Students" },
            { num: "120+", label: "Faculty" },
            { num: "98%", label: "Pass Rate" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-[24px] font-bold text-white font-[var(--font-heading)]">{s.num}</div>
              <div className="text-[12px] text-white/40 uppercase tracking-[0.08em] font-[var(--font-heading)]">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px]"
        >
          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-text-primary mb-2 font-[var(--font-heading)]">
              Sign in to your account
            </h2>
            <p className="text-[15px] text-text-secondary">
              Select your role and enter credentials to continue.
            </p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => handleRoleSelect(role.key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 bg-white
                  ${selectedRole === role.key
                    ? "border-primary shadow-[0_4px_16px_rgba(255,107,0,0.15)]"
                    : "border-border hover:border-primary/30"
                  }`}
              >
                <span className="text-[24px]">{role.icon}</span>
                <span className="text-[11px] font-semibold text-text-primary font-[var(--font-heading)]">
                  {role.label}
                </span>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-[13px] font-medium"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-[13px] font-semibold text-text-primary mb-1.5 font-[var(--font-heading)]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${selectedRole}@ssvm-cuttack.org`}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-[14px] text-text-primary
                  outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10
                  placeholder:text-text-secondary/50"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-text-primary mb-1.5 font-[var(--font-heading)]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-[14px] text-text-primary
                  outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10
                  placeholder:text-text-secondary/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                <span className="text-[13px] text-text-secondary">Remember me</span>
              </label>
              <span className="text-[13px] text-primary font-semibold cursor-pointer hover:underline font-[var(--font-heading)]">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-[15px] font-semibold text-white gradient-btn font-[var(--font-heading)]
                disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In as {roles.find((r) => r.key === selectedRole)?.label} →</>
              )}
            </button>
          </form>

          {/* Role Info */}
          <div className="mt-6 p-3 rounded-lg bg-info/5 border border-info/20">
            <p className="text-[11px] text-info font-semibold mb-1 font-[var(--font-heading)]">💡 Quick Access</p>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Select your role above to pre-fill your email address, then enter your password.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              href="/"
              className="text-[13px] text-text-secondary no-underline hover:text-primary transition-colors duration-200"
            >
              ← Back to School Website
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
