import { Link, useLocation, useNavigate } from "react-router-dom";

import { Icon, IconCompare, IconDownload, IconLogout, IconShield } from "../components/icons";
import { Avatar } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { InfluencerSearch } from "./InfluencerSearch";
import type { InfluencerSearchItem } from "../types";

const IconSun = (p: any) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m4.93 19.07 1.41-1.41" />
        <path d="m17.66 6.34 1.41-1.41" />
      </>
    }
  />
);
const IconMoon = (p: any) => (
  <Icon {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
);

export const Header = ({
  current,
  onSelect,
}: {
  current: InfluencerSearchItem | null;
  onSelect: (id: number) => void;
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const compareMode = location.pathname.startsWith("/compare");
  const { isDark, toggle } = useTheme();

  const initials =
    user?.email
      .split("@")[0]
      .split(/[._-]/)
      .map((p) => p[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2) || "??";

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-indigo-500 grid place-items-center text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
            <IconShield size={16} stroke={2.25} />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Veracity</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">Influencer Authenticity</div>
          </div>
        </Link>
        <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
        <InfluencerSearch current={current} onSelect={onSelect} />
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => navigate(compareMode ? "/" : "/compare")}
            className={
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 active:scale-95 " +
              (compareMode
                ? "bg-slate-900 dark:bg-indigo-500 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm")
            }
          >
            <IconCompare size={13} />
            Compare
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200 active:scale-95">
            <IconDownload size={13} />
            Report
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200 active:scale-90 overflow-hidden"
          >
            <span
              className="absolute inset-0 grid place-items-center transition-all duration-500"
              style={{
                opacity: isDark ? 0 : 1,
                transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0) scale(1)",
              }}
            >
              <IconSun size={15} stroke={2} />
            </span>
            <span
              className="absolute inset-0 grid place-items-center transition-all duration-500"
              style={{
                opacity: isDark ? 1 : 0,
                transform: isDark ? "rotate(0) scale(1)" : "rotate(90deg) scale(0.5)",
              }}
            >
              <IconMoon size={15} stroke={2} />
            </span>
          </button>

          <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
          <div className="flex items-center gap-2">
            <Avatar initials={initials} hue={260} size={28} />
            <div className="leading-tight hidden sm:block">
              <div className="text-[12px] font-medium text-slate-900 dark:text-slate-100">{user?.email}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{user?.agency_name || "Pro"}</div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <IconLogout size={15} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
