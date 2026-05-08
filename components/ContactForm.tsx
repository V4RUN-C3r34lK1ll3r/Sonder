"use client";

import { useState, type FormEvent } from "react";

const EVENT_TYPES = [
  "Wedding",
  "Engagement / Couples",
  "Family",
  "Housewarming / Pooja",
  "Portrait",
  "Other",
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  date: "",
  message: "",
};

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");

  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  function set(field: keyof FormState) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!endpoint) {
      alert(
        "Contact form not yet configured. Set NEXT_PUBLIC_FORMSPREE_ENDPOINT in .env.local."
      );
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm(EMPTY);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="h-full flex flex-col items-start justify-center py-16">
        <div className="w-10 h-px bg-gold mb-8" />
        <p className="font-serif text-3xl text-ivory mb-4">
          Thank you.
        </p>
        <p className="text-muted leading-relaxed mb-8">
          Your message has been sent. We&apos;ll be in touch within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs text-muted hover:text-gold transition-colors duration-200 tracking-widest uppercase"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full bg-surface border border-border text-ivory placeholder:text-muted/50 px-4 py-3 text-sm focus:outline-none focus:border-gold/60 transition-colors duration-200";
  const labelClass =
    "block text-xs text-muted tracking-widest uppercase mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>Name *</label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={set("name")}
          className={inputClass}
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email *</label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={set("email")}
          className={inputClass}
          placeholder="hello@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>Phone</label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          className={inputClass}
          placeholder="+1 (412) 000-0000"
        />
      </div>

      <div>
        <label htmlFor="eventType" className={labelClass}>Event type *</label>
        <select
          id="eventType"
          required
          value={form.eventType}
          onChange={set("eventType")}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          <option value="" disabled>Select a type…</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className={labelClass}>Event date (approximate)</label>
        <input
          id="date"
          type="date"
          value={form.date}
          onChange={set("date")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message *</label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={set("message")}
          className={`${inputClass} resize-none`}
          placeholder="Tell us a bit about your event, location, and anything else we should know…"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong. Please email us directly or try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 bg-gold text-canvas text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
