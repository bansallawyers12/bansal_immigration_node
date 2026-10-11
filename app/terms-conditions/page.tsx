import type { Metadata } from "next";
import { LegalLayout } from "@/components/pages/LegalLayout";

export const metadata: Metadata = {
  title: { absolute: "Terms & Conditions - Bansal Immigration Consultants" },
  description:
    "Read our terms and conditions to understand the terms of service for Bansal Immigration Consultants immigration services.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="September 1, 2025">
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using the services of Bansal Immigration Consultants (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h2>2. Services Provided</h2>
      <p>We provide immigration consulting services including but not limited to:</p>
      <ul>
        <li>Visa application assistance</li>
        <li>Immigration advice and consultation</li>
        <li>Document preparation and review</li>
        <li>Lodgement of applications with relevant authorities</li>
        <li>Follow-up and case management</li>
      </ul>
      <h2>3. Client Responsibilities</h2>
      <p>As our client, you agree to:</p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Submit all required documents in a timely manner</li>
        <li>Pay all fees as agreed</li>
        <li>Inform us of any changes in your circumstances</li>
        <li>Comply with all applicable laws and regulations</li>
      </ul>
      <h2>4. Fees and Payment</h2>
      <p>Our fees are as agreed in your service agreement. Payment terms include:</p>
      <ul>
        <li>Initial consultation fees are payable in advance</li>
        <li>Service fees are due as per the payment schedule</li>
        <li>Government fees are separate and payable directly to authorities</li>
        <li>Fees are not contingent on outcomes; we do not offer contingency or success-fee arrangements</li>
        <li>Late payment may result in service suspension</li>
      </ul>
      <h2>5. Limitation of Liability</h2>
      <p>While we strive to provide accurate advice and services, we cannot guarantee:</p>
      <ul>
        <li>Successful visa outcomes</li>
        <li>Processing times by government authorities</li>
        <li>Changes in immigration laws or policies</li>
        <li>Third-party actions or decisions</li>
      </ul>
      <h2>6. Confidentiality</h2>
      <p>We maintain strict confidentiality of all client information and will not disclose personal details to third parties without consent, except as required by law.</p>
      <h2>7. Professional Standards</h2>
      <p>We are committed to maintaining the highest professional standards and comply with all relevant regulations, including the requirements of the Office of the Migration Agents Registration Authority (OMARA).</p>
      <h2>8. Termination</h2>
      <p>Either party may terminate our services with written notice. Upon termination:</p>
      <ul>
        <li>All outstanding fees become immediately due</li>
        <li>We will provide a summary of work completed</li>
        <li>Client files will be returned as requested</li>
      </ul>
      <h2>9. Governing Law</h2>
      <p>These terms are governed by the laws of Australia. Any disputes will be resolved in the courts of Victoria, Australia.</p>
      <h2>10. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.</p>
      <h2>11. Contact Information</h2>
      <p>For questions about these terms, please contact us at:</p>
      <ul>
        <li>Email: info@bansalimmigration.com.au</li>
        <li>Phone: +61 3 9602 1330</li>
        <li>Address: Level 8/278 Collins St, Melbourne VIC 3000</li>
      </ul>
    </LegalLayout>
  );
}
