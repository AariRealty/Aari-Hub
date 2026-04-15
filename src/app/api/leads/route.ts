import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendNewLeadEmail } from "@/lib/email";
import { leadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("leads").insert({
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    instagram_handle: parsed.data.instagram,
    contact_method: parsed.data.contact_method,
    intent: parsed.data.intent ?? null,
    message: parsed.data.message,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 },
    );
  }

  // Fire-and-forget email notification. The lead is already saved, so we
  // don't want a Resend hiccup to fail the form submission.
  await sendNewLeadEmail({
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    instagram_handle: parsed.data.instagram,
    contact_method: parsed.data.contact_method,
    intent: parsed.data.intent ?? null,
    message: parsed.data.message,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
