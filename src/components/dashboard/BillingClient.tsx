"use client";
import { useState } from "react";
import type { Profile, Subscription } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Crown, Loader2, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  profile?: Profile | null;
  subscription: Subscription | null;
}

const proFeatures = [
  "Unlimited caption generation",
  "Up to 5 captions per generation",
  "Full caption history",
  "Favorites & organization",
  "Priority support",
  "English & Bengali",
];

export default function BillingClient({ subscription }: Props) {
  const [loading, setLoading] = useState<"stripe" | "sslcommerz" | "portal" | null>(null);

  const isPro = subscription?.plan === "pro" && subscription?.status === "active";

  async function handleStripeCheckout() {
    setLoading("stripe");
    try {
      const res = await fetch("/api/checkout/stripe", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(null);
    }
  }

  async function handleSSLCommerzCheckout() {
    setLoading("sslcommerz");
    try {
      const res = await fetch("/api/checkout/sslcommerz", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/checkout/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your subscription and payment method
        </p>
      </div>

      {/* Current plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <CardDescription>Your active subscription</CardDescription>
            </div>
            <Badge variant={isPro ? "pro" : "free"} className="text-sm px-3 py-1">
              {isPro ? (
                <>
                  <Crown className="w-3.5 h-3.5 mr-1" />
                  Pro
                </>
              ) : (
                "Free"
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPro ? (
            <>
              <p className="text-sm text-muted-foreground">
                Your Pro plan renews on{" "}
                <strong>
                  {subscription?.current_period_end
                    ? formatDate(subscription.current_period_end)
                    : "—"}
                </strong>
              </p>
              {subscription?.stripe_subscription_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePortal}
                  disabled={loading === "portal"}
                >
                  {loading === "portal" ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-2 w-4 h-4" />
                  )}
                  Manage Subscription
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              You are on the <strong>Free</strong> plan — 10 captions per day.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upgrade card */}
      {!isPro && (
        <Card className="border-violet-200 shadow-md shadow-violet-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-violet-600" />
              <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
            </div>
            <CardDescription>Unlock unlimited captions and all features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-2">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-violet-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-medium">Choose your payment method:</p>

              {/* International */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">International (USD)</p>
                    <p className="text-2xl font-bold mt-0.5">
                      $9<span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                  </div>
                  <div className="flex gap-1 text-xs text-muted-foreground">
                    Visa · Mastercard · PayPal
                  </div>
                </div>
                <Button
                  variant="gradient"
                  className="w-full"
                  onClick={handleStripeCheckout}
                  disabled={loading !== null}
                >
                  {loading === "stripe" ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  ) : null}
                  Pay with Stripe
                </Button>
              </div>

              {/* Bangladesh */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Bangladesh (BDT)</p>
                    <p className="text-2xl font-bold mt-0.5">
                      ৳399<span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    bKash · Nagad · Card
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50"
                  onClick={handleSSLCommerzCheckout}
                  disabled={loading !== null}
                >
                  {loading === "sslcommerz" ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  ) : null}
                  Pay with SSLCommerz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
