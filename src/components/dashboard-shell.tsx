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
