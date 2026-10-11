type EmptyStateProps = {
  title: string;
  description: string;
  action?: { label: string; href: string };
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-surface-muted px-4 py-6 text-center">
      <p className="text-[15px] leading-6 font-medium text-foreground">{title}</p>
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
};

export function UnavailableState({
  title,
  description,
  label = "Not connected",
}: UnavailableStateProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-info-surface px-4 py-6">
      <p className="text-[13px] leading-5 font-medium text-info-text uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-[15px] leading-6 font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-[60ch] text-[13px] leading-5 text-muted-foreground">{description}</p>
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
      className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-6"
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
