import React from "react";

export default function Terms() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <article className="p-8 bg-white rounded-2xl shadow-sm prose prose-lg max-w-none">
        <h1>Terms and Conditions</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Introduction</h2>
        <p>By accessing MyThoughtsHub, you agree to be bound by these terms and conditions.</p>

        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download materials for personal, non-commercial viewing only. You may not modify, copy, or distribute the materials.</p>

        <h2>3. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account and password.</p>

        <h2>4. Content</h2>
        <p>User comments are their own and do not reflect our views. We reserve the right to remove inappropriate comments.</p>

        <h2>5. Limitation of Liability</h2>
        <p>In no event shall MyThoughtsHub be liable for damages arising from the use or inability to use the materials on our website.</p>
      </article>
    </div>
  );
}