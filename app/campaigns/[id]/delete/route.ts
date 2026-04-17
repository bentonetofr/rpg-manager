import { createClient } from "../../../../utils/supabase/server";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, owner_id")
    .eq("id", id)
    .single();

  if (campaignError || !campaign) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (campaign.owner_id !== user.id) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { error: deleteError } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}