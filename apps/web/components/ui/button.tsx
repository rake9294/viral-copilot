import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-pill)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cobalt)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-foreground)] text-[var(--color-foreground-inverse)] hover:bg-[var(--color-primary-strong)] hover:text-[var(--color-foreground-inverse)]",
        secondary:
          "bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]",
        ghost:
          "bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]",
        danger:
          "bg-[var(--color-danger)] text-[var(--color-foreground)] hover:opacity-90",
        outline:
          "border border-[var(--color-border)] bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-10 px-5",
        lg: "h-12 px-6",
        icon: "h-[44px] w-[44px] p-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };