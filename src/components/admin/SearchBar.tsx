"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  // Keep input in sync if the URL changes (e.g. user clicks a status filter).
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Debounce URL updates by 300ms so we don't push on every keystroke.
  useEffect(() => {
    if (value === defaultValue) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      router.replace(qs ? `/admin?${qs}` : "/admin");
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, defaultValue, router, searchParams]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search by name, email, phone, or Instagram…"
      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 sm:max-w-sm"
    />
  );
}
