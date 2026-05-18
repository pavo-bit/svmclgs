"use client";

import { DashboardLayout, SidebarItem } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";

const alumniSidebar: SidebarItem[] = [
  { icon: "🏠", label: "Home", href: "/alumni" },
  { icon: "📋", label: "Directory", href: "/alumni/directory" },
  { icon: "📅", label: "Events", href: "/alumni/events" },
  { icon: "🤝", label: "Mentorship", href: "/alumni/mentorship" },
  { icon: "💝", label: "Contributions", href: "/alumni/contributions" },
  { icon: "👤", label: "My Profile", href: "/alumni/profile" },
];

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const alumni = user?.alumni as Record<string, string> | undefined;

  return (
    <DashboardLayout
      sidebarItems={alumniSidebar}
      role="Alumni"
      roleIcon="🌐"
      roleColor="#8B5CF6"
      userName={user?.name || "Loading..."}
      userSubtitle={alumni ? `Batch ${alumni.batch}` : "Alumni Network"}
    >
      {children}
    </DashboardLayout>
  );
}
