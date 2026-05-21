import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  asChildHref?: string;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-500 overflow-hidden",
          variant === "primary"
            ? "text-primary-foreground border border-border bg-white/2 hover:bg-white/6 hover:border-primary/40"
            : "text-foreground border border-border bg-white/2 hover:bg-white/6 hover:border-primary/40",
          className,
        )}
        {...props}
      >
        {variant === "primary" && (
          <>
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: "var(--gradient-button)" }}
            />
            <span
              className="absolute -inset-1 rounded-full opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "var(--gradient-button)" }}
            />
          </>
        )}
        <span className="relative flex items-center gap-2">{children}</span>
      </button>
    );
  },
);
GlowButton.displayName = "GlowButton";

export function GlowLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-500 overflow-hidden",
        variant === "primary"
          ? "text-primary-foreground border border-border bg-white/2 hover:bg-white/6 hover:border-primary/40"
          : "text-foreground border border-border bg-white/2 hover:bg-white/6 hover:border-primary/40",
        className,
      )}
    >
      {variant === "primary" && (
        <>
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--gradient-button)" }}
          />
          <span
            className="absolute -inset-1 rounded-full opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "var(--gradient-button)" }}
          />
        </>
      )}
      <span className="relative flex items-center gap-2">{children}</span>
    </a>
  );
}
