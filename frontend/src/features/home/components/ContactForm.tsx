"use client";

import { Send } from "lucide-react";
import { FormEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";

export const ContactForm = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted");
  };

  return (
    <div className="bg-white text-[#4A2C2A] rounded-2xl p-8 shadow-lg max-w-md ml-auto w-full border border-[#4A2C2A]/10">
      <h4 className="text-2xl font-bold mb-6">{t.home.cta.contactTitle}</h4>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#8D6E63] mb-1">
            {t.home.contact.name}
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-3 rounded-lg border border-[#4A2C2A]/10 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-all bg-[#FDFCFB] text-[#4A2C2A]"
            placeholder={t.home.contact.namePlaceholder}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#8D6E63] mb-1">
            {t.home.contact.email}
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 rounded-lg border border-[#4A2C2A]/10 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-all bg-[#FDFCFB] text-[#4A2C2A]"
            placeholder={t.home.contact.emailPlaceholder}
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[#8D6E63] mb-1">
            {t.home.contact.message}
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-[#4A2C2A]/10 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-all bg-[#FDFCFB] text-[#4A2C2A] resize-none"
            placeholder={t.home.contact.messagePlaceholder}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#FF7A00] text-white font-bold py-4 rounded-lg hover:bg-[#E56E00] transition-colors flex items-center justify-center gap-2 shadow-sm border border-[#4A2C2A]/30"
        >
          {t.home.contact.submit} <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
