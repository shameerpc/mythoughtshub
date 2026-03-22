import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
  // SEO: Update Document Title and Meta Description
  useEffect(() => {
    document.title = "About Us - MyThoughtsHub | Share, Learn, and Grow";
    
    // Create or update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Learn about MyThoughtsHub, a platform built for creators to share ideas, review tech, and connect. Founded by Shamseer.");
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-base-200">
      
      {/* --- HERO SECTION --- */}
      <div className="hero min-h-[60vh] bg-base-200" style={{ backgroundImage: 'url(https://picsum.photos/seed/about/1920/1080)' }}>
        <div className="hero-overlay bg-opacity-70 bg-neutral"></div>
        <div className="text-center hero-content text-neutral-content">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="p-3 mb-4 badge badge-primary badge-outline">Our Story</div>
            <h1 className="mb-5 text-5xl font-bold leading-tight">
              Empowering Voices in the <span className="text-primary">Digital Age</span>
            </h1>
            <p className="mb-8 text-lg font-light opacity-90">
              We believe everyone has a story worth telling. MyThoughtsHub is more than a blog; it's a community dedicated to knowledge sharing, honest reviews, and technological growth.
            </p>
            <Link to="/register" className="text-white border-none btn btn-primary btn-wide">
              Join Our Community
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl px-4 mx-auto -mt-20 space-y-20">
        
        {/* --- MISSION STATEMENT --- */}
        <section className="p-8 text-center border shadow-2xl bg-base-100 rounded-2xl md:p-12 md:text-left border-base-200">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            <div className="flex-1">
              <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
              <p className="text-lg leading-relaxed text-gray-600">
                At <strong>MyThoughtsHub</strong>, our mission is simple: to create a transparent, accessible, and engaging platform for tech enthusiasts and lifestyle creators. 
                We strive to provide high-quality content that educates, entertains, and inspires our readers to innovate and create.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                We are committed to responsible content creation, ensuring that every review and article published here adds genuine value to your life.
              </p>
            </div>
            <div className="w-full md:w-1/3">
              <div className="p-6 text-center border bg-primary/10 rounded-2xl border-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <h3 className="text-xl font-bold">Global Reach</h3>
                <p className="mt-2 text-sm text-gray-500">Connecting creators worldwide.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CORE VALUES (GRID) --- */}
        <section>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">What We Stand For</h2>
            <div className="w-20 h-1 mx-auto mt-2 rounded-full bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Value 1 */}
            <div className="transition-all duration-300 border shadow-xl card bg-base-100 hover:shadow-2xl border-base-200 group">
              <div className="items-center text-center card-body">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-blue-600 transition-transform bg-blue-100 rounded-full group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl card-title">Transparency</h3>
                <p className="mt-2 text-sm text-gray-500">
                  We provide honest reviews and unbiased opinions. Our affiliate partnerships are always clearly disclosed.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="transition-all duration-300 border shadow-xl card bg-base-100 hover:shadow-2xl border-base-200 group">
              <div className="items-center text-center card-body">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-green-600 transition-transform bg-green-100 rounded-full group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-xl card-title">Community</h3>
                <p className="mt-2 text-sm text-gray-500">
                  We foster a supportive environment where creators can learn from each other and grow together.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="transition-all duration-300 border shadow-xl card bg-base-100 hover:shadow-2xl border-base-200 group">
              <div className="items-center text-center card-body">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-purple-600 transition-transform bg-purple-100 rounded-full group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="text-xl card-title">Innovation</h3>
                <p className="mt-2 text-sm text-gray-500">
                  We constantly update our platform with the latest tech trends and design improvements to serve you better.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FOUNDER / CONTACT SECTION --- */}
        <section className="relative overflow-hidden shadow-2xl bg-neutral text-neutral-content rounded-3xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10 grid items-center grid-cols-1 gap-12 p-10 md:p-16 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Meet the Founder</h2>
              <p className="mb-4 text-lg opacity-90">
                Hello! I'm <strong>Shamseer</strong>, the creator of MyThoughtsHub.
              </p>
              <p className="mb-6 leading-relaxed opacity-80">
                I built this platform to bridge the gap between complex technology and everyday users. My goal is to provide a space where honest reviews meet creative writing. 
                Whether you are here to read a blog, check out a tech recommendation, or just say hello, I'd love to hear from you.
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs tracking-wider uppercase opacity-60">Email Me</p>
                    <a href="mailto:shamseerpcshan@gmail.com" className="text-xl font-semibold transition-colors hover:text-primary">
                      shamseerpcshan@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative cursor-pointer group" onClick={() => window.location.href = 'mailto:shamseerpcshan@gmail.com'}>
                <div className="absolute transition duration-1000 opacity-25 -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur group-hover:opacity-75 group-hover:duration-200"></div>
                <div className="relative w-64 p-8 text-center transition-transform duration-300 border shadow-xl bg-base-100 text-base-content rounded-2xl md:w-80 border-base-300 group-hover:scale-105">
                  <div className="mb-4 avatar online">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src="https://api.dicebear.com/7.x/initials/svg?seed=Shamseer" alt="Shamseer" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">Shamseer</h3>
                  <p className="mt-1 text-sm font-bold text-primary">Founder & Developer</p>
                  <p className="mt-4 mb-4 text-xs text-gray-500">Click to send an email</p>
                  <button className="w-full btn btn-sm btn-primary">Contact Me</button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}