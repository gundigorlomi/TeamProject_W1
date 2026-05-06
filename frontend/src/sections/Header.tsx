import { Link, useLocation, useNavigate } from "react-router-dom";

import { IconCompare, IconDownload, IconLogout, IconShield } from "../components/icons";
import { Avatar } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { InfluencerSearch } from "./InfluencerSearch";
import type { InfluencerSearchItem } from "../types";

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

  const initials =
    user?.email
      .split("@")[0]
      .split(/[._-]/)
      .map((p) => p[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2) || "??";

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200 animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 grid place-items-center text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
            <IconShield size={16} stroke={2.25} />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-slate-900 tracking-tight">Veracity</div>
            <div className="text-[10px] text-slate-500 -mt-0.5">Influencer Authenticity</div>
          </div>
        </Link>
        <div className="h-7 w-px bg-slate-200 mx-1" />
        <InfluencerSearch current={current} onSelect={onSelect} />
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => navigate(compareMode ? "/" : "/compare")}
            className={
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 active:scale-95 " +
              (compareMode
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm")
            }
          >
            <IconCompare size={13} />
            Compare
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all duration-200 active:scale-95">
            <IconDownload size={13} />
            Report
          </button>
          <div className="h-7 w-px bg-slate-200 mx-1" />
          <div className="flex items-center gap-2">
            <Avatar initials={initials} hue={260} size={28} />
            <div className="leading-tight hidden sm:block">
              <div className="text-[12px] font-medium text-slate-900">{user?.email}</div>
              <div className="text-[10px] text-slate-500">{user?.agency_name || "Pro"}</div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-md hover:bg-slate-50"
            >
              <IconLogout size={15} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
