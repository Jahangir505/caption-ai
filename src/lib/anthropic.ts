import Anthropic from "@anthropic-ai/sdk";
import type { GenerateCaptionInput } from "@/types";

export async function generateCaptions(input: GenerateCaptionInput): Promise<string[]> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const { topic, platform, tone, language, keywords, count = 3 } = input;

  const platformGuide: Record<string, string> = {
    instagram: "Use emojis, 2-3 relevant hashtags, max 2200 chars, visually engaging",
    facebook: "Conversational, can be longer, encourage engagement/comments",
    twitter: "Max 280 chars, punchy, one strong hashtag",
    linkedin: "Professional, insight-driven, no excessive emojis, 1-3 hashtags",
    tiktok: "Trendy, energetic, youth-oriented, 3-5 hashtags, use popular slang",
  };

  const languageInstruction =
    language === "both"
      ? "Write each caption in both English AND Bengali (বাংলা). Put English first, then Bengali below it separated by a line break."
      : language === "bengali"
      ? "Write all captions in Bengali (বাংলা) only."
      : "Write all captions in English only.";

  const prompt = `You are an expert social media copywriter. Generate exactly ${count} unique, high-performing ${platform} captions.

Topic: ${topic}
Platform: ${platform} — ${platformGuide[platform]}
Tone: ${tone}
${keywords ? `Keywords to include: ${keywords}` : ""}
Language: ${languageInstruction}

Rules:
- Each caption must be distinct and creative
- Match the platform's character limits and culture
- Include appropriate emojis for the platform
- Make them viral-worthy and engaging
- Number each caption (1., 2., 3., etc.)
- Separate each caption with "---"
- Do NOT include any intro text or explanation, just the numbered captions`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from Claude");

  const rawText = content.text.trim();
  const captions = rawText
    .split("---")
    .map((c) => c.replace(/^\d+\.\s*/m, "").trim())
    .filter((c) => c.length > 0)
    .slice(0, count);

  return captions;
}
