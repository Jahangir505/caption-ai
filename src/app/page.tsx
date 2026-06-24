import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Globe,
  Star,
  Check,
  ArrowRight,
  Sparkles,
  Camera,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    desc: "Claude AI writes captions optimized for each platform's algorithm and culture.",
  },
  {
    icon: Globe,
    title: "English & Bengali",
    desc: "Generate captions in English, Bengali (বাংলা), or both at once.",
  },
  {
    icon: Zap,
    title: "5 Platforms",
    desc: "Instagram, Facebook, Twitter, LinkedIn, and TikTok — all with platform-specific rules.",
  },
  {
    icon: Star,
    title: "5 Tones",
    desc: "Professional, funny, casual, inspirational, or promotional — you choose.",
  },
];

const platforms = [
  { name: "Instagram", icon: Camera, color: "text-pink-500" },
  { name: "Twitter / X", icon: Zap, color: "text-sky-500" },
  { name: "LinkedIn", icon: Users, color: "text-blue-600" },
];

const testimonials = [
  {
    name: "Rahim Uddin",
    role: "Content Creator, Dhaka",
    text: "আমি প্রতিদিন CaptionAI ব্যবহার করি। এটা আমার ইনস্টাগ্রাম এনগেজমেন্ট ৩× বাড়িয়ে দিয়েছে!",
    avatar: "RU",
  },
  {
    name: "Sarah M.",
    role: "Digital Marketer, London",
    text: "Finally an AI that understands platform nuances. My LinkedIn posts have never performed better.",
    avatar: "SM",
  },
  {
    name: "Farhan Khan",
    role: "Freelancer, Chittagong",
    text: "The Bengali caption support is incredible. No other tool does this as well.",
    avatar: "FK",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative text-center space-y-8">
          <Badge className="inline-flex gap-1.5 px-4 py-1.5 text-sm" variant="outline">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            Powered by Claude AI
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Generate{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              viral captions
            </span>
            <br />
            in seconds
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered caption generator for Instagram, Facebook, Twitter, LinkedIn, and TikTok.
            Supports English and Bengali. Free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" variant="gradient">
              <Link href="/signup">
                Start Free — 10 Captions/Day
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required · Free forever plan available
          </p>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y bg-muted/30 py-6">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Works with:</span>
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <p.icon className={`w-4 h-4 ${p.color}`} />
                <span>{p.name}</span>
              </div>
            ))}
            <span className="text-muted-foreground">+ Facebook · TikTok</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to go viral</h2>
            <p className="text-muted-foreground text-lg">
              Engineered for content creators, marketers, and freelancers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Describe your topic", desc: "Enter what your post is about — a product, event, mood, or idea." },
              { step: "2", title: "Choose platform & tone", desc: "Select your platform and the vibe you want: professional, funny, inspirational..." },
              { step: "3", title: "Get 3 viral captions", desc: "Claude AI generates 3 unique, platform-optimized captions in seconds." },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-lg flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Loved by creators</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-xl border bg-card space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 text-white text-xs flex items-center justify-center font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 bg-gradient-to-br from-violet-600 to-purple-700 text-white">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, affordable pricing</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-violet-200" />
              Free plan: 10 captions/day
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-violet-200" />
              Pro: $9/month or ৳399/month
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-violet-200" />
              Unlimited captions on Pro
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" className="bg-white text-violet-700 hover:bg-violet-50">
              <Link href="/signup">Start for Free</Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
