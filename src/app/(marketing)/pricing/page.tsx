import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: { usd: 0, bdt: 0 },
    description: "Perfect for getting started",
    badge: null,
    features: [
      "10 captions per day",
      "All 5 platforms",
      "All 5 tones",
      "English & Bengali",
      "3 captions per generation",
      "7-day history",
    ],
    missing: ["Unlimited captions", "Full history", "Priority support"],
    cta: "Start Free",
    href: "/signup",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: { usd: 9, bdt: 399 },
    description: "For serious creators & marketers",
    badge: "Most Popular",
    features: [
      "Unlimited captions",
      "All 5 platforms",
      "All 5 tones",
      "English & Bengali",
      "Up to 5 captions per generation",
      "Full caption history",
      "Favorite & organize captions",
      "Priority support",
    ],
    missing: [],
    cta: "Upgrade to Pro",
    href: "/signup?plan=pro",
    variant: "gradient" as const,
  },
];

export default function PricingPage() {
  return (
    <div className="py-20 md:py-28">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">Simple, transparent pricing</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free, upgrade when you need more. No hidden fees.
          </p>
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 text-sm text-violet-700">
            <Zap className="w-3.5 h-3.5" />
            Bangladesh users: pay in BDT via SSLCommerz
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.badge ? "border-violet-500 shadow-lg shadow-violet-100" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="pro" className="px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
                <div className="pt-2">
                  {plan.price.usd === 0 ? (
                    <span className="text-4xl font-bold">Free</span>
                  ) : (
                    <div className="space-y-1">
                      <div>
                        <span className="text-4xl font-bold">${plan.price.usd}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        or ৳{plan.price.bdt}/month for Bangladesh
                      </p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-violet-600 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild variant={plan.variant} size="lg" className="w-full">
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center">Frequently asked questions</h2>
          {[
            {
              q: "Do I need a credit card to sign up?",
              a: "No. The free plan requires no payment information.",
            },
            {
              q: "Can I pay in BDT (Bangladeshi Taka)?",
              a: "Yes! Bangladesh users can pay ৳399/month via SSLCommerz using bKash, Nagad, and all major cards.",
            },
            {
              q: "What happens when I hit the free limit?",
              a: "The limit resets every day at midnight. You can upgrade to Pro anytime for unlimited captions.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes, cancel anytime from your billing settings. You keep Pro access until the end of your billing period.",
            },
            {
              q: "Which AI model powers CaptionAI?",
              a: "Claude Sonnet by Anthropic — one of the most capable AI models for writing.",
            },
          ].map((item) => (
            <div key={item.q} className="border rounded-lg p-5 space-y-2">
              <h3 className="font-medium">{item.q}</h3>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
