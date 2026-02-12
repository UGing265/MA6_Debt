import Link from "next/link";
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const CTAFooterSection = () => {
  return (
    <div className="flex flex-col w-full">
      <section className="bg-[#FFFBEB] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <svg
              width="200"
              height="160"
              viewBox="0 0 200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#8B6914]"
            >
              <rect x="40" y="20" width="120" height="100" rx="4" stroke="currentColor" strokeWidth="2" fill="#FFFEF5" />
              <path d="M50 40 H150" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M50 60 H130" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M50 80 H140" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="140" cy="100" r="30" fill="#F0D25D" opacity="0.1" />
              <circle cx="140" cy="100" r="10" stroke="#F0D25D" strokeWidth="2" />
              <path d="M135 100 L145 100 M140 95 L140 105" stroke="#F0D25D" strokeWidth="2" />
              <circle cx="30" cy="130" r="15" stroke="currentColor" strokeWidth="2" fill="#FFFEF5" />
              <path d="M30 145 V160 M15 160 H45" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

          <h2 className="font-patrick text-4xl md:text-5xl font-bold text-[#8B6914] mb-4 tracking-tight">
            Ready to <span className="text-[#F0D25D]">take control</span> of your cash?
          </h2>
          <p className="font-quicksand text-xl text-[#9B8C4F] mb-8 max-w-2xl mx-auto">
            Join people who track simple. Start free now.
          </p>
          
          <Link
            href="/register"
            className="font-quicksand inline-block border-2 border-[#F0D25D] bg-[#F0D25D] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#E8CB50] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Now
          </Link>
        </div>
      </section>

      <footer className="bg-[#FFFBEB] text-[#8B6914] pt-20 pb-8 px-4 sm:px-6 lg:px-8 border-t-2 border-[#F0D25D]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 border border-[#F0D25D]/30 rounded-full text-sm font-medium tracking-wider uppercase mb-4 text-[#9B8C4F]">
                / get in touch /
              </div>
              <h3 className="font-patrick text-4xl md:text-5xl font-bold leading-tight text-[#8B6914]">
                We're here to help
              </h3>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F0D25D]/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Phone className="w-6 h-6 text-[#F0D25D]" />
                  </div>
                  <span className="text-xl font-medium text-[#9B8C4F]">+1 234 567 890</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F0D25D]/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Mail className="w-6 h-6 text-[#F0D25D]" />
                  </div>
                  <span className="text-xl font-medium text-[#9B8C4F]">hello@ma6debt.com</span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <a href="#" className="w-10 h-10 bg-[#FFFEF5] border border-[#F0D25D]/20 text-[#8B6914] rounded flex items-center justify-center hover:bg-[#F0D25D] hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#FFFEF5] border border-[#F0D25D]/20 text-[#8B6914] rounded flex items-center justify-center hover:bg-[#F0D25D] hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#FFFEF5] border border-[#F0D25D]/20 text-[#8B6914] rounded flex items-center justify-center hover:bg-[#F0D25D] hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#FFFEF5] border border-[#F0D25D]/20 text-[#8B6914] rounded flex items-center justify-center hover:bg-[#F0D25D] hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <ContactForm />
          </div>

          <div className="border-t border-[#F0D25D]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-90 text-[#9B8C4F]">
            <p>© {new Date().getFullYear()} MA6 Debt. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-[#8B6914] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#8B6914] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
