import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: { absolute: "Book a Consultation | Bansal Immigration" },
  description: "Book a consultation with a registered migration agent.",
};

export default function BookAppointmentPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">Book a Consultation</h1>
      <p className="mt-3 text-sg-dark-gray">Choose a location, enquiry type, and an open time. Booked times are removed from the calendar.</p>
      <BookingForm />
    </div>
  );
}
