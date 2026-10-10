import { connection } from "next/server";
import { isDemoMode } from "@/lib/app-mode";
import { EmptyState, UnavailableState } from "@/components/ui-states";

// APP_DATA_MODE is a server-side runtime setting; with cacheComponents the route
// blocks on the incoming request so the value is evaluated per request.
export const instant = false;

export default async function DashboardPage() {
  await connection();
  const demoMode = isDemoMode(process.env.APP_DATA_MODE);

  return (
    <div className="flex flex-col gap-6">
      {demoMode && (
        <div
          role="status"
          className="rounded-[var(--radius-md)] border border-info bg-info-surface px-4 py-3 text-[13px] leading-5 font-medium text-info-text"
        >
          Demo environment — clearly labelled synthetic data only. No official academic records are
          connected.
        </div>
      )}

      <div>
        <h1 className="text-[24px] leading-8 font-semibold text-foreground">Home</h1>
        <p className="mt-1 max-w-[65ch] text-[15px] leading-6 text-muted-foreground">
          Your command centre for learning, schedule, tasks, academics and notices. Connected
          academic data is not available yet — nothing below is an official record.
        </p>
      </div>

      <div
        role="status"
        className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-[13px] leading-5 text-muted-foreground"
      >
        Academic data is not connected. Attendance, marks, timetables, examination dates and
        official notices are not integrated; missing data is shown as unavailable, never simulated.
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section
          aria-labelledby="section-learning"
          className="rounded-[var(--radius-md)] border border-border bg-surface p-4"
        >
          <h2 id="section-learning" className="text-[18px] leading-7 font-semibold text-foreground">
            Learning workspace
          </h2>
          <div className="mt-3">
            <UnavailableState
              title="Learning tools are not implemented yet"
              description="Notebooks, study chat, quizzes and flashcards will appear here once the learning workspace ships."
            />
          </div>
        </section>

        <section
          aria-labelledby="section-schedule"
          className="rounded-[var(--radius-md)] border border-border bg-surface p-4"
        >
          <h2 id="section-schedule" className="text-[18px] leading-7 font-semibold text-foreground">
            Calendar &amp; upcoming schedule
          </h2>
          <div className="mt-3">
            <UnavailableState
              title="Official schedule is not connected"
              description="Classes, exams and college events will show here once an authorized timetable source is available."
            />
          </div>
        </section>

        <section
          aria-labelledby="section-tasks"
          className="rounded-[var(--radius-md)] border border-border bg-surface p-4"
        >
          <h2 id="section-tasks" className="text-[18px] leading-7 font-semibold text-foreground">
            Personal tasks
          </h2>
          <div className="mt-3">
            <EmptyState
              title="No personal tasks yet"
              description="Create tasks to track deadlines and study plans. Personal tasks stay separate from official college records."
            />
          </div>
        </section>

        <section
          aria-labelledby="section-academics"
          className="rounded-[var(--radius-md)] border border-border bg-surface p-4"
        >
          <h2
            id="section-academics"
            className="text-[18px] leading-7 font-semibold text-foreground"
          >
            Academic overview
          </h2>
          <div className="mt-3">
            <UnavailableState
              title="Academic data is unavailable"
              description="Attendance, assessments and results need an authorized data source. No percentages, marks or eligibility status are shown until that source is verified."
            />
          </div>
        </section>

        <section
          aria-labelledby="section-notices"
          className="rounded-[var(--radius-md)] border border-border bg-surface p-4 lg:col-span-2"
        >
          <h2 id="section-notices" className="text-[18px] leading-7 font-semibold text-foreground">
            Notices
          </h2>
          <div className="mt-3">
            <UnavailableState
              title="Official notice source is not connected"
              description="College notices will appear here with source, date and applicability once a verified feed is authorized."
            />
          </div>
        </section>
      </div>
    </div>
  );
}
