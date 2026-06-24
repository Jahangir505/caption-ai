"use client";
import { useState } from "react";
import type { Caption } from "@/types";
import { PLATFORM_LABELS, TONE_LABELS } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Heart, Check, Search, Trash2, BookOpen } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Props {
  initialCaptions: Caption[];
}

export default function HistoryClient({ initialCaptions }: Props) {
  const [captions, setCaptions] = useState(initialCaptions);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [favFilter, setFavFilter] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = captions.filter((c) => {
    if (search && !c.topic.toLowerCase().includes(search.toLowerCase())) return false;
    if (platformFilter !== "all" && c.platform !== platformFilter) return false;
    if (favFilter && !c.is_favorite) return false;
    return true;
  });

  async function toggleFavorite(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from("captions").update({ is_favorite: !current }).eq("id", id);
    setCaptions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_favorite: !current } : c))
    );
  }

  async function deleteCaption(id: string) {
    const supabase = createClient();
    await supabase.from("captions").delete().eq("id", id);
    setCaptions((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleCopy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Caption History</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {captions.length} caption{captions.length !== 1 ? "s" : ""} generated
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {Object.entries(PLATFORM_LABELS).map(([v, l]) => (
              <SelectItem key={v} value={v}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={favFilter ? "default" : "outline"}
          size="sm"
          onClick={() => setFavFilter(!favFilter)}
          className="gap-1.5"
        >
          <Heart className={`w-3.5 h-3.5 ${favFilter ? "fill-current" : ""}`} />
          Favorites
        </Button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-muted-foreground/40" />
          <p className="font-medium">No captions found</p>
          <p className="text-sm text-muted-foreground">
            {captions.length === 0
              ? "Start generating captions to see them here"
              : "Try adjusting your filters"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((caption) => (
            <Card key={caption.id} className="group">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{caption.topic}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-[10px]">
                        {PLATFORM_LABELS[caption.platform]}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {TONE_LABELS[caption.tone]}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {caption.language}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(caption.created_at)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleFavorite(caption.id, caption.is_favorite)}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          caption.is_favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteCaption(caption.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {caption.generated_captions.map((text, idx) => (
                    <div
                      key={idx}
                      className="group/caption flex items-start gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <p className="text-sm flex-1 whitespace-pre-wrap leading-relaxed">
                        {text}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 group-hover/caption:opacity-100 transition-opacity"
                        onClick={() => handleCopy(text, `${caption.id}-${idx}`)}
                      >
                        {copied === `${caption.id}-${idx}` ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
