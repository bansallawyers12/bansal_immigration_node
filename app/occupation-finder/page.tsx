import type { Metadata } from "next";
import { OccupationFinder } from "@/components/tools/OccupationFinder";

export const metadata: Metadata = {
  title: { absolute: "Occupation Finder | Bansal Immigration" },
  description: "Search ANZSCO occupations for Australian skilled migration.",
};

export default function OccupationFinderPage() {
  return <OccupationFinder />;
}
