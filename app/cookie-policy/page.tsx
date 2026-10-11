import type { Metadata } from "next";
import { LegalLayout, legalUpdated } from "@/components/pages/LegalLayout";

export const metadata: Metadata = {
  title: { absolute: "Cookie Policy - Bansal Immigration Consultants" },
  description: "Learn about how Bansal Immigration Consultants uses cookies and similar technologies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" updated={legalUpdated()}>
      <h2>What Are Cookies?</h2>
      <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain functionality.</p>
      <h2>How We Use Cookies</h2>
      <p>We use cookies for several purposes:</p>
      <ul>
        <li>To remember your preferences and settings</li>
        <li>To analyze how our website is used</li>
        <li>To improve our website&apos;s performance and functionality</li>
        <li>To provide personalized content and services</li>
        <li>To ensure website security</li>
      </ul>
      <h2>Types of Cookies We Use</h2>
      <h3>Essential Cookies</h3>
      <p>These cookies are necessary for the website to function properly. They include:</p>
      <ul>
        <li>Session cookies for maintaining your session</li>
        <li>Security cookies for protecting against fraud</li>
        <li>Load balancing cookies for website performance</li>
      </ul>
      <h3>Analytics Cookies</h3>
      <ul>
        <li>Google Analytics cookies</li>
        <li>Page view tracking</li>
        <li>User behavior analysis</li>
        <li>Website performance monitoring</li>
      </ul>
      <h3>Functional Cookies</h3>
      <ul>
        <li>Your language preferences</li>
        <li>Your location settings</li>
        <li>Your form data (temporarily)</li>
        <li>Your accessibility preferences</li>
      </ul>
      <h3>Marketing Cookies</h3>
      <ul>
        <li>Show relevant advertisements</li>
        <li>Track campaign effectiveness</li>
        <li>Provide personalized content</li>
        <li>Measure advertising performance</li>
      </ul>
      <h2>Third-Party Cookies</h2>
      <ul>
        <li><strong>Google Analytics:</strong> For website analytics</li>
        <li><strong>Social Media:</strong> For social sharing functionality</li>
        <li><strong>Payment Processors:</strong> For secure payment processing</li>
        <li><strong>Chat Services:</strong> For customer support</li>
      </ul>
      <h2>Managing Your Cookie Preferences</h2>
      <ul>
        <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
        <li><strong>Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
        <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
        <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions</li>
      </ul>
      <h2>Contact Us</h2>
      <ul>
        <li>Email: info@bansalimmigration.com.au</li>
        <li>Phone: +61 3 9602 1330</li>
        <li>Address: Level 8/278 Collins St, Melbourne VIC 3000</li>
      </ul>
      <div className="mt-8 border-l-4 border-blue-400 bg-blue-50 p-4 text-blue-800">
        <strong>Note:</strong> By continuing to use our website, you consent to our use of cookies as described in this policy.
      </div>
    </LegalLayout>
  );
}
