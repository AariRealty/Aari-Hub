import Link from "next/link";
import type { LeadStatus } from "@/lib/types";

const FILTERS: Array<{ value: LeadStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed_won", label: "Won" },
  { value: "closed_lost", label: "Lost" },
];

export default function StatusFilter({
  current,
  q,
}: {
  current: LeadStatus | null;
  q: string;
}) {
  function buildHref(value: LeadStatus | "all") {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (value !== "all") params.set("status", value);
    const qs = params.toString();
    return qs ? `/admin?${qs}` : "/admin";
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive =
          filter.value === "all" ? !current : current === filter.value;
        return (
          <Link
            key={filter.value}
            href={buildHref(filter.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              isActive
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-100"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
