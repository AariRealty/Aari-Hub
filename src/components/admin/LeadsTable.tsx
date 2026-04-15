import Link from "next/link";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";
import type { Lead } from "@/lib/types";

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
        <p className="text-sm text-neutral-500">
          No leads match these filters yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <table className="w-full">
        <thead className="border-b border-neutral-200 bg-neutral-50">
          <tr>
            <Th>Name</Th>
            <Th>Contact</Th>
            <Th className="hidden md:table-cell">Intent</Th>
            <Th>Status</Th>
            <Th className="hidden sm:table-cell">Received</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="cursor-pointer transition hover:bg-neutral-50"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="block font-medium text-neutral-900 hover:text-neutral-600"
                >
                  {lead.first_name} {lead.last_name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-neutral-600">
                <div>{lead.phone}</div>
                <div className="truncate text-xs">{lead.email}</div>
              </td>
              <td className="hidden px-4 py-3 text-sm text-neutral-600 md:table-cell">
                {lead.intent ?? "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-neutral-600 sm:table-cell">
                {format(new Date(lead.created_at), "MMM d, yyyy")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 ${className}`}
    >
      {children}
    </th>
  );
}
