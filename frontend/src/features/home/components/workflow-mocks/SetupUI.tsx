"use client";

import React from "react";
import { Wallet, FolderTree, Users, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SetupUI = () => {
  const { t } = useLanguage();

  return (
  <div className="w-full h-full p-4 flex flex-col justify-between bg-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF7A00]/5 rounded-bl-full pointer-events-none" />
    
    <div className="flex flex-col gap-3 relative z-10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-[#4A2C2A] uppercase tracking-wider">{t.home.workflow.mock.setup.title}</span>
        <div className="bg-[#F5EFE6] px-1.5 py-0.5 rounded-full text-[9px] font-bold text-[#FF7A00]">
          {t.home.workflow.mock.setup.active}
        </div>
      </div>

      <div className="p-2.5 bg-gradient-to-br from-[#FF7A00] to-[#E56E00] rounded-lg shadow-md text-white flex items-center gap-2.5 transform transition-transform hover:scale-[1.02]">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
          <Wallet size={16} className="text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold truncate">{t.home.workflow.mock.setup.mainAccount}</span>
          <span className="text-[9px] opacity-80 font-medium tracking-wide">VG...9012</span>
        </div>
        <div className="ml-auto text-xs font-bold whitespace-nowrap">$12,450</div>
      </div>

      <div className="flex justify-center -my-1.5 relative z-0">
        <div className="h-4 w-0.5 bg-[#4A2C2A]/10" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-white border border-[#4A2C2A]/5 rounded-lg shadow-sm hover:border-[#FF7A00]/30 transition-colors group cursor-pointer">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#8D6E63] group-hover:bg-[#FF7A00]/10 group-hover:text-[#FF7A00] transition-colors shrink-0">
              <FolderTree size={12} />
            </div>
            <span className="text-[10px] font-bold text-[#4A2C2A] truncate">{t.home.workflow.mock.setup.savings}</span>
          </div>
          <div className="text-xs font-bold text-[#4A2C2A] group-hover:text-[#FF7A00] transition-colors">$4,000</div>
        </div>

        <div className="p-2 bg-white border border-[#4A2C2A]/5 rounded-lg shadow-sm hover:border-[#FF7A00]/30 transition-colors group cursor-pointer">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#8D6E63] group-hover:bg-[#FF7A00]/10 group-hover:text-[#FF7A00] transition-colors shrink-0">
              <FolderTree size={12} />
            </div>
            <span className="text-[10px] font-bold text-[#4A2C2A] truncate">{t.home.workflow.mock.setup.daily}</span>
          </div>
          <div className="text-xs font-bold text-[#4A2C2A] group-hover:text-[#FF7A00] transition-colors">$850</div>
        </div>
      </div>
    </div>

    <div className="mt-1 pt-2 border-t border-dashed border-[#4A2C2A]/10 relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Users size={12} className="text-[#FF7A00]" />
          <span className="text-[10px] font-bold text-[#8D6E63]">{t.home.workflow.mock.setup.debtPartners}</span>
        </div>
        <button className="w-5 h-5 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-all shadow-sm">
          <Plus size={12} />
        </button>
      </div>
      
      <div className="flex -space-x-1.5 pl-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-6 h-6 rounded-full border border-white bg-gray-100 flex items-center justify-center shadow-sm relative hover:z-10 hover:scale-110 transition-transform cursor-pointer overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=transparent`}
              alt={t.home.workflow.mock.setup.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="w-6 h-6 rounded-full border border-white bg-[#F5EFE6] flex items-center justify-center text-[9px] font-bold text-[#8D6E63] z-0 shadow-sm shrink-0">
          +2
        </div>
      </div>
    </div>
  </div>
  );
};

export default SetupUI;
