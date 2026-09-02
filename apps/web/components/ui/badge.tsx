import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-pill)] px-2 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        neutral:
          "bg-[var(--color-surface-elevated)] text-[var(--color-muted)]",
        primary:
          "bg-[var(--color-surface-violet)] text-[var(--color-primary)]",
        success:
          "bg-[var(--color-success)] text-[var(--color-foreground-inverse)]",
        warning:
          "bg-[var(--color-warning)] text-[var(--color-foreground-inverse)]",
        danger:
          "bg-[var(--color-danger)] text-[var(--color-foreground-inverse)]",
        info: "bg-[var(--color-info)] text-[var(--color-foreground-inverse)]",
        tiktok:
          "bg-[var(--color-surface-elevated)] text-[var(--color-tiktok)]",
        meta: "bg-[var(--color-meta)] text-[var(--color-foreground-inverse)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };