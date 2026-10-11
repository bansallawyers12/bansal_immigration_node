import type { Metadata } from "next";
import { LegalLayout, legalUpdated } from "@/components/pages/LegalLayout";

export const metadata: Metadata = {
  title: { absolute: "Disclaimer - Bansal Immigration Consultants" },
  description: "Read our disclaimer to understand the limitations and scope of our immigration consulting services.",
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" updated={legalUpdated()}>
      <h2>General Information</h2>
      <p>The information provided on this website and through our services is for general informational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on this website.</p>
      <h2>Immigration Advice</h2>
      <p>Immigration laws and policies are subject to frequent changes. The information provided:</p>
      <ul>
        <li>Is general in nature and may not apply to your specific circumstances</li>
        <li>Should not be considered as specific legal advice</li>
        <li>May become outdated due to changes in legislation or policy</li>
        <li>Does not guarantee any particular outcome</li>
      </ul>
      <h2>Professional Advice</h2>
      <p>Before making any immigration decisions, you should:</p>
      <ul>
        <li>Consult with a qualified migration agent or immigration lawyer</li>
        <li>Verify current information with relevant government authorities</li>
        <li>Consider your individual circumstances carefully</li>
        <li>Seek professional advice tailored to your specific situation</li>
      </ul>
      <h2>No Guarantee of Success</h2>
      <p>We cannot guarantee:</p>
      <ul>
        <li>Successful visa applications or outcomes</li>
        <li>Specific processing times</li>
        <li>Approval of any particular application</li>
        <li>Changes in immigration policies or requirements</li>
      </ul>
      <p>Our fees are service-based and are not contingent on outcomes; we do not offer contingency or success-fee arrangements.</p>
      <h2>Third-Party Information</h2>
      <p>Our website may contain links to third-party websites or information. We:</p>
      <ul>
        <li>Do not control or endorse third-party content</li>
        <li>Are not responsible for the accuracy of third-party information</li>
        <li>Do not guarantee the availability of linked websites</li>
        <li>Are not liable for any damages arising from third-party content</li>
      </ul>
      <h2>Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, Bansal Immigration Consultants:</p>
      <ul>
        <li>Excludes all liability for any loss or damage arising from the use of our services</li>
        <li>Is not liable for indirect, incidental, or consequential damages</li>
        <li>Limits liability to the amount paid for our services</li>
        <li>Excludes liability for government decisions or policy changes</li>
      </ul>
      <h2>Client Responsibility</h2>
      <p>Clients are responsible for:</p>
      <ul>
        <li>Providing accurate and complete information</li>
        <li>Verifying all details before submission</li>
        <li>Understanding the risks associated with immigration applications</li>
        <li>Making informed decisions based on their circumstances</li>
      </ul>
      <h2>Regulatory Compliance</h2>
      <p>We operate in compliance with:</p>
      <ul>
        <li>the requirements of the Office of the Migration Agents Registration Authority (OMARA)</li>
        <li>Australian Consumer Law</li>
        <li>Professional standards and codes of conduct</li>
        <li>Privacy and data protection laws</li>
      </ul>
      <h2>Updates and Changes</h2>
      <p>This disclaimer may be updated from time to time. We recommend reviewing it periodically to stay informed of any changes.</p>
      <h2>Contact Us</h2>
      <ul>
        <li>Email: info@bansalimmigration.com.au</li>
        <li>Phone: +61 3 9602 1330</li>
        <li>Address: Level 8/278 Collins St, Melbourne VIC 3000</li>
      </ul>
      <div className="mt-8 border-l-4 border-yellow-400 bg-yellow-50 p-4 text-yellow-800">
        <strong>Important:</strong> This disclaimer does not affect your statutory rights as a consumer under Australian law.
      </div>
    </LegalLayout>
  );
}
