export type Plan = "free" | "pro";
export type SubscriptionStatus = "active" | "cancelled" | "past_due";
export type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
export type Tone = "professional" | "funny" | "casual" | "inspirational" | "promotional";
export type Language = "english" | "bengali" | "both";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  sslcommerz_tran_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Usage {
  id: string;
  user_id: string;
  count: number;
  reset_date: string;
  updated_at: string;
}

export interface Caption {
  id: string;
  user_id: string;
  topic: string;
  platform: Platform;
  tone: Tone;
  language: Language;
  generated_captions: string[];
  is_favorite: boolean;
  created_at: string;
}

export interface GenerateCaptionInput {
  topic: string;
  platform: Platform;
  tone: Tone;
  language: Language;
  keywords?: string;
  count?: number;
}

export interface GenerateCaptionResponse {
  captions: string[];
  captionId: string;
}

export interface CheckoutSession {
  url: string;
}

export const FREE_DAILY_LIMIT = 10;
export const PRO_PRICE_USD = 9;
export const PRO_PRICE_BDT = 399;

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
};

export const TONE_LABELS: Record<Tone, string> = {
  professional: "Professional",
  funny: "Funny",
  casual: "Casual",
  inspirational: "Inspirational",
  promotional: "Promotional",
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  english: "English",
  bengali: "Bengali (বাংলা)",
  both: "Both",
};
