import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LeadEditor from "@/components/admin/LeadEditor";
import StatusBadge from "@/components/admin/StatusBadge";
import type { Lead } from "@/lib/types";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lead) {
    notFound();
  }

  const typedLead = lead as Lead;
  const igHandle = typedLead.instagram_handle.replace(/^@/, "");

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
      >
        ← Back to inbox
      </Link>

      <div className="mt-6 mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {typedLead.first_name} {typedLead.last_name}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Received{" "}
            {format(
              new Date(typedLead.created_at),
              "MMMM d, yyyy 'at' h:mm a",
            )}
          </p>
        </div>
        <StatusBadge status={typedLead.status} />
      </div>

      {/* Quick contact actions */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <ContactCard
          icon="📞"
          label="Call"
          value={typedLead.phone}
          href={`tel:${typedLead.phone}`}
        />
        <ContactCard
          icon="💬"
          label="Text"
          value={typedLead.phone}
          href={`sms:${typedLead.phone}`}
        />
        <ContactCard
          icon="✉️"
          label="Email"
          value={typedLead.email}
          href={`mailto:${typedLead.email}`}
        />
        <ContactCard
          icon="📸"
          label="Instagram"
          value={`@${igHandle}`}
          href={`https://instagram.com/${igHandle}`}
          external
        />
      </div>

      {/* Original message from the form */}
      <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          From the form
        </h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Preferred contact method
            </dt>
            <dd className="mt-1 text-neutral-900">
              {typedLead.contact_method}
            </dd>
          </div>
          {typedLead.intent && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">
                Intent
              </dt>
              <dd className="mt-1 text-neutral-900">{typedLead.intent}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              How can I help you?
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-neutral-900">
              {typedLead.message}
            </dd>
          </div>
        </dl>
      </div>

      <LeadEditor lead={typedLead} />
    </main>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 hover:shadow-sm"
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wide text-neutral-500">
          {label}
        </div>
        <div className="truncate font-medium text-neutral-900">{value}</div>
      </div>
    </a>
  );
}
