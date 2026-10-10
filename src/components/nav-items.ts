export type NavItem = {
  label: string;
  href: string | null;
  icon: "home" | "learn" | "academics" | "calendar" | "notices" | "profile";
};

export const primaryNavItems: NavItem[] = [
  { label: "Home", href: "/app", icon: "home" },
  { label: "Learn", href: null, icon: "learn" },
  { label: "My Academics", href: null, icon: "academics" },
  { label: "Calendar & Tasks", href: null, icon: "calendar" },
  { label: "Notices", href: null, icon: "notices" },
  { label: "Profile & Settings", href: null, icon: "profile" },
];
