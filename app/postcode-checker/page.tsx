import type { Metadata } from "next";
import { PostcodeChecker } from "@/components/tools/PostcodeChecker";

export const metadata: Metadata = {
  title: { absolute: "Postcode Checker | Bansal Immigration" },
  description: "Check whether an Australian postcode is regional for migration points.",
};

export default function PostcodeCheckerPage() {
  return <PostcodeChecker />;
}
