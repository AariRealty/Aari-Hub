import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  status: z
    .enum(["new", "contacted", "qualified", "closed_won", "closed_lost"])
    .optional(),
  notes: z.string().nullable().optional(),
  follow_up_at: z.string().nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  // Defense in depth: middleware + admin layout already gate access, but we
  // still verify the request has a valid session before touching the database.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("leads")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    console.error("Supabase update error:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
