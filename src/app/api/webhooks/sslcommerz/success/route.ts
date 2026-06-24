import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendProUpgradeEmail } from "@/lib/resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const formData = await req.formData();
  const status = formData.get("status") as string;
  const valId = formData.get("val_id") as string;
  const userId = formData.get("value_a") as string;
  const tranId = formData.get("tran_id") as string;

  if (status !== "VALID" || !userId || !valId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/billing?cancelled=true`
    );
  }

  // Validate with SSLCommerz
  const isSandbox = process.env.SSLCOMMERZ_SANDBOX === "true";
  const validateUrl = isSandbox
    ? `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&format=json`
    : `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&format=json`;

  const validateRes = await fetch(validateUrl);
  const validation = await validateRes.json();

  if (validation.status !== "VALID") {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/billing?error=validation_failed`
    );
  }

  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await supabaseAdmin.from("subscriptions").update({
    plan: "pro",
    status: "active",
    sslcommerz_tran_id: tranId,
    current_period_end: periodEnd.toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("user_id", userId);

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();

  if (profile?.email) {
    await sendProUpgradeEmail(profile.email, profile.full_name ?? "Creator");
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`
  );
}
