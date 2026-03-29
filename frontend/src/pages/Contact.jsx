import { useEffect, useState } from "react";
import axios from "axios"; // ✅ Import axios at the top

export default function Contact() {
  // --- 1. SEO LOGIC ---
  useEffect(() => {
    document.title = "Contact Us - MyThoughtsHub | Get in Touch";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Have questions? Reach out to the MyThoughtsHub team. Find our contact details, business hours, or send us a direct message.");
  }, []);

  // --- 2. STATE ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  // --- 3. HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Show Loading State
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    try {
      // ✅ Send Data to Backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/contact`, formData);

      if (response.data.success) {
        alert(response.data.message); // "Message received!..."
        // Reset Form
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again.");
    } finally {
      // ✅ Reset Button State
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  };

  // --- 4. RENDER ---
  return (
    <div className="min-h-screen pb-20 bg-base-200">
      
      {/* --- HERO SECTION --- */}
      <div className="py-20 bg-neutral text-neutral-content">
        <div className="px-4 mx-auto text-center max-w-7xl">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Get In Touch</h1>
          <p className="max-w-2xl mx-auto text-lg opacity-80">
            We'd love to hear from you. Whether you have a question about our reviews, want to collaborate, or just want to say hi.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-8 px-4 mx-auto -mt-10 max-w-7xl lg:grid-cols-12">
        
        {/* --- LEFT COLUMN: CONTACT FORM (8 cols) --- */}
        <div className="space-y-8 lg:col-span-8">
          <div className="p-6 shadow-xl bg-base-100 rounded-2xl md:p-10">
            <h2 className="pl-4 mb-6 text-2xl font-bold border-l-4 border-primary">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div className="form-control">
                  <label className="label"><span className="font-medium label-text">Full Name</span></label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe" 
                    className="w-full input input-bordered focus:border-primary" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Email */}
                <div className="form-control">
                  <label className="label"><span className="font-medium label-text">Email Address</span></label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="john@example.com" 
                    className="w-full input input-bordered focus:border-primary" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-control">
                  <label className="label"><span className="font-medium label-text">Phone Number</span></label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="+1 234 567 890" 
                    className="w-full input input-bordered focus:border-primary" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Subject */}
                <div className="form-control">
                  <label className="label"><span className="font-medium label-text">Subject</span></label>
                  <select 
                    name="subject"
                    className="w-full select select-bordered focus:border-primary" 
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled selected>Select a topic</option>
                    <option>General Inquiry</option>
                    <option>Business / Partnership</option>
                    <option>Report an Issue</option>
                    <option>Feedback</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="form-control">
                <label className="label"><span className="font-medium label-text">Message</span></label>
                <textarea 
                  name="message"
                  className="w-full h-32 textarea textarea-bordered focus:border-primary" 
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="w-full px-10 btn btn-primary md:w-auto">Send Message</button>
            </form>
          </div>

          {/* --- FAQ SECTION --- */}
          <div className="p-6 shadow-xl bg-base-100 rounded-2xl md:p-10">
            <h2 className="pl-4 mb-6 text-2xl font-bold border-l-4 border-secondary">Frequently Asked Questions</h2>
            <div className="space-y-4">
              
              {/* FAQ Item 1 */}
              <div className="collapse collapse-arrow bg-base-200 rounded-box">
                <input type="radio" name="my-accordion-2" defaultChecked /> 
                <div className="text-lg font-medium collapse-title">
                  Are your product reviews unbiased?
                </div>
                <div className="text-sm text-gray-600 collapse-content"> 
                  <p>Yes. While we may earn a commission through Amazon Associate links, our reviews are based on honest testing and personal opinion. We only recommend products we actually use or believe in.</p>
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div className="collapse collapse-arrow bg-base-200 rounded-box">
                <input type="radio" name="my-accordion-2" /> 
                <div className="text-lg font-medium collapse-title">
                  Can I write a guest post?
                </div>
                <div className="text-sm text-gray-600 collapse-content"> 
                  <p>Absolutely! We love collaborating with fellow writers. Please send us a message with your topic idea and a writing sample via the contact form above.</p>
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div className="collapse collapse-arrow bg-base-200 rounded-box">
                <input type="radio" name="my-accordion-2" /> 
                <div className="text-lg font-medium collapse-title">
                  How do you handle privacy?
                </div>
                <div className="text-sm text-gray-600 collapse-content"> 
                  <p>We respect your privacy. Any information you send through this form is used solely to respond to your inquiry and is never shared with third parties.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: INFO & MAP (4 cols) --- */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* Contact Info Cards */}
          <div className="p-6 shadow-xl bg-neutral text-neutral-content rounded-2xl">
            <h3 className="mb-6 text-xl font-bold">Contact Info</h3>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-white/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase opacity-60">Email</p>
                  <a href="mailto:shamseerpcshan@gmail.com" className="transition-colors hover:text-primary">
                    shamseerpcshan@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-white/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase opacity-60">Phone</p>
                  <p className="transition-colors hover:text-primary">+91 7012819002</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-white/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase opacity-60">Location</p>
                  <p className="transition-colors hover:text-primary">
                    Kozhikode<br/>
                    Kerala, India
                  </p>
                </div>
              </div>
            </div>

            <div className="divider opacity-30"></div>

            {/* Business Hours */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase opacity-60">Response Time</p>
              <p className="text-sm">We typically respond to emails within 24 hours on business days.</p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative h-64 overflow-hidden shadow-xl cursor-pointer bg-base-100 rounded-2xl group">
            {/* Using a static map image placeholder to avoid API key requirements */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" 
              alt="Map Location" 
              className="object-cover w-full h-full transition-opacity opacity-50 group-hover:opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="shadow-lg btn btn-primary btn-outline">
                View on Google Maps
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div className="p-6 text-center shadow-xl bg-base-100 rounded-2xl">
            <h3 className="mb-4 text-lg font-bold">Follow Us</h3>
            <div className="flex justify-center gap-4">
              {/* FIXED: Replaced href="#" with valid URLs to fix jsx-a11y/anchor-is-valid */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="transition-colors btn btn-circle btn-ghost hover:bg-blue-600 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition-colors btn btn-circle btn-ghost hover:bg-blue-700 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors btn btn-circle btn-ghost hover:bg-pink-600 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}