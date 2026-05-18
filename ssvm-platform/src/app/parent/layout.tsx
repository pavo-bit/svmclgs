"use client";

import { DashboardLayout, SidebarItem } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";

const parentSidebar: SidebarItem[] = [
  { icon: "🏠", label: "Home", href: "/parent" },
  { icon: "📋", label: "Attendance", href: "/parent/attendance" },
  { icon: "📊", label: "Results", href: "/parent/results" },
  { icon: "💰", label: "Fee Tracker", href: "/parent/fees" },
  { icon: "📢", label: "Notices", href: "/parent/notices" },
  { icon: "💬", label: "Messages", href: "/parent/messages", badge: "1" },
  { icon: "👤", label: "Profile", href: "/parent/profile" },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <DashboardLayout
      sidebarItems={parentSidebar}
      role="Parent"
      roleIcon="👨‍👩‍👧"
      roleColor="#10B981"
      userName={user?.name || "Loading..."}
      userSubtitle="Guardian Dashboard"
    >
      {children}
    </DashboardLayout>
  );
}
