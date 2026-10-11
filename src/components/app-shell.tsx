"use client";

import { usePathname } from "next/navigation";

import { DashboardShell } from "./dashboard-shell";

/**
 * Client wrapper that supplies the live pathname to DashboardShell so the
 * sidebar marks the correct destination active across /app routes. Server
 * layouts cannot read the request path without a client boundary.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <DashboardShell currentPath={pathname}>{children}</DashboardShell>;
}
