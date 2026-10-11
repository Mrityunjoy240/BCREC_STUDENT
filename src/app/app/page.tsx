import type { LucideIcon } from "lucide-react";
import { BarChart3, Bell, BookOpen, CalendarDays, ListTodo } from "lucide-react";
import { connection } from "next/server";
import { isDemoMode } from "@/lib/app-mode";
import { UnavailableState } from "@/components/ui-states";

// APP_DATA_MODE is a server-side runtime setting; with cacheComponents the route
// blocks on the incoming request so the value is evaluated per request.
export const instant = false;

function SectionHeader({
  id,
  icon: Icon,
  title,
  description,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-secondary text-primary"
      >
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0">
        <h2 id={id} className="text-[18px] leading-7 font-semibold text-foreground">
          {title}
        </h2>
        <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

type DashboardSectionProps = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  stateLabel: string;
  stateTitle: string;
  stateDescription: string;
  className?: string;
};

function DashboardSection({
  id,
  icon,
  title,
  description,
  stateLabel,
  stateTitle,
  stateDescription,
  className,
}: DashboardSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className={`rounded-[var(--radius-md)] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] ${className ?? ""}`}
    >
      <SectionHeader id={id} icon={icon} title={title} description={description} />
      <div className="mt-4">
        <UnavailableState
          label={stateLabel}
          title={stateTitle}
          description={stateDescription}
          icon={icon}
        />
      </div>
    </section>
  );
}

export default async function DashboardPage() {
  await connection();
  const demoMode = isDemoMode(process.env.APP_DATA_MODE);

  return (
    <div className="flex flex-col gap-6">
      {demoMode && (
        <div
          role="status"
          className="rounded-[var(--radius-md)] border border-border bg-info-surface px-4 py-3 text-[13px] leading-5 font-medium text-info-text"
        >
          Demo environment — clearly labelled synthetic data only. No official academic records are
          connected.
        </div>
      )}

      <div>
        <h1 className="text-[24px] leading-8 font-semibold tracking-tight text-foreground">Home</h1>
        <p className="mt-1 max-w-[65ch] text-[15px] leading-6 text-muted-foreground">
          Your command centre for learning, schedule, tasks, academics and notices.
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
        <DashboardSection
          id="section-learning"
          icon={BookOpen}
          title="Learning workspace"
          description="Notebooks, study chat, quizzes and flashcards."
          stateLabel="Planned"
          stateTitle="Learning tools are not implemented yet"
          stateDescription="Notebooks, study chat, quizzes and flashcards will appear here once the learning workspace ships."
        />

        <DashboardSection
          id="section-schedule"
          icon={CalendarDays}
          title="Calendar & upcoming schedule"
          description="Classes, exams and college events."
          stateLabel="Not connected"
          stateTitle="Official schedule is not connected"
          stateDescription="Classes, exams and college events will show here once an authorized timetable source is available."
        />

        <DashboardSection
          id="section-tasks"
          icon={ListTodo}
          title="Personal tasks"
          description="Deadlines and study plans, kept separate from college records."
          stateLabel="Planned"
          stateTitle="Personal tasks are not implemented yet"
          stateDescription="Task creation will appear here once this feature ships. Personal tasks will stay separate from official college records."
        />

        <DashboardSection
          id="section-academics"
          icon={BarChart3}
          title="Academic overview"
          description="Attendance, assessments and results."
          stateLabel="Not connected"
          stateTitle="Academic data is unavailable"
          stateDescription="Attendance, assessments and results need an authorized data source. No percentages, marks or eligibility status are shown until that source is verified."
        />

        <DashboardSection
          id="section-notices"
          icon={Bell}
          title="Notices"
          description="Verified college notices with source and applicability."
          stateLabel="Not connected"
          stateTitle="Official notice source is not connected"
          stateDescription="College notices will appear here with source, date and applicability once a verified feed is authorized."
          className="lg:col-span-2"
        />
      </div>
    </div>
  );
}
