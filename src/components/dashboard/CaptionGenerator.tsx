"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/store";
import type { Platform, Tone, Language, GenerateCaptionResponse } from "@/types";
import { PLATFORM_LABELS, TONE_LABELS, LANGUAGE_LABELS, FREE_DAILY_LIMIT } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Check, Heart, Zap, Crown, RefreshCw } from "lucide-react";

const schema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters").max(300),
  platform: z.enum(["instagram", "facebook", "twitter", "linkedin", "tiktok"]),
  tone: z.enum(["professional", "funny", "casual", "inspirational", "promotional"]),
  language: z.enum(["english", "bengali", "both"]),
  keywords: z.string().max(200).optional(),
});

type FormData = z.infer<typeof schema>;

export default function CaptionGenerator() {
  const router = useRouter();
  const { subscription, usage, setUsage, setLastGeneratedCaptions, lastInput, showToast } =
    useAppStore();
  const [captions, setCaptions] = useState<string[]>([]);
  const [captionId, setCaptionId] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const [favorited, setFavorited] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");

  const isPro = subscription?.plan === "pro" && subscription?.status === "active";
  const usageCount = usage?.count ?? 0;
  const atLimit = !isPro && usageCount >= FREE_DAILY_LIMIT;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: (lastInput.platform as Platform) ?? "instagram",
      tone: (lastInput.tone as Tone) ?? "casual",
      language: (lastInput.language as Language) ?? "english",
    },
  });

  const platform = watch("platform");
  const tone = watch("tone");
  const language = watch("language");

  async function onSubmit(data: FormData) {
    setError("");
    setCaptions([]);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, count: isPro ? 5 : 3 }),
    });

    const json = await res.json();
    if (!res.ok) {
      if (res.status === 429) {
        setError(`Daily limit reached (${FREE_DAILY_LIMIT}/day). Upgrade to Pro for unlimited captions.`);
      } else {
        setError(json.error ?? "Generation failed");
      }
      return;
    }

    const result: GenerateCaptionResponse = json;
    setCaptions(result.captions);
    setCaptionId(result.captionId);
    setLastGeneratedCaptions(result.captions, data);

    if (usage) {
      setUsage({ ...usage, count: usage.count + 1 });
    }

    router.refresh();
  }

  async function handleCopy(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    showToast("Caption copied!", "success");
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleFavorite(idx: number) {
    const res = await fetch("/api/captions/favorite", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ captionId, index: idx }),
    });

    if (res.ok) {
      setFavorited((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        return next;
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Generate Captions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Describe your post and get 3{isPro ? "–5" : ""} viral captions instantly
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr,1.2fr] gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="topic">What is your post about?</Label>
            <Textarea
              id="topic"
              placeholder="e.g. Launching my new handmade jewelry collection for Eid"
              rows={3}
              {...register("topic")}
              className={errors.topic ? "border-destructive" : ""}
            />
            {errors.topic && (
              <p className="text-xs text-destructive">{errors.topic.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select
                value={platform}
                onValueChange={(v) => setValue("platform", v as Platform)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PLATFORM_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select
                value={tone}
                onValueChange={(v) => setValue("tone", v as Tone)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TONE_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Language</Label>
            <Select
              value={language}
              onValueChange={(v) => setValue("language", v as Language)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGE_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="keywords">
              Keywords{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="keywords"
              placeholder="e.g. summer, discount, handmade"
              {...register("keywords")}
            />
          </div>

          {atLimit ? (
            <div className="space-y-3">
              <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                You&apos;ve used all {FREE_DAILY_LIMIT} free captions today. Upgrade to Pro for unlimited.
              </div>
              <Button asChild variant="gradient" className="w-full">
                <Link href="/billing">
                  <Crown className="mr-2 w-4 h-4" />
                  Upgrade to Pro — $9/month
                </Link>
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 w-4 h-4" />
                  Generate Captions
                  {!isPro && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      {FREE_DAILY_LIMIT - usageCount} left today
                    </Badge>
                  )}
                </>
              )}
            </Button>
          )}

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {error}
            </div>
          )}
        </form>

        {/* Results */}
        <div className="space-y-4">
          {isSubmitting && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl border bg-muted animate-pulse shimmer"
                />
              ))}
            </div>
          )}

          {captions.length > 0 && !isSubmitting && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Generated Captions
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSubmit(onSubmit)}
                  className="text-xs gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </Button>
              </div>
              {captions.map((caption, idx) => (
                <Card
                  key={idx}
                  className="group hover:shadow-md transition-shadow animate-fade-in"
                >
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{caption}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        Caption {idx + 1}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleFavorite(idx)}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              favorited.has(idx)
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleCopy(caption, idx)}
                        >
                          {copied === idx ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {captions.length === 0 && !isSubmitting && (
            <div className="flex flex-col items-center justify-center h-64 text-center rounded-xl border-2 border-dashed space-y-3">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <p className="font-medium">Your captions will appear here</p>
                <p className="text-sm text-muted-foreground">
                  Fill in the form and hit Generate
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
