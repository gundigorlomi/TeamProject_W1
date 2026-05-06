import type { ReactNode, SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "d"> {
  d?: string | ReactNode;
  size?: number;
  stroke?: number;
}

export const Icon = ({ d, size = 16, stroke = 1.75, className = "", ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

type P = Omit<IconProps, "d">;

export const IconSearch = (p: P) => (
  <Icon {...p} d={<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>} />
);
export const IconCheck = (p: P) => <Icon {...p} d="M20 6 9 17l-5-5" />;
export const IconShield = (p: P) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />;
export const IconAlert = (p: P) => (
  <Icon {...p} d={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>} />
);
export const IconChevronDown = (p: P) => <Icon {...p} d="m6 9 6 6 6-6" />;
export const IconEye = (p: P) => (
  <Icon {...p} d={<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>} />
);
export const IconDownload = (p: P) => (
  <Icon {...p} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>} />
);
export const IconCompare = (p: P) => (
  <Icon {...p} d={<><path d="M3 3h7v18H3z" /><path d="M14 3h7v18h-7z" /><path d="M10 12h4" /></>} />
);
export const IconRefresh = (p: P) => (
  <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>} />
);
export const IconExternal = (p: P) => (
  <Icon {...p} d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>} />
);
export const IconLogout = (p: P) => (
  <Icon {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />
);

export const IconInstagram = (p: P) => (
  <Icon {...p} d={<><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>} />
);
export const IconTikTok = (p: P) => (
  <Icon {...p} d={<><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></>} />
);

export const PlatformIcon = ({ platform, ...p }: P & { platform: string }) => {
  if (platform === "instagram") return <IconInstagram {...p} />;
  if (platform === "tiktok") return <IconTikTok {...p} />;
  return null;
};
