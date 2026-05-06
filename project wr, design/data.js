// Mock data for 3 influencers: authentic, borderline, fake
const INFLUENCERS = {
  maya: {
    id: "maya",
    handle: "@mayachen.studio",
    name: "Maya Chen",
    platform: "instagram",
    niche: "Architecture & Interiors",
    avatar: "MC",
    avatarHue: 24,
    verified: true,
    followers: 284300,
    following: 612,
    posts: 1247,
    avgLikes: 18420,
    avgComments: 312,
    accountAge: "6.2 yr",
    location: "Brooklyn, NY",
    generatedPhotos: [
      { src: "assets/profile-gallery/maya-1.png", label: "Cafe sketch", alt: "Maya Chen sketching at a cafe table" },
      { src: "assets/profile-gallery/maya-2.png", label: "Street walk", alt: "Maya Chen walking past residential architecture" },
      { src: "assets/profile-gallery/maya-3.png", label: "Interior detail", alt: "Maya Chen photographing an interior detail" },
      { src: "assets/profile-gallery/maya-4.png", label: "Studio samples", alt: "Maya Chen reviewing material samples in a design studio" },
    ],
    score: 87,
    verdict: "Authentic",
    subscores: {
      followerQuality: 91,
      engagementAuthenticity: 84,
      audienceContentFit: 89,
      growthPattern: 83,
    },
    redFlags: [
      { severity: "low", text: "Slight engagement dip in Feb 2026 — coincides with break announcement" },
      { severity: "low", text: "4% of followers have low post counts (< 5 posts)" },
    ],
    timeline: generateTimeline(80, 0.04, []),
    commentBreakdown: { authentic: 78, generic: 18, spam: 4 },
    suspiciousFollowers: [
      { handle: "@_user_4827193", reason: "No profile picture", bio: "—", followers: 12 },
      { handle: "@designlover_xx88", reason: "Generic username pattern", bio: "lover of all things design ✨", followers: 47 },
      { handle: "@home.inspo.daily22", reason: "Posts only reposts", bio: "daily home inspo 🏡", followers: 189 },
    ],
    audienceDemo: {
      ageGroups: [
        { label: "18-24", value: 14 },
        { label: "25-34", value: 41 },
        { label: "35-44", value: 28 },
        { label: "45-54", value: 12 },
        { label: "55+", value: 5 },
      ],
      topCountries: [
        { country: "United States", value: 38 },
        { country: "United Kingdom", value: 14 },
        { country: "Canada", value: 9 },
        { country: "Australia", value: 7 },
        { country: "Germany", value: 5 },
      ],
      genderSplit: { female: 64, male: 34, other: 2 },
    },
  },

  drew: {
    id: "drew",
    handle: "@drewfitlife",
    name: "Drew Parker",
    platform: "tiktok",
    niche: "Fitness & Wellness",
    avatar: "DP",
    avatarHue: 142,
    verified: false,
    followers: 612400,
    following: 1842,
    posts: 423,
    avgLikes: 8240,
    avgComments: 84,
    accountAge: "1.8 yr",
    location: "Miami, FL",
    generatedPhotos: [
      { src: "assets/profile-gallery/drew-1.png", label: "Post-gym coffee", alt: "Drew Parker drinking coffee after a workout" },
      { src: "assets/profile-gallery/drew-2.png", label: "Outdoor walk", alt: "Drew Parker walking outdoors in athletic clothes" },
      { src: "assets/profile-gallery/drew-3.png", label: "Smoothie prep", alt: "Drew Parker preparing a smoothie in a kitchen" },
      { src: "assets/profile-gallery/drew-4.png", label: "Beach stretch", alt: "Drew Parker stretching near a beach path" },
    ],
    score: 54,
    verdict: "Suspicious",
    subscores: {
      followerQuality: 58,
      engagementAuthenticity: 47,
      audienceContentFit: 62,
      growthPattern: 49,
    },
    redFlags: [
      { severity: "high", text: "Three follower spikes in 90 days — +84k in 48 hours on Mar 14" },
      { severity: "med", text: "Engagement rate (1.4%) far below niche average (3.8%)" },
      { severity: "med", text: "21% of recent comments are generic emoji-only (🔥💪❤️)" },
      { severity: "med", text: "Audience location mismatch — content is US-focused, 34% of followers from Indonesia/Brazil" },
      { severity: "low", text: "Comment-to-like ratio 18% below niche peers" },
    ],
    timeline: generateTimeline(80, 0.18, [22, 48, 71]),
    commentBreakdown: { authentic: 41, generic: 38, spam: 21 },
    suspiciousFollowers: [
      { handle: "@user_8492013", reason: "No profile picture, no posts", bio: "—", followers: 0 },
      { handle: "@fitness.gainz.daily", reason: "Generic niche-keyword username", bio: "💪 gains 💪", followers: 84 },
      { handle: "@_drew.fan.4421", reason: "Account < 30 days old", bio: "biggest fan", followers: 2 },
      { handle: "@workout_motivation99", reason: "Follows 7,000+, has 4 followers", bio: "stay motivated", followers: 4 },
      { handle: "@fit_life_2024_pro", reason: "Default avatar, generic bio", bio: "fitness enthusiast 🏋️", followers: 23 },
      { handle: "@gym.beast.mode_xx", reason: "Posts only stock images", bio: "beast mode 24/7", followers: 156 },
      { handle: "@_drewparker_fan", reason: "Account < 14 days old", bio: "—", followers: 1 },
      { handle: "@protein.gains.life", reason: "Generic keyword spam pattern", bio: "protein > everything", followers: 312 },
    ],
    audienceDemo: {
      ageGroups: [
        { label: "18-24", value: 47 },
        { label: "25-34", value: 28 },
        { label: "35-44", value: 12 },
        { label: "45-54", value: 8 },
        { label: "55+", value: 5 },
      ],
      topCountries: [
        { country: "Indonesia", value: 22 },
        { country: "Brazil", value: 18 },
        { country: "United States", value: 14 },
        { country: "India", value: 11 },
        { country: "Philippines", value: 9 },
      ],
      genderSplit: { female: 38, male: 60, other: 2 },
    },
  },

  ivy: {
    id: "ivy",
    handle: "@ivy.glow.beauty",
    name: "Ivy Marlowe",
    platform: "instagram",
    niche: "Beauty & Skincare",
    avatar: "IM",
    avatarHue: 320,
    verified: false,
    followers: 1240000,
    following: 312,
    posts: 89,
    avgLikes: 4120,
    avgComments: 38,
    accountAge: "0.6 yr",
    location: "Los Angeles, CA",
    generatedPhotos: [
      { src: "assets/profile-gallery/ivy-1.png", label: "Cafe coffee", alt: "Ivy Marlowe sitting at a bright cafe table with coffee" },
      { src: "assets/profile-gallery/ivy-2.png", label: "City walk", alt: "Ivy Marlowe walking on a sunny city sidewalk" },
      { src: "assets/profile-gallery/ivy-3.png", label: "Mirror routine", alt: "Ivy Marlowe doing a skincare mirror selfie at home" },
      { src: "assets/profile-gallery/ivy-4.png", label: "Boutique shelf", alt: "Ivy Marlowe browsing skincare products in a boutique" },
    ],
    score: 23,
    verdict: "Likely Fake",
    subscores: {
      followerQuality: 18,
      engagementAuthenticity: 14,
      audienceContentFit: 31,
      growthPattern: 28,
    },
    redFlags: [
      { severity: "high", text: "1.24M followers on a 7-month-old account — 99th percentile growth velocity" },
      { severity: "high", text: "Engagement rate 0.33% — bottom 4% of beauty creators with 1M+ followers" },
      { severity: "high", text: "32% of followers have no profile picture" },
      { severity: "high", text: "67% of followers were created in the last 90 days" },
      { severity: "high", text: "48% of comments flagged as spam or template-generated" },
      { severity: "med", text: "84% of followers have < 10 followers themselves" },
      { severity: "med", text: "Audience location does not match content language or tags" },
      { severity: "low", text: "Comment timing: 1,200+ comments within 90 seconds of recent posts" },
    ],
    timeline: generateTimeline(80, 0.42, [12, 18, 31, 44, 58, 67, 74]),
    commentBreakdown: { authentic: 14, generic: 38, spam: 48 },
    suspiciousFollowers: [
      { handle: "@user_29384719", reason: "No profile picture, no posts", bio: "—", followers: 0 },
      { handle: "@beauty.queen.8472", reason: "Random number suffix, default avatar", bio: "—", followers: 1 },
      { handle: "@_ivy_fan_19283", reason: "Account 4 days old", bio: "—", followers: 0 },
      { handle: "@glow.up.daily.life", reason: "Generic keyword pattern, no posts", bio: "✨ glow up ✨", followers: 12 },
      { handle: "@skincare_routine_99", reason: "Follows 7.5k, 2 followers", bio: "skincare obsessed", followers: 2 },
      { handle: "@_user_4729384", reason: "No profile picture, no bio", bio: "—", followers: 0 },
      { handle: "@beautyaddict.xx.22", reason: "Account 11 days old", bio: "—", followers: 4 },
      { handle: "@makeup.lover.daily8", reason: "Posts only reposts, default avatar", bio: "makeup is life 💄", followers: 18 },
    ],
    audienceDemo: {
      ageGroups: [
        { label: "18-24", value: 38 },
        { label: "25-34", value: 22 },
        { label: "35-44", value: 14 },
        { label: "45-54", value: 13 },
        { label: "55+", value: 13 },
      ],
      topCountries: [
        { country: "Bangladesh", value: 19 },
        { country: "Pakistan", value: 17 },
        { country: "Egypt", value: 14 },
        { country: "Nigeria", value: 11 },
        { country: "United States", value: 8 },
      ],
      genderSplit: { female: 51, male: 47, other: 2 },
    },
  },
};

// Generate engagement timeline data
function generateTimeline(points, noise, spikeIndices) {
  const data = [];
  let likes = 14000 + Math.random() * 4000;
  let comments = 280 + Math.random() * 80;
  for (let i = 0; i < points; i++) {
    const isSpike = spikeIndices.includes(i);
    const spikeMul = isSpike ? 2.4 + Math.random() * 1.8 : 1;
    const drift = (Math.random() - 0.5) * 2 * noise;
    likes = Math.max(1000, likes * (1 + drift) * (isSpike ? spikeMul : 1));
    comments = Math.max(20, comments * (1 + drift * 0.8) * (isSpike ? spikeMul * 0.6 : 1));
    data.push({
      day: i,
      likes: Math.round(likes),
      comments: Math.round(comments),
      suspicious: isSpike,
    });
  }
  return data;
}

window.INFLUENCERS = INFLUENCERS;
