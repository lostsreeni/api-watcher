import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "added" | "modified" | "removed" | "breaking" | "info" | "warning";
}

function Badge({ className, variant = "info", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-badge-added-bg text-badge-added-text":
            variant === "added",
          "border-transparent bg-badge-modified-bg text-badge-modified-text":
            variant === "modified",
          "border-transparent bg-badge-removed-bg text-badge-removed-text":
            variant === "removed",
          "border-transparent bg-badge-breaking-bg text-badge-breaking-text":
            variant === "breaking",
          "border-transparent bg-badge-info-bg text-badge-info-text":
            variant === "info",
          "border-transparent bg-badge-warning-bg text-badge-warning-text":
            variant === "warning",
        },
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
