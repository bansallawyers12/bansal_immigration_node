import Link from "next/link";

export default function OfficeVisitThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-sg-navy">Office visit request received</h1>
      <Link href="/" className="mt-6 inline-block text-sg-light-blue">Back to home</Link>
    </div>
  );
}
