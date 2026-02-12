"use client";

import { Send } from "lucide-react";
import { FormEvent } from "react";

export const ContactForm = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted");
  };

  return (
    <div className="bg-[#FFFEF5] text-[#8B6914] rounded-2xl p-8 shadow-2xl max-w-md ml-auto w-full border-2 border-[#F0D25D]">
      <h4 className="font-patrick text-2xl font-bold mb-6">Get in Touch</h4>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#8B6914] mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-3 rounded-lg border border-[#E8CB50] focus:border-[#F0D25D] focus:ring-2 focus:ring-[#F0D25D]/20 outline-none transition-all bg-[#FEF9E7] text-[#8B6914]"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#8B6914] mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 rounded-lg border border-[#E8CB50] focus:border-[#F0D25D] focus:ring-2 focus:ring-[#F0D25D]/20 outline-none transition-all bg-[#FEF9E7] text-[#8B6914]"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[#8B6914] mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-[#E8CB50] focus:border-[#F0D25D] focus:ring-2 focus:ring-[#F0D25D]/20 outline-none transition-all bg-[#FEF9E7] text-[#8B6914] resize-none"
            placeholder="How can we help?"
          />
        </div>

        <button
          type="submit"
          className="font-quicksand w-full border-2 border-[#E8CB50] bg-[#F0D25D] text-white font-bold py-4 rounded-lg hover:bg-[#E8CB50] transition-colors flex items-center justify-center gap-2"
        >
          Submit <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
