import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-500/90 disabled:bg-primary-500/40",
  secondary:
    "bg-white text-primary-500 border border-primary-500 hover:bg-primary-100 disabled:text-primary-500/40 disabled:border-primary-500/40",
  tertiary:
    "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100 disabled:text-neutral-900/40",
  text: "text-primary-500 hover:text-primary-400 disabled:text-primary-500/40",
};

export function Button({
  variant = "primary",
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isText = variant === "text";

  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-colors disabled:cursor-not-allowed",
        isText ? "px-0" : "rounded-lg px-4",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
}
