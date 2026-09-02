import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[var(--radius-md)] px-4 text-sm transition-colors",
        "bg-[var(--color-surface)] text-[var(--color-foreground)]",
        "placeholder:text-[var(--color-subtle)]",
        "focus:bg-[var(--color-surface-elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cobalt)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };