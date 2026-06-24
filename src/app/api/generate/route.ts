import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCaptions } from "@/lib/anthropic";
import { FREE_DAILY_LIMIT } from "@/types";
import type { GenerateCaptionInput } from "@/types";

export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const isPro = subscription?.plan === "pro" && subscription?.status === "active";

  // Check & increment usage for free users
  if (!isPro) {
    const { data: usage } = await supabase
      .from("usage")
      .select("count, reset_date")
      .eq("user_id", user.id)
      .single();

    const today = new Date().toISOString().split("T")[0];

    if (usage) {
      // Reset if new day
      if (usage.reset_date !== today) {
        await supabase
          .from("usage")
          .update({ count: 0, reset_date: today, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);
      } else if (usage.count >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          { error: `Daily limit of ${FREE_DAILY_LIMIT} reached. Upgrade to Pro.` },
          { status: 429 }
        );
      }
    }
  }

  const body = await req.json();
  const input: GenerateCaptionInput = {
    topic: body.topic,
    platform: body.platform,
    tone: body.tone,
    language: body.language,
    keywords: body.keywords,
    count: isPro ? Math.min(body.count ?? 3, 5) : 3,
  };

  try {
    const captions = await generateCaptions(input);

    // Save to DB
    const { data: captionRow } = await supabase
      .from("captions")
      .insert({
        user_id: user.id,
        topic: input.topic,
        platform: input.platform,
        tone: input.tone,
        language: input.language,
        generated_captions: captions,
      })
      .select("id")
      .single();

    // Increment usage for free users
    if (!isPro) {
      await supabase.rpc("increment_usage", { uid: user.id });
    }

    return NextResponse.json({
      captions,
      captionId: captionRow?.id ?? "",
    });
  } catch (err) {
    console.error("Caption generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate captions. Please try again." },
      { status: 500 }
    );
  }
}
