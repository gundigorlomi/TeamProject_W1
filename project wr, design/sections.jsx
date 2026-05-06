// Dashboard sections + Compare mode

const PlatformBadge = ({ platform }) => {
  const styles = {
    instagram: { bg: "bg-pink-50", text: "text-pink-700", label: "Instagram" },
    tiktok: { bg: "bg-slate-900", text: "text-white", label: "TikTok" },
    youtube: { bg: "bg-red-50", text: "text-red-700", label: "YouTube" },
  }[platform] || { bg: "bg-slate-100", text: "text-slate-700", label: platform };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${styles.bg} ${styles.text}`}>
      <PlatformIcon platform={platform} size={11} stroke={2} />
      {styles.label}
    </span>
  );
};

// ---------------- Profile Summary Card ----------------
const ProfileCard = ({ inf, compact = false }) => {
  const tier = scoreTier(inf.score);
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-4">
          <Avatar initials={inf.avatar} hue={inf.avatarHue} size={compact ? 56 : 68} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[17px] font-semibold text-slate-900 tracking-tight truncate">{inf.name}</h2>
              {inf.verified && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white">
                  <IconCheck size={10} stroke={3} />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[13px] text-slate-500 font-mono">{inf.handle}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <PlatformBadge platform={inf.platform} />
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">{inf.niche}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">{inf.location}</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-md hover:bg-slate-50">
            <IconExternal size={15} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 border-t border-slate-100">
        {[
          { label: "Followers", value: fmtNum(inf.followers) },
          { label: "Posts", value: fmtNum(inf.posts) },
          { label: "Avg likes", value: fmtNum(inf.avgLikes) },
          { label: "Account age", value: inf.accountAge },
        ].map((s, i) => (
          <div key={i} className={"px-4 py-3 " + (i > 0 ? "border-l border-slate-100" : "")}>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{s.label}</div>
            <div className="font-mono text-[15px] font-semibold text-slate-900 mt-0.5 tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ---------------- Generated Profile Photos ----------------
const GeneratedProfilePhotos = ({ inf, compact = false }) => {
  const photos = (inf.generatedPhotos || []).slice(0, compact ? 3 : 4);
  if (!photos.length) return null;

  return (
    <Card
      title="Profile Photo Set"
      subtitle={compact ? null : "Generated lifestyle samples for visual review"}
      padded={false}
      className="overflow-hidden"
    >
      <div className={"grid gap-px bg-slate-200 " + (compact ? "grid-cols-3" : "grid-cols-2")}>
        {photos.map((photo, i) => (
          <figure key={photo.src} className="relative aspect-square overflow-hidden bg-slate-100 group">
            <img
              src={photo.src}
              alt={photo.alt || `${inf.name} generated profile photo ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            {!compact && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent px-3 pb-2 pt-8 text-[11px] font-medium text-white">
                {photo.label}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </Card>
  );
};

// ---------------- Score Card ----------------
const ScoreCard = ({ inf }) => {
  const tier = scoreTier(inf.score);
  return (
    <Card padded={false}>
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Authenticity Score</h3>
          <p className="text-xs text-slate-500 mt-0.5">Composite of 4 weighted signals · updated 12 min ago</p>
        </div>
        <button className="text-[11px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-50">
          <IconRefresh size={12} /> Re-scan
        </button>
      </div>
      <div className="p-5 grid grid-cols-[auto_1fr] gap-6 items-center">
        <AuthenticityGauge score={inf.score} />
        <div className="flex flex-col gap-3.5">
          <SubscoreBar label="Follower Quality" value={inf.subscores.followerQuality} hint="profile signals" />
          <SubscoreBar label="Engagement Authenticity" value={inf.subscores.engagementAuthenticity} hint="comment & like patterns" />
          <SubscoreBar label="Audience–Content Fit" value={inf.subscores.audienceContentFit} hint="demo vs niche" />
          <SubscoreBar label="Growth Pattern" value={inf.subscores.growthPattern} hint="velocity anomalies" />
        </div>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2 text-slate-600">
          <IconShield size={13} />
          <span>Verdict: <span className="font-semibold" style={{ color: tier.hex }}>{inf.verdict}</span></span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">Confidence 94%</div>
      </div>
    </Card>
  );
};

