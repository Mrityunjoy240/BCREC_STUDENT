import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata: Metadata = {
  title: "Home",
};

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell currentPath="/app">{children}</DashboardShell>;
}
