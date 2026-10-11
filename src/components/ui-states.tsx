import type { LucideIcon } from "lucide-react";

type StateIconProps = { icon?: LucideIcon; className?: string };

function StateIcon({ icon: Icon, className }: StateIconProps) {
  if (!Icon) return null;
  return (
    <span
      aria-hidden="true"
      className={`flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-secondary text-primary ${className ?? ""}`}
    >
      <Icon className="size-4.5" />
    </span>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  action?: { label: string; href: string };
  icon?: LucideIcon;
};

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-surface-muted/60 px-4 py-6 text-center">
      <div className="flex justify-center">
        <StateIcon icon={icon} />
      </div>
      <p className="mt-3 text-[15px] leading-6 font-medium text-foreground">{title}</p>
      <p className="mx-auto mt-1 max-w-[50ch] text-[13px] leading-5 text-muted-foreground">
        {description}
      </p>
      {action && (
        <a
          href={action.href}
          className="mt-4 inline-flex h-9 items-center rounded-[var(--radius-md)] bg-primary px-4 text-[13px] leading-5 font-medium text-primary-foreground transition-colors duration-[120ms] ease-in-out hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}

type UnavailableStateProps = {
  title: string;
  description: string;
  label?: string;
  icon?: LucideIcon;
};

export function UnavailableState({
  title,
  description,
  label = "Not connected",
  icon,
}: UnavailableStateProps) {
  return (
    <div className="flex gap-3 rounded-[var(--radius-md)] bg-info-surface px-4 py-4">
      <StateIcon icon={icon} />
      <div className="min-w-0">
        <p className="text-[13px] leading-5 font-medium tracking-wide text-info-text uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-[15px] leading-6 font-medium text-foreground">{title}</p>
        <p className="mt-1 max-w-[60ch] text-[13px] leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
};

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-4"
      style={{ borderLeft: "3px solid var(--danger)" }}
    >
      <p className="text-[15px] leading-6 font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-[60ch] text-[13px] leading-5 text-muted-foreground">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-9 items-center rounded-[var(--radius-md)] border border-border bg-surface px-4 text-[13px] leading-5 font-medium text-foreground transition-colors duration-[120ms] ease-in-out hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-[var(--radius-sm)] bg-surface-muted ${className}`}
    />
  );
}
