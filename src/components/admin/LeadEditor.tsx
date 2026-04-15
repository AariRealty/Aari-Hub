"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead, LeadStatus } from "@/lib/types";

const STATUSES: Array<{ value: LeadStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed_won", label: "Won" },
  { value: "closed_lost", label: "Lost" },
];

type Updates = Partial<Pick<Lead, "status" | "notes" | "follow_up_at">>;

export default function LeadEditor({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [followUpAt, setFollowUpAt] = useState(
    lead.follow_up_at ? lead.follow_up_at.slice(0, 10) : "",
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(updates: Updates) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Failed to save");
      }
      setSavedAt(new Date());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Manage
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="block text-xs font-medium text-neutral-700"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => {
              const next = e.target.value as LeadStatus;
              setStatus(next);
              save({ status: next });
            }}
            className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="follow_up"
            className="block text-xs font-medium text-neutral-700"
          >
            Next follow-up
          </label>
          <input
            id="follow_up"
            type="date"
            value={followUpAt}
            onChange={(e) => {
              const next = e.target.value;
              setFollowUpAt(next);
              save({ follow_up_at: next || null });
            }}
            className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="notes"
          className="block text-xs font-medium text-neutral-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if ((lead.notes ?? "") !== notes) {
              save({ notes: notes || null });
            }
          }}
          rows={6}
          placeholder="Private notes about this lead — call summaries, preferences, follow-up reminders…"
          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Notes save when you click outside the box.
        </p>
      </div>

      <div className="mt-3 flex h-5 items-center justify-between text-xs">
        <span className="text-neutral-500">
          {saving
            ? "Saving…"
            : savedAt
              ? `Saved at ${savedAt.toLocaleTimeString()}`
              : ""}
        </span>
        {error && <span className="text-red-600">{error}</span>}
      </div>
    </div>
  );
}
