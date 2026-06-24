"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store";
import type { Profile, Subscription, Usage } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  LayoutDashboard,
  History,
  Settings,
  CreditCard,
  LogOut,
  Crown,
} from "lucide-react";
import { FREE_DAILY_LIMIT } from "@/types";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Generate" },
  { href: "/history", icon: History, label: "History" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface Props {
  children: React.ReactNode;
  profile: Profile | null;
  subscription: Subscription | null;
  usage: Usage | null;
}

export default function DashboardShell({ children, profile, subscription, usage }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { setProfile, setSubscription, setUsage } = useAppStore();

  useEffect(() => {
    setProfile(profile);
    setSubscription(subscription);
    setUsage(usage);
  }, [profile, subscription, usage, setProfile, setSubscription, setUsage]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isPro = subscription?.plan === "pro" && subscription?.status === "active";
  const usageCount = usage?.count ?? 0;
  const usagePct = Math.min((usageCount / FREE_DAILY_LIMIT) * 100, 100);
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card sticky top-0 h-screen">
        <div className="p-5 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              CaptionAI
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-violet-100 text-violet-700"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-4">
          {!isPro && (
            <div className="bg-violet-50 border border-violet-100 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Daily captions</span>
                <span className="font-medium">
                  {usageCount}/{FREE_DAILY_LIMIT}
                </span>
              </div>
              <Progress value={usagePct} className="h-1.5" />
              <Button asChild variant="gradient" size="sm" className="w-full text-xs">
                <Link href="/billing">
                  <Crown className="w-3 h-3 mr-1" />
                  Upgrade to Pro
                </Link>
              </Button>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url ?? ""} />
              <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name ?? "User"}</p>
              <div className="flex items-center gap-1">
                <Badge variant={isPro ? "pro" : "free"} className="text-[10px] px-1.5 py-0">
                  {isPro ? "Pro" : "Free"}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 z-40 h-14 border-b bg-card items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            CaptionAI
          </span>
        </Link>
        <Avatar className="h-8 w-8 cursor-pointer" onClick={handleSignOut}>
          <AvatarImage src={profile?.avatar_url ?? ""} />
          <AvatarFallback className="text-xs bg-violet-100 text-violet-700">{initials}</AvatarFallback>
        </Avatar>
      </div>

      {/* Main content */}
      <main className="flex-1 md:p-8 p-4 pt-20 md:pt-8 max-w-5xl">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden border-t bg-card h-16">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                active ? "text-violet-600" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
