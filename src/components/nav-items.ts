export type NavItem = {
  label: string;
  href: string | null;
  icon: "home" | "learn" | "academics" | "calendar" | "notices" | "profile";
  group: "workspace" | "planned";
};

export const primaryNavItems: NavItem[] = [
  { label: "Home", href: "/app", icon: "home", group: "workspace" },
  { label: "Learn", href: "/app/learn", icon: "learn", group: "workspace" },
  { label: "My Academics", href: null, icon: "academics", group: "planned" },
  { label: "Calendar & Tasks", href: null, icon: "calendar", group: "planned" },
  { label: "Notices", href: null, icon: "notices", group: "planned" },
  { label: "Profile & Settings", href: null, icon: "profile", group: "planned" },
];
