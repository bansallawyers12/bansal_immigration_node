import Link from "next/link";

export default function ContactThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-sg-navy">Thank you</h1>
      <p className="mt-4 text-gray-700">Your message has been received. Our team will be in touch.</p>
      <Link href="/" className="mt-6 inline-block text-sg-light-blue">
        Back to home
      </Link>
    </div>
  );
}
