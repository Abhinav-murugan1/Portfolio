import React from "react";
import { cn } from "../../lib/utils";

interface GlowLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "ghost" | "solid";
}

export const GlowLink: React.FC<GlowLinkProps> = ({
  variant = "solid",
  className,
  children,
  ...props
}) => {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-all",
        variant === "ghost" && "bg-transparent hover:bg-gray-200",
        variant === "solid" && "bg-blue-500 text-white hover:bg-blue-600",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};