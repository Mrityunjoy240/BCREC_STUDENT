import { DashboardNav } from "./dashboard-nav";

export function DashboardShell({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath: string;
}) {
  return (
    <div className="flex min-h-full flex-col bg-background lg:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[600] focus:rounded-[var(--radius-md)] focus:border focus:border-transparent focus:bg-primary focus:px-4 focus:py-2 focus:text-[13px] focus:leading-5 focus:font-medium focus:text-primary-foreground focus:shadow-[var(--shadow-md)] focus:outline-none"
      >
        Skip to main content
      </a>
      <DashboardNav currentPath={currentPath} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <main
          id="main-content"
          className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 md:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
