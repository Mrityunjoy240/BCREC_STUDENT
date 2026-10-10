type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

export function LearnIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H19v14H6.5A1.5 1.5 0 0 0 5 19.5v-14Z" />
      <path d="M5 19.5A1.5 1.5 0 0 1 6.5 18H19v2H6.5A1.5 1.5 0 0 1 5 19.5Z" />
    </svg>
  );
}

export function AcademicsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <rect x="4" y="5" width="16" height="15" rx="1.5" />
      <path d="M4 10h16M9 3v4m6-4v4" />
    </svg>
  );
}

export function NoticesIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function ProfileIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <circle cx="12" cy="9" r="3.25" />
      <path d="M5.5 19.5c1.2-2.8 3.6-4.25 6.5-4.25s5.3 1.45 6.5 4.25" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M5 7h14M5 12h14M5 17h14" />
    </svg>
  );
}
