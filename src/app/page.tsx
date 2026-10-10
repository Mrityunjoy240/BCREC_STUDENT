import { connection } from "next/server";
import { isDemoMode } from "@/lib/app-mode";

// APP_DATA_MODE is a server-side runtime setting. With cacheComponents, a route
// that must block on the incoming request opts out of instant-shell validation
// (Next.js 16: "Set export const instant = false to allow a blocking route").
export const instant = false;

export default async function HomePage() {
  await connection();
  const demoMode = isDemoMode(process.env.APP_DATA_MODE);

  return (
    <div className="flex flex-1 flex-col">
      {demoMode && (
        <div
          role="status"
          className="border-b border-info bg-info-surface px-4 py-2 text-center text-[13px] leading-5 font-medium text-info-text"
        >
          Demo environment — clearly labelled synthetic data only. No official academic records are
          connected.
        </div>
      )}

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-10 md:px-6">
        <section className="rounded-[var(--radius-md)] border border-border bg-surface p-6 shadow-[0_1px_2px_rgb(15_23_42/0.06)] md:p-8">
          <p className="text-[13px] leading-5 font-medium tracking-wide text-primary uppercase">
            BCREC · Durgapur
          </p>
          <h1 className="mt-2 text-[24px] leading-8 font-semibold text-foreground md:text-[30px] md:leading-9 md:font-bold">
            BCREC Student Life Platform
          </h1>
          <p className="mt-4 max-w-[65ch] text-[15px] leading-6 text-foreground">
            A calm, trustworthy workspace for schedules, tasks, learning materials, and verified
            academic information. This site is the foundation build: product scope and architecture
            are planned, and functional student features are arriving in reviewed vertical slices.
          </p>

          <div className="mt-6 rounded-[var(--radius-md)] border border-border bg-surface-muted p-4">
            <h2 className="text-[18px] leading-7 font-semibold text-foreground">
              Academic data is not connected yet
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
              Attendance, marks, timetables, examination dates, and official college notices are not
              integrated. Nothing on this page is an official record. Production sessions will never
              fall back to synthetic academic data — missing data is shown as unavailable, not
              simulated.
            </p>
          </div>

          <p className="mt-6 text-[12px] leading-4 text-muted-foreground">
            Design tokens and layout rules are provisional and proposed for owner review; they are
            not official BCREC branding until verified and authorized.
          </p>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-4 text-center text-[12px] leading-4 text-muted-foreground">
        BCREC Student Life Platform — foundation scaffold (planning → bootstrap).
      </footer>
    </div>
  );
}
