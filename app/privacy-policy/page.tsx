import type { Metadata } from "next";
import { LegalLayout, legalUpdated } from "@/components/pages/LegalLayout";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy - Bansal Immigration Consultants" },
  description:
    "Read our privacy policy to understand how Bansal Immigration Consultants collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated={legalUpdated()}>
      <h2>Introduction</h2>
      <p>Bansal Immigration Consultants (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
      <h2>Information We Collect</h2>
      <h3>Personal Information</h3>
      <p>We may collect personal information that you voluntarily provide to us, including:</p>
      <ul>
        <li>Name and contact information</li>
        <li>Date of birth and citizenship details</li>
        <li>Educational and employment history</li>
        <li>Immigration history and visa information</li>
        <li>Financial information for visa applications</li>
        <li>Family and relationship details</li>
      </ul>
      <h3>Automatically Collected Information</h3>
      <p>We may automatically collect certain information about your device and usage patterns:</p>
      <ul>
        <li>IP address and browser type</li>
        <li>Pages visited and time spent on our site</li>
        <li>Referring website information</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide immigration consultation and visa application services</li>
        <li>Communicate with you about your case and our services</li>
        <li>Process payments and maintain records</li>
        <li>Comply with legal and regulatory requirements</li>
        <li>Improve our website and services</li>
        <li>Send you relevant information and updates (with your consent)</li>
      </ul>
      <h2>Information Sharing and Disclosure</h2>
      <p>We may share your information in the following circumstances:</p>
      <ul>
        <li><strong>Government Authorities:</strong> As required for visa applications and legal compliance</li>
        <li><strong>Service Providers:</strong> With trusted third parties who assist in providing our services</li>
        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
        <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of assets</li>
      </ul>
      <h2>Data Security</h2>
      <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
      <h2>Data Retention</h2>
      <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Immigration records are typically retained for at least 7 years after case completion.</p>
      <h2>Your Rights</h2>
      <p>Depending on your location, you may have the following rights:</p>
      <ul>
        <li>Access to your personal information</li>
        <li>Correction of inaccurate information</li>
        <li>Deletion of your information (subject to legal requirements)</li>
        <li>Restriction of processing</li>
        <li>Data portability</li>
        <li>Objection to processing</li>
      </ul>
      <h2>Cookies and Tracking</h2>
      <p>We use cookies and similar technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.</p>
      <h2>Third-Party Links</h2>
      <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>
      <h2>Children&apos;s Privacy</h2>
      <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
      <h2>International Transfers</h2>
      <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.</p>
      <h2>Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on our website.</p>
      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <p>
          <strong>Bansal Immigration Consultants</strong>
          <br />
          Level 8/278 Collins Street
          <br />
          Melbourne VIC 3000, Australia
          <br />
          Phone: +61 3 9602 1330
          <br />
          Email: info@bansalimmigration.com.au
        </p>
      </div>
    </LegalLayout>
  );
}
