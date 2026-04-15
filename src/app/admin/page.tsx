import { createSupabaseServerClient } from "@/lib/supabase/server";
import LeadsTable from "@/components/admin/LeadsTable";
import SearchBar from "@/components/admin/SearchBar";
import StatusFilter from "@/components/admin/StatusFilter";
import type { Lead, LeadStatus } from "@/lib/types";

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "closed_won",
  "closed_lost",
];

function isLeadStatus(value: string | undefined): value is LeadStatus {
  return !!value && STATUSES.includes(value as LeadStatus);
}

// Strip characters that could break PostgREST `or` filter syntax.
function sanitizeQuery(q: string) {
  return q.replace(/[^a-zA-Z0-9@. _-]/g, "").trim();
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const q = sanitizeQuery(params.q ?? "");
  const status = isLeadStatus(params.status) ? params.status : null;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (q) {
    const like = `%${q}%`;
    query = query.or(
      [
        `first_name.ilike.${like}`,
        `last_name.ilike.${like}`,
        `email.ilike.${like}`,
        `phone.ilike.${like}`,
        `instagram_handle.ilike.${like}`,
      ].join(","),
    );
  }

  const { data: leads, error } = await query;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          Inbox
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          {leads?.length ?? 0} {leads?.length === 1 ? "lead" : "leads"}
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar defaultValue={q} />
        <StatusFilter current={status} q={q} />
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Couldn't load leads: {error.message}
        </p>
      )}

      <LeadsTable leads={(leads ?? []) as Lead[]} />
    </main>
  );
}
