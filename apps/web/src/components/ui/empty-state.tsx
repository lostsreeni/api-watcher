import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed border-border p-8 text-center animate-in fade-in-50",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted mb-4">
          {icon}
        </div>
      )}
      <h3 className="mt-4 text-card-title font-semibold">{title}</h3>
      <p className="mb-4 mt-2 text-sm text-text-muted max-w-sm">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
