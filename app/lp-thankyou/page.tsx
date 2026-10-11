import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";

export default function LpThankYouPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-lg px-4 py-24 text-center">Loading…</p>}>
      <ThankYouBody />
    </Suspense>
  );
}

async function ThankYouBody() {
  const jar = await cookies();
  const name = jar.get("lp_thankyou_name")?.value || "there";
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-sg-navy">Thank you, {name}!</h1>
      <p className="mt-4 text-sg-dark-gray">Our education counsellors will contact you shortly.</p>
      <Link href="/lp" className="mt-8 inline-block text-sg-light-blue hover:underline">Back to the landing page</Link>
    </div>
  );
}
