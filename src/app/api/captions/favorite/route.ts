import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { captionId } = await req.json();
  if (!captionId) return NextResponse.json({ error: "Missing captionId" }, { status: 400 });

  const { data: caption } = await supabase
    .from("captions")
    .select("is_favorite")
    .eq("id", captionId)
    .eq("user_id", user.id)
    .single();

  if (!caption) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase
    .from("captions")
    .update({ is_favorite: !caption.is_favorite })
    .eq("id", captionId);

  return NextResponse.json({ is_favorite: !caption.is_favorite });
}
