export interface GlowLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "ghost" | "solid";
}

export declare const GlowLink: React.FC<GlowLinkProps>;