import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileRes, subRes, usageRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
    supabase.from("usage").select("*").eq("user_id", user.id).single(),
  ]);

  return (
    <DashboardShell
      profile={profileRes.data}
      subscription={subRes.data}
      usage={usageRes.data}
    >
      {children}
    </DashboardShell>
  );
}
