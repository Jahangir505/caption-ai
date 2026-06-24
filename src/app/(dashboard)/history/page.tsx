import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HistoryClient from "@/components/dashboard/HistoryClient";

export const metadata = { title: "History — CaptionAI" };

export default async function HistoryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: captions } = await supabase
    .from("captions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return <HistoryClient initialCaptions={captions ?? []} />;
}
