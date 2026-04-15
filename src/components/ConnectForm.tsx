"use client";

import { useState, type FormEvent } from "react";

const CONTACT_METHODS = ["Text", "Call", "Email", "Instagram DM"] as const;
const INTENTS = [
  "Buy a home",
  "Sell a property",
  "Relocate to or from Southwest Florida",
  "Purchase an investment property",
  "Other",
] as const;

export default function ConnectForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-neutral-100 p-8 text-center">
        <h2 className="text-2xl font-extrabold text-neutral-900">Thank you!</h2>
        <p className="mt-2 text-neutral-600">
          I've received your form and will reach out to you ASAP.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-9">
      <TextField
        label="First Name"
        name="first_name"
        autoComplete="given-name"
        required
      />
      <TextField
        label="Last Name"
        name="last_name"
        autoComplete="family-name"
        required
      />
      <TextField
        label="Phone Number"
        name="phone"
        type="tel"
        autoComplete="tel"
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <TextField label="Instagram Handle" name="instagram" required />

      <RadioGroup
        label="Preferred Method of Contact"
        name="contact_method"
        options={CONTACT_METHODS}
        required
      />

      <RadioGroup label="Intent" name="intent" options={INTENTS} />

      <div>
        <label
          htmlFor="message"
          className="block text-xl font-bold text-neutral-900"
        >
          How Can I Help You?
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Your answer"
          className="mt-3 w-full rounded-lg border border-neutral-300 px-4 py-3 text-base placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-neutral-900 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}

function TextField({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xl font-bold text-neutral-900">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder="Your answer"
        className="mt-3 w-full rounded-lg border border-neutral-300 px-4 py-3 text-base placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
      />
    </div>
  );
}

function RadioGroup({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <fieldset>
      <legend className="block text-xl font-bold text-neutral-900">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </legend>
      <div className="mt-3 space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-full bg-neutral-100 px-5 py-3.5 transition hover:bg-neutral-200 has-[:checked]:bg-neutral-200 has-[:checked]:ring-1 has-[:checked]:ring-neutral-900"
          >
            <input
              type="radio"
              name={name}
              value={option}
              required={required}
              className="h-4 w-4 accent-neutral-900"
            />
            <span className="text-base text-neutral-900">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
