"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TopNavProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function TopNav({ title, description, actions, className, ...props }: TopNavProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background px-6 backdrop-blur-md",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        {title && <h1 className="text-card-title font-semibold tracking-tight">{title}</h1>}
        {description && <p className="text-small text-text-muted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </header>
  );
}
