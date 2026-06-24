import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BillingClient from "@/components/dashboard/BillingClient";

export const metadata = { title: "Billing — CaptionAI" };

export default async function BillingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileRes, subRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
  ]);

  return (
    <BillingClient
      profile={profileRes.data}
      subscription={subRes.data}
    />
  );
}
