import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const tranId = `CAPT-${user.id.slice(0, 8)}-${Date.now()}`;

  const payload = {
    store_id: process.env.SSLCOMMERZ_STORE_ID,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
    total_amount: 399,
    currency: "BDT",
    tran_id: tranId,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/sslcommerz/success`,
    fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?cancelled=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?cancelled=true`,
    cus_name: profile?.full_name ?? "Customer",
    cus_email: profile?.email ?? user.email,
    cus_phone: "01700000000",
    cus_add1: "Bangladesh",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    shipping_method: "NO",
    product_name: "CaptionAI Pro",
    product_category: "SaaS",
    product_profile: "non-physical-goods",
    value_a: user.id,
    value_b: tranId,
  };

  const isSandbox = process.env.SSLCOMMERZ_SANDBOX === "true";
  const baseUrl = isSandbox
    ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
    : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

  const formData = new URLSearchParams(
    Object.entries(payload).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {})
  );

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data = await res.json();

  if (data.status === "SUCCESS") {
    // Store pending tran_id
    await supabase
      .from("subscriptions")
      .update({ sslcommerz_tran_id: tranId })
      .eq("user_id", user.id);

    return NextResponse.json({ url: data.GatewayPageURL });
  }

  return NextResponse.json({ error: "SSLCommerz initialization failed" }, { status: 500 });
}
