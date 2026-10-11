import type { Metadata } from "next";
import { AfpForm } from "@/components/forms/AfpForm";
import { TurnstileForm } from "@/components/forms/TurnstileForm";

export const metadata: Metadata = {
  title: { absolute: "AFP National Police Check | Bansal Immigration" },
  description: "Apply for an AFP national police check through Bansal Immigration.",
};

export default function AfpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">AFP National Police Check</h1>
      <p className="mt-3 text-gray-700">
        Identity documents are stored outside the public website and are not listed here.
      </p>
      <TurnstileForm form={AfpForm} />
    </div>
  );
}
