import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: { absolute: "Contact | Bansal Immigration" },
  description: "Contact Bansal Immigration in Melbourne, Adelaide, or the Philippines.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">Contact</h1>
      <p className="mt-3 text-sg-dark-gray">
        Send us your details and a registered migration agent will reply. You can also call +61 3 9602 1330.
      </p>
      <ContactForm />
    </div>
  );
}
