import type { Metadata } from "next";
import { BookOpen, MessageSquare, Target } from "lucide-react";
import { connection } from "next/server";
import { isDemoMode } from "@/lib/app-mode";
import { EmptyState } from "@/components/ui-states";

// APP_DATA_MODE is a server-side runtime setting; with cacheComponents the route
// blocks on the incoming request so the value is evaluated per request.
export const instant = false;

export const metadata: Metadata = {
  title: "Learning Workspace",
};

function WorkspaceSection({
  id,
  icon,
  title,
  description,
  children,
  className = "",
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className={`rounded-[var(--radius-md)] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] ${className}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-secondary text-primary"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 id={id} className="text-[18px] leading-7 font-semibold text-foreground">
            {title}
          </h2>
          <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function LearnPage() {
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
        <h1 className="text-[24px] leading-8 font-semibold tracking-tight text-foreground">
          Learning Workspace
        </h1>
        <p className="mt-1 max-w-[65ch] text-[15px] leading-6 text-muted-foreground">
          Your study hub for materials, AI assistance and practice. Tools appear here as they ship.
        </p>
      </div>

      <div
        role="status"
        className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-[13px] leading-5 text-muted-foreground"
      >
        Study tools are in early development. Uploads, chat and quizzes are not connected yet;
        nothing below is simulated.
      </div>

      <WorkspaceSection
        id="section-materials"
        icon={<BookOpen className="size-4.5" />}
        title="Study Materials"
        description="Notebooks, uploaded notes and saved study resources."
      >
        <EmptyState
          title="No study materials yet"
          description="Notebooks, study notes and saved resources will appear here once the learning workspace ships."
        />
      </WorkspaceSection>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WorkspaceSection
          id="section-chat"
          icon={<MessageSquare className="size-4.5" />}
          title="Study chat"
          description="Ask questions about your materials."
        >
          <EmptyState
            title="Study chat is not implemented yet"
            description="A chat assistant grounded in your study materials will appear here once it ships."
          />
        </WorkspaceSection>

        <WorkspaceSection
          id="section-practice"
          icon={<Target className="size-4.5" />}
          title="Practice"
          description="Quizzes and flashcards from your materials."
        >
          <EmptyState
            title="Quizzes and flashcards are not implemented yet"
            description="Practice tools generated from your study materials will appear here once they ship."
          />
        </WorkspaceSection>
      </div>
    </div>
  );
}
