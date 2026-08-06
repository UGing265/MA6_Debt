"use client";

import Link from "next/link";
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { useLanguage } from "@/context/LanguageContext";

export const CTAFooterSection = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full">
      <section className="bg-[#FFFDF5] py-20 px-4 sm:px-6 lg:px-8 font-quicksand">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <svg
              width="200"
              height="160"
              viewBox="0 0 200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#1F2937]"
            >
              <rect x="40" y="20" width="120" height="100" rx="4" stroke="currentColor" strokeWidth="1.5" fill="white" />
              <path d="M50 40 H150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M50 60 H130" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M50 80 H140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="140" cy="100" r="30" fill="#FCD34D" opacity="0.2" />
              <circle cx="140" cy="100" r="10" stroke="#D97706" strokeWidth="2" />
              <path d="M135 100 L145 100 M140 95 L140 105" stroke="#D97706" strokeWidth="2" />
              <circle cx="30" cy="130" r="15" stroke="currentColor" strokeWidth="1.5" fill="white" />
              <path d="M30 145 V160 M15 160 H45" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4 tracking-tight font-patrick">
            {t.home.cta.title}
          </h2>
          <p className="text-xl text-[#4B5563] mb-8 max-w-2xl mx-auto">
            {t.home.cta.description}
          </p>
          
          <Link
            href="/register"
            className="inline-block bg-[#FCD34D] text-[#1F2937] font-semibold px-10 py-4 rounded-full hover:bg-[#FBBF24] transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-[#1F2937]/30"
          >
            {t.home.cta.button}
          </Link>
        </div>
      </section>

      <footer className="bg-[#FFFBEB] text-[#1F2937] pt-20 pb-8 px-4 sm:px-6 lg:px-8 border-t border-[#1F2937]/10 font-quicksand">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 border border-[#4A2C2A]/10 rounded-full text-sm font-medium tracking-wider uppercase mb-4 text-[#8D6E63]">
                / {t.home.cta.contactTitle.toLowerCase()} /
              </div>
              <h3 className="text-4xl md:text-5xl font-bold leading-tight text-[#1F2937] font-patrick">
                {t.home.cta.helpTitle}
              </h3>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-[#4A2C2A]/10">
                    <Phone className="w-6 h-6 text-[#D97706]" />
                  </div>
                  <span className="text-xl font-medium text-[#4B5563]">+1 234 567 890</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-[#4A2C2A]/10">
                    <Mail className="w-6 h-6 text-[#D97706]" />
                  </div>
                  <span className="text-xl font-medium text-[#4B5563]">hello@ma6debt.com</span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <a href="#" className="w-10 h-10 bg-white border border-[#1F2937]/10 text-[#1F2937] rounded flex items-center justify-center hover:bg-[#FCD34D] hover:text-[#1F2937] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-[#1F2937]/10 text-[#1F2937] rounded flex items-center justify-center hover:bg-[#FCD34D] hover:text-[#1F2937] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-[#1F2937]/10 text-[#1F2937] rounded flex items-center justify-center hover:bg-[#FCD34D] hover:text-[#1F2937] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-[#1F2937]/10 text-[#1F2937] rounded flex items-center justify-center hover:bg-[#FCD34D] hover:text-[#1F2937] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <ContactForm />
          </div>

          <div className="border-t border-[#1F2937]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-90 text-[#4B5563]">
            <p>© {new Date().getFullYear()} MA6 Debt. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-[#4A2C2A] transition-colors">
                {t.home.footer.privacy}
              </Link>
              <Link href="/terms" className="hover:text-[#4A2C2A] transition-colors">
                {t.home.footer.terms}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
