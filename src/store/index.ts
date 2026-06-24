import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, Subscription, Usage, GenerateCaptionInput } from "@/types";

interface AppState {
  // Auth
  profile: Profile | null;
  subscription: Subscription | null;
  usage: Usage | null;
  setProfile: (profile: Profile | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setUsage: (usage: Usage | null) => void;

  // Caption generation
  isGenerating: boolean;
  lastGeneratedCaptions: string[];
  lastInput: Partial<GenerateCaptionInput>;
  setGenerating: (v: boolean) => void;
  setLastGeneratedCaptions: (captions: string[], input: Partial<GenerateCaptionInput>) => void;

  // History UI
  historyFilter: string;
  setHistoryFilter: (filter: string) => void;

  // Toast
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      subscription: null,
      usage: null,
      setProfile: (profile) => set({ profile }),
      setSubscription: (subscription) => set({ subscription }),
      setUsage: (usage) => set({ usage }),

      isGenerating: false,
      lastGeneratedCaptions: [],
      lastInput: {},
      setGenerating: (isGenerating) => set({ isGenerating }),
      setLastGeneratedCaptions: (captions, input) =>
        set({ lastGeneratedCaptions: captions, lastInput: input }),

      historyFilter: "all",
      setHistoryFilter: (historyFilter) => set({ historyFilter }),

      toast: null,
      showToast: (message, type = "info") => set({ toast: { message, type } }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: "captionai-store",
      partialize: (state) => ({
        lastInput: state.lastInput,
        historyFilter: state.historyFilter,
      }),
    }
  )
);
