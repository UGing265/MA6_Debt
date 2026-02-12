import Link from "next/link";
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";

export const CTAFooterSection = () => {
  return (
    <div className="flex flex-col w-full">
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <svg
              width="200"
              height="160"
              viewBox="0 0 200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-900"
            >
              <rect x="40" y="20" width="120" height="100" rx="4" stroke="currentColor" strokeWidth="2" fill="white" />
              <path d="M50 40 H150" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M50 60 H130" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M50 80 H140" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="140" cy="100" r="30" fill="#FF7A00" opacity="0.1" />
              <circle cx="140" cy="100" r="10" stroke="#FF7A00" strokeWidth="2" />
              <path d="M135 100 L145 100 M140 95 L140 105" stroke="#FF7A00" strokeWidth="2" />
              <circle cx="30" cy="130" r="15" stroke="currentColor" strokeWidth="2" fill="white" />
              <path d="M30 145 V160 M15 160 H45" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Ready to <span className="text-[#FF7A00]">take control</span> of your cash?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join people who track simple. Start free now.
          </p>
          
          <Link
            href="/register"
            className="inline-block bg-[#FF7A00] text-white font-semibold px-10 py-4 rounded-full hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Now
          </Link>
        </div>
      </section>

      <footer className="bg-[#FF7A00] text-white pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 border border-white/30 rounded-full text-sm font-medium tracking-wider uppercase mb-4">
                / get in touch /
              </div>
              <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                We're here to help
              </h3>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-medium">+1 234 567 890</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-medium">hello@ma6debt.com</span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <a href="#" className="w-10 h-10 bg-white text-[#FF7A00] rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white text-[#FF7A00] rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white text-[#FF7A00] rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white text-[#FF7A00] rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl max-w-md ml-auto w-full">
              <h4 className="text-2xl font-bold mb-6">Get in Touch</h4>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-all bg-gray-50"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-all bg-gray-50"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-all bg-gray-50 resize-none"
                    placeholder="How can we help?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF7A00] text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  Submit <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-90">
            <p>© {new Date().getFullYear()} MA6 Debt. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white/80 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
