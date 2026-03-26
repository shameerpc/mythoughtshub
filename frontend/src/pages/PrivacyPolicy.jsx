import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <article className="p-8 bg-white rounded-2xl shadow-sm prose prose-lg max-w-none">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Introduction</h2>
        <p>Welcome to MyThoughtsHub. We are committed to protecting your personal information and your right to privacy.</p>

        <h2>2. Information We Collect</h2>
        <p>We collect information you provide directly to us when you create an account, post comments, or contact us. This includes Username, Email address, and Profile information.</p>

        <h2>3. Cookies and Web Beacons</h2>
        <p>We use cookies to enhance your experience. Essential cookies are required for user authentication. We may also use analytics cookies to understand visitor behavior.</p>

        <h2>4. Third-Party Ads and Services</h2>
        <p>We use third-party advertising companies (like Google AdSense) to serve ads. These companies may use cookies to serve ads based on your prior visits to our website.</p>

        <h2>5. Data Security</h2>
        <p>We implement security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data via your account settings.</p>
      </article>
    </div>
  );
}