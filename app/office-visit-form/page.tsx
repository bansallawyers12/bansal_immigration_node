import type { Metadata } from "next";
import { OfficeVisitForm } from "@/components/forms/OfficeVisitForm";
import { TurnstileForm } from "@/components/forms/TurnstileForm";

export const metadata: Metadata = {
  title: { absolute: "Book Office Visit | Bansal Immigration" },
  description: "Book an office visit with Bansal Immigration.",
};

export default function OfficeVisitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">Book Office Visit</h1>
      <TurnstileForm form={OfficeVisitForm} />
    </div>
  );
}
