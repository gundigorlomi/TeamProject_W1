import { BarList } from "../components/charts";
import { Card } from "../components/ui";
import type { AudienceDemo } from "../types";

export const AudienceDemographics = ({ demo }: { demo: AudienceDemo }) => (
  <Card title="Audience Demographics" subtitle="Inferred from follower sample (n=10,000)">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2.5">Age</div>
        <BarList rows={demo.ageGroups} color="#6366f1" />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2.5">Top countries</div>
        <BarList rows={demo.topCountries} color="#0f172a" />
      </div>
    </div>
    <div className="mt-5 pt-4 border-t border-slate-100">
      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2.5">Gender split</div>
      <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden bg-slate-100">
        <div
          className="bar-fill h-full"
          style={
            {
              "--target": demo.genderSplit.female + "%",
              background: "linear-gradient(90deg, #f472b6 0%, #ec4899 100%)",
              animationDelay: "100ms",
            } as React.CSSProperties
          }
        />
        <div
          className="bar-fill h-full"
          style={
            {
              "--target": demo.genderSplit.male + "%",
              background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)",
              animationDelay: "260ms",
            } as React.CSSProperties
          }
        />
        <div
          className="bar-fill h-full"
          style={
            {
              "--target": demo.genderSplit.other + "%",
              background: "linear-gradient(90deg, #cbd5e1 0%, #94a3b8 100%)",
              animationDelay: "420ms",
            } as React.CSSProperties
          }
        />
      </div>
      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-pink-500" /> F {demo.genderSplit.female}%</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-blue-500" /> M {demo.genderSplit.male}%</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-slate-400" /> Other {demo.genderSplit.other}%</span>
      </div>
    </div>
  </Card>
);
