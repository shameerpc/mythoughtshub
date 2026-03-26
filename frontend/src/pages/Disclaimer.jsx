import React from "react";

export default function Disclaimer() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <article className="p-8 bg-white rounded-2xl shadow-sm prose prose-lg max-w-none">
        <h1>Disclaimer</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>General Disclaimer</h2>
        <p>The information provided by MyThoughtsHub is for general informational purposes only. We make no representation or warranty regarding the accuracy or completeness of the content.</p>

        <h2>Affiliate Disclaimer</h2>
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>
            <strong>Amazon Associates Disclosure:</strong> MyThoughtsHub is a participant in the Amazon Services LLC Associates Program. As an Amazon Associate, we earn from qualifying purchases.
          </span>
        </div>
        <p>We may earn a commission when you use our links to make a purchase. This does not affect the price you pay.</p>

        <h2>External Links</h2>
        <p>The Site may contain links to external websites. We are not responsible for the content or privacy practices of these external sites.</p>
      </article>
    </div>
  );
}