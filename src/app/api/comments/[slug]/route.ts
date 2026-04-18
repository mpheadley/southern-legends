import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ comments: [] });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("comments")
    .select("id, name, message, created_at")
    .eq("slug", slug)
    .eq("approved", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase fetch error:", error);
    return NextResponse.json({ comments: [] });
  }

  return NextResponse.json({ comments: data ?? [] });
}
