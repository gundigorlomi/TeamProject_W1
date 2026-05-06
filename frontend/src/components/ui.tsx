import type { ReactNode } from "react";

export const Avatar = ({
  initials,
  hue = 220,
  size = 56,
  ring = false,
}: {
  initials: string;
  hue?: number;
  size?: number;
  ring?: boolean;
}) => (
  <div
    className={"relative shrink-0 grid place-items-center font-semibold text-white select-none " + (ring ? "ring-4 ring-white" : "")}
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.32,
      background: `linear-gradient(135deg, oklch(0.72 0.14 ${hue}) 0%, oklch(0.55 0.18 ${hue + 30}) 100%)`,
      fontSize: size * 0.36,
      letterSpacing: "-0.02em",
    }}
  >
    {initials}
  </div>
);

export const Card = ({
  title,
  subtitle,
  action,
  children,
  className = "",
  padded = true,
  interactive = true,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  padded?: boolean;
  interactive?: boolean;
}) => (
  <section
    className={
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl animate-fade-up " +
      (interactive ? "card-lift " : "") +
      className
    }
  >
    {(title || action) && (
      <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          {title && <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </header>
    )}
    <div className={padded ? "p-5" : ""}>{children}</div>
  </section>
);
