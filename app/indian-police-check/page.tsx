import { notFound } from "next/navigation";
import { indianPccEnabled } from "@/lib/site";

export default function IndianPoliceCheckPage() {
  if (!indianPccEnabled()) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sg-navy">Indian Police Check</h1>
      <p className="mt-3 text-gray-700">This form is available when Indian police checks are enabled.</p>
    </div>
  );
}
