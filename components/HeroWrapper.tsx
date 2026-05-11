"use client";

import dynamic from "next/dynamic";

const ParallaxHero = dynamic(() => import("@/components/ParallaxHero"), { ssr: false });

interface HeroWrapperProps {
  events?: unknown[];
  tagline?: string;
  subTagline?: string;
}

export function HeroWrapper({ tagline, subTagline }: HeroWrapperProps) {
  return <ParallaxHero tagline={tagline} subTagline={subTagline} />;
}
