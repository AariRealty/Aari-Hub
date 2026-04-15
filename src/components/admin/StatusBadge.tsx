import type { LeadStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; className: string }
> = {
  new: { label: "New", className: "bg-blue-100 text-blue-800" },
  contacted: { label: "Contacted", className: "bg-yellow-100 text-yellow-800" },
  qualified: { label: "Qualified", className: "bg-purple-100 text-purple-800" },
  closed_won: { label: "Won", className: "bg-green-100 text-green-800" },
  closed_lost: { label: "Lost", className: "bg-neutral-200 text-neutral-700" },
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
