"use client";

import dynamic from "next/dynamic";

// next/dynamic with ssr:false must live in a client component in Next.js 15+
const EventGalaxy = dynamic(() => import("@/components/EventGalaxy"), { ssr: false });

interface HeroWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  tagline?: string;
  subTagline?: string;
}

export function HeroWrapper({ events, tagline, subTagline }: HeroWrapperProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <EventGalaxy events={events as any} tagline={tagline} subTagline={subTagline} />
  );
}
