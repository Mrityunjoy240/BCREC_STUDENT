"use client";

import * as React from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  Menu,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

import { primaryNavItems, type NavItem } from "./nav-items";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const icons: Record<NavItem["icon"], LucideIcon> = {
  home: Home,
  learn: BookOpen,
  academics: GraduationCap,
  calendar: CalendarDays,
  notices: Bell,
  profile: UserRound,
};

function NavIcon({ item, className }: { item: NavItem; className?: string }) {
  const Icon = icons[item.icon];
  return <Icon aria-hidden="true" className={cn("size-5 shrink-0", className)} />;
}

function NavItemRow({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const isActive = item.href !== null && item.href === currentPath;
  if (item.href !== null) {
    return (
      <a
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-9 items-center gap-3 rounded-[var(--radius-md)] px-3 text-[15px] leading-6 transition-colors duration-[120ms] ease-in-out",
          isActive
            ? "border-l-[3px] border-primary bg-secondary pl-[9px] font-medium text-primary"
            : "border-l-[3px] border-transparent pl-[9px] text-foreground hover:bg-surface-muted",
        )}
      >
        <NavIcon item={item} className={isActive ? "text-primary" : "text-muted-foreground"} />
        {item.label}
      </a>
    );
  }
  return (
    <span
      aria-disabled="true"
      className="flex h-9 items-center gap-3 rounded-[var(--radius-md)] border-l-[3px] border-transparent pl-[9px] text-[15px] leading-6 text-muted-foreground"
    >
      <NavIcon item={item} className="text-muted-foreground/70" />
      <span className="min-w-0 flex-1">{item.label}</span>
      <Badge variant="secondary">Planned</Badge>
    </span>
  );
}

function NavList({ currentPath }: { currentPath: string }) {
  const workspaceItems = primaryNavItems.filter((item) => item.group === "workspace");
  const plannedItems = primaryNavItems.filter((item) => item.group === "planned");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="px-3 pb-2 text-xs leading-4 font-medium tracking-wide text-muted-foreground uppercase">
          Workspace
        </p>
        <ul className="flex flex-col gap-0.5">
          {workspaceItems.map((item) => (
            <li key={item.label}>
              <NavItemRow item={item} currentPath={currentPath} />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="px-3 pb-2 text-xs leading-4 font-medium tracking-wide text-muted-foreground uppercase">
          Planned
        </p>
        <ul className="flex flex-col gap-0.5">
          {plannedItems.map((item) => (
            <li key={item.label}>
              <NavItemRow item={item} currentPath={currentPath} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BrandBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", compact ? "min-w-0" : "px-5 py-5")}>
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground"
      >
        <GraduationCap className="size-4.5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] leading-5 font-semibold tracking-wide text-primary uppercase">
          BCREC
        </span>
        <span className="block truncate text-[15px] leading-5 font-semibold text-foreground">
          Student Life Platform
        </span>
      </span>
    </div>
  );
}

export function DashboardNav({ currentPath }: { currentPath: string }) {
  return (
    <>
      {/* Desktop sidebar (lg+) */}
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 z-100 hidden h-full w-60 flex-col border-r border-border bg-surface lg:flex"
      >
        <div className="border-b border-border">
          <BrandBlock />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavList currentPath={currentPath} />
        </div>
      </nav>

      {/* Mobile / tablet header with disclosure drawer */}
      <MotionConfig reducedMotion="user">
        <header className="sticky top-0 z-100 border-b border-border bg-surface/95 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <BrandBlock compact />
            <MobileDrawer currentPath={currentPath} />
          </div>
        </header>
      </MotionConfig>
    </>
  );
}

function MobileDrawer({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}
      className="group"
    >
      <summary
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={(event) => {
          event.preventDefault();
          setOpen((value) => !value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
          }
        }}
        className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-[13px] leading-5 font-medium text-foreground outline-none transition-colors duration-[120ms] ease-in-out hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden"
      >
        <Menu aria-hidden="true" className="size-4" />
        Menu
      </summary>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Main navigation"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-[57px] right-0 left-0 max-h-[calc(100dvh-57px)] overflow-y-auto border-b border-border bg-surface px-3 py-4 shadow-[var(--shadow-md)]"
          >
            <NavList currentPath={currentPath} />
          </motion.nav>
        )}
      </AnimatePresence>
    </details>
  );
}
