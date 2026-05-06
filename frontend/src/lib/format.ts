export function fmtNum(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 10e6 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 10e3 ? 0 : 1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

export function fmtAccountAge(days: number): string {
  if (days < 365) return `${Math.max(1, Math.round(days / 30))} mo`;
  return `${(days / 365).toFixed(1)} yr`;
}
