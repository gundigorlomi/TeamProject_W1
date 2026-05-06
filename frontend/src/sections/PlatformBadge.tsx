import { PlatformIcon } from "../components/icons";

export const PlatformBadge = ({ platform }: { platform: string }) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    instagram: { bg: "bg-pink-50 dark:bg-pink-950/40", text: "text-pink-700 dark:text-pink-300", label: "Instagram" },
    tiktok: { bg: "bg-slate-900 dark:bg-slate-800", text: "text-white", label: "TikTok" },
  };
  const styles = map[platform] || { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-200", label: platform };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${styles.bg} ${styles.text}`}>
      <PlatformIcon platform={platform} size={11} stroke={2} />
      {styles.label}
    </span>
  );
};