// ---------------- Red Flags ----------------
const RedFlagsPanel = ({ inf }) => {
  const counts = inf.redFlags.reduce((a, f) => ((a[f.severity] = (a[f.severity] || 0) + 1), a), {});
  return (
    <Card
      title="Red Flags"
      subtitle={`${inf.redFlags.length} issue${inf.redFlags.length === 1 ? "" : "s"} detected`}
      action={
        <div className="flex items-center gap-1.5">
          {["high", "med", "low"].map((s) =>
            counts[s] ? (
              <span key={s} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${severityStyles[s].bg} ${severityStyles[s].text} ${severityStyles[s].border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${severityStyles[s].dot}`} />
                {counts[s]} {severityStyles[s].label}
              </span>
            ) : null
          )}
        </div>
      }
    >
      {inf.redFlags.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-sm">
          <IconCheck size={28} className="mx-auto mb-2 text-emerald-500" />
          No red flags detected
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {inf.redFlags.map((flag, i) => {
            const s = severityStyles[flag.severity];
            return (
              <li key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border ${s.bg} ${s.border}`}>
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                <span className={`text-[13px] leading-snug flex-1 ${s.text}`}>{flag.text}</span>
                <span className={`text-[9px] uppercase tracking-wider font-bold ${s.text} opacity-70`}>{s.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

// ---------------- Engagement Timeline ----------------
const EngagementTimeline = ({ inf }) => (
  <Card
    title="Engagement Timeline"
    subtitle="Last 90 days · likes & comments per post"
    action={
      <div className="flex items-center gap-1 text-[11px] bg-slate-100 rounded-md p-0.5">
        <button className="px-2 py-1 rounded bg-white shadow-sm font-medium text-slate-900">90d</button>
        <button className="px-2 py-1 text-slate-500 hover:text-slate-900">6m</button>
        <button className="px-2 py-1 text-slate-500 hover:text-slate-900">1y</button>
      </div>
    }
  >
    <TimelineChart data={inf.timeline} height={200} />
  </Card>
);

// ---------------- Comment Quality Donut ----------------
const CommentQuality = ({ inf }) => {
  const segs = [
    { value: inf.commentBreakdown.authentic, color: "#10b981", label: "Authentic" },
    { value: inf.commentBreakdown.generic, color: "#f59e0b", label: "Generic" },
    { value: inf.commentBreakdown.spam, color: "#ef4444", label: "Spam / Bot" },
  ];
  return (
    <Card title="Comment Quality" subtitle="Sample of 1,200 recent comments">
      <div className="flex items-center gap-5">
        <DonutChart
          segments={segs}
          size={144}
          thickness={20}
          centerValue={inf.commentBreakdown.authentic + "%"}
          centerLabel="Authentic"
        />
        <div className="flex-1 flex flex-col gap-2.5">
          {segs.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
              <span className="text-[13px] text-slate-700 flex-1">{s.label}</span>
              <span className="font-mono text-[13px] font-semibold tabular-nums" style={{ color: s.color }}>{s.value}%</span>
            </div>
          ))}
          <div className="mt-2 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
            Generic = 1–3 word praise / emoji-only.<br />
            Spam = links, repeated templates, promo.
          </div>
        </div>
      </div>
    </Card>
  );
};

// ---------------- Suspicious Followers Grid ----------------
const SuspiciousFollowers = ({ inf }) => {
  const pct = Math.round((inf.subscores.followerQuality < 50 ? 100 - inf.subscores.followerQuality : (100 - inf.subscores.followerQuality) * 0.6));
  return (
    <Card
      title="Suspicious Followers — Sample"
      subtitle={`Estimated ${pct}% of audience flagged · showing ${inf.suspiciousFollowers.length} examples`}
      action={
        <button className="text-[11px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-50">
          <IconDownload size={12} /> Export full list
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {inf.suspiciousFollowers.map((f, i) => {
          const hue = (i * 47 + 180) % 360;
          return (
            <div key={i} className="border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="relative">
                  <Avatar initials={f.handle.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "??"} hue={hue} size={32} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 grid place-items-center ring-2 ring-white">
                    <IconAlert size={9} stroke={2.5} className="text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[11px] text-slate-900 truncate">{f.handle}</div>
                  <div className="text-[10px] text-slate-500 truncate">{f.bio}</div>
                </div>
              </div>
              <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-100 rounded px-2 py-1 leading-snug">
                {f.reason}
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
                <span>{f.followers} followers</span>
                <button className="hover:text-slate-900 inline-flex items-center gap-1">
                  <IconEye size={10} /> view
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// ---------------- Audience Demographics ----------------
const AudienceDemographics = ({ inf }) => (
  <Card title="Audience Demographics" subtitle="Inferred from follower sample (n=10,000)">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2.5">Age</div>
        <BarList rows={inf.audienceDemo.ageGroups} color="#6366f1" />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2.5">Top countries</div>
        <BarList rows={inf.audienceDemo.topCountries} color="#0f172a" />
      </div>
    </div>
    <div className="mt-5 pt-4 border-t border-slate-100">
      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2.5">Gender split</div>
      <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden">
        <div className="h-full" style={{ width: inf.audienceDemo.genderSplit.female + "%", background: "#ec4899" }} />
        <div className="h-full" style={{ width: inf.audienceDemo.genderSplit.male + "%", background: "#3b82f6" }} />
        <div className="h-full" style={{ width: inf.audienceDemo.genderSplit.other + "%", background: "#94a3b8" }} />
      </div>
      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-pink-500" /> F {inf.audienceDemo.genderSplit.female}%</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-blue-500" /> M {inf.audienceDemo.genderSplit.male}%</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-slate-400" /> Other {inf.audienceDemo.genderSplit.other}%</span>
      </div>
    </div>
  </Card>
);

// ---------------- Compare Mode Column ----------------
const CompareColumn = ({ inf, onChange, allInfluencers, sideLabel }) => {
  const tier = scoreTier(inf.score);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold">{sideLabel}</span>
        <select
          value={inf.id}
          onChange={(e) => onChange(e.target.value)}
          className="text-[12px] font-mono bg-white border border-slate-200 rounded-md px-2 py-1 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {Object.values(allInfluencers).map((i) => (
            <option key={i.id} value={i.id}>{i.handle}</option>
          ))}
        </select>
      </div>
      <ProfileCard inf={inf} compact />
      <GeneratedProfilePhotos inf={inf} compact />
      <Card padded={false}>
        <div className="p-5 flex flex-col items-center">
          <AuthenticityGauge score={inf.score} size={180} thickness={12} />
        </div>
        <div className="px-5 pb-5 flex flex-col gap-3">
          <SubscoreBar label="Follower Quality" value={inf.subscores.followerQuality} />
          <SubscoreBar label="Engagement Authenticity" value={inf.subscores.engagementAuthenticity} />
          <SubscoreBar label="Audience–Content Fit" value={inf.subscores.audienceContentFit} />
          <SubscoreBar label="Growth Pattern" value={inf.subscores.growthPattern} />
        </div>
      </Card>
      <RedFlagsPanel inf={inf} />
      <CommentQuality inf={inf} />
    </div>
  );
};

Object.assign(window, {
  PlatformBadge, ProfileCard, GeneratedProfilePhotos, ScoreCard, RedFlagsPanel,
  EngagementTimeline, CommentQuality, SuspiciousFollowers,
  AudienceDemographics, CompareColumn,
});
