export type Platform = "instagram" | "tiktok";

export interface User {
  id: number;
  email: string;
  agency_name: string;
  role: string;
}

export interface Influencer {
  id: number;
  platform: Platform;
  handle: string;
  name: string;
  niche: string;
  avatar: string;
  avatar_hue: number;
  verified: boolean;
  followers: number;
  following: number;
  posts: number;
  account_age_days: number;
  location: string;
  last_scanned_at: string | null;
}

export interface InfluencerSearchItem extends Influencer {
  latest_score: number | null;
  latest_verdict: string | null;
}

export interface RedFlag {
  severity: "high" | "med" | "low";
  text: string;
  category: string;
}

export interface SuspiciousFollower {
  handle: string;
  reason: string;
  bio: string;
  followers: number;
}

export interface Subscores {
  follower_quality: number;
  engagement_authenticity: number;
  audience_content_fit: number;
  growth_pattern: number;
}

export interface CommentBreakdown {
  authentic: number;
  generic: number;
  spam: number;
}

export interface TimelinePoint {
  day: number;
  likes: number;
  comments: number;
  suspicious: boolean;
}

export interface AudienceDemo {
  ageGroups: { label: string; value: number }[];
  topCountries: { country: string; value: number }[];
  genderSplit: { female: number; male: number; other: number };
}

export interface ScanResult {
  id: number;
  status: "queued" | "running" | "done" | "failed";
  influencer: Influencer;
  score: number | null;
  verdict: string | null;
  confidence: number | null;
  subscores: Subscores | null;
  comment_breakdown: CommentBreakdown | null;
  audience_demo: AudienceDemo | null;
  timeline: TimelinePoint[] | null;
  red_flags: RedFlag[];
  suspicious_followers: SuspiciousFollower[];
  started_at: string;
  finished_at: string | null;
}

export interface ScanStatus {
  id: number;
  influencer_id: number;
  status: "queued" | "running" | "done" | "failed";
  started_at: string;
  finished_at: string | null;
  error: string | null;
}
