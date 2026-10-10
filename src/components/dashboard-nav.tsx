import { primaryNavItems, type NavItem } from "./nav-items";
import {
  AcademicsIcon,
  CalendarIcon,
  HomeIcon,
  LearnIcon,
  MenuIcon,
  NoticesIcon,
  ProfileIcon,
} from "./icons";

const icons = {
  home: HomeIcon,
  learn: LearnIcon,
  academics: AcademicsIcon,
  calendar: CalendarIcon,
  notices: NoticesIcon,
  profile: ProfileIcon,
};

function NavIcon({ item }: { item: NavItem }) {
  const Icon = icons[item.icon];
  return <Icon className="shrink-0" />;
}

function NavList({ currentPath }: { currentPath: string }) {
  return (
    <ul className="flex flex-col gap-1">
      {primaryNavItems.map((item) => {
        const isActive = item.href !== null && item.href === currentPath;
        return (
          <li key={item.label}>
            {item.href !== null ? (
              <a
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "flex items-center gap-3 rounded-[var(--radius-md)] border-l-[3px] border-primary bg-secondary px-3 py-2 text-[15px] leading-6 font-medium text-primary"
                    : "flex items-center gap-3 rounded-[var(--radius-md)] border-l-[3px] border-transparent px-3 py-2 text-[15px] leading-6 text-foreground transition-colors duration-[120ms] ease-in-out hover:bg-surface-muted"
                }
              >
                <NavIcon item={item} />
                {item.label}
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="flex items-center gap-3 border-l-[3px] border-transparent px-3 py-2 text-[15px] leading-6 text-muted-foreground"
              >
                <NavIcon item={item} />
                <span className="min-w-0 flex-1">{item.label}</span>
                <span className="rounded-[var(--radius-full)] bg-surface-muted px-2 py-0.5 text-[12px] leading-4 font-medium text-muted-foreground">
                  Planned
                </span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardNav({ currentPath }: { currentPath: string }) {
  return (
    <>
      {/* Desktop sidebar navigation (lg+) */}
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 z-100 hidden h-full w-60 flex-col border-r border-border bg-surface lg:flex"
      >
        <div className="border-b border-border px-4 py-5">
          <p className="text-[13px] leading-5 font-semibold tracking-wide text-primary uppercase">
            BCREC
          </p>
          <p className="mt-0.5 text-[15px] leading-6 font-semibold text-foreground">
            BCREC Student Life Platform
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavList currentPath={currentPath} />
        </div>
      </nav>

      {/* Mobile / tablet header with native disclosure drawer */}
      <header className="sticky top-0 z-100 border-b border-border bg-surface lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-[15px] leading-6 font-semibold text-foreground">
            BCREC Student Life Platform
          </p>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[var(--radius-md)] border border-border px-3 py-2 text-[13px] leading-5 font-medium text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] [&::-webkit-details-marker]:hidden">
              <MenuIcon />
              Menu
            </summary>
            <nav
              aria-label="Main navigation"
              className="absolute top-full right-0 left-0 border-b border-border bg-surface px-3 py-4 shadow-[0_4px_12px_rgb(15_23_42/0.08)]"
            >
              <NavList currentPath={currentPath} />
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
