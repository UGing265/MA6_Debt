import React from "react";
import { Minus, Plus, FileText, Wallet, Save } from "lucide-react";

export const TransactionUI = () => {
  return (
    <div className="w-full h-full p-4 flex flex-col justify-between bg-white relative">
      {/* Amount Input Section */}
      <div className="flex flex-col items-center justify-center gap-1.5 mt-1">
        <span className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-wider">Amount</span>
        <div className="flex items-center justify-center gap-3 w-full">
            <div className="w-6 h-6 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#FF7A00] cursor-pointer hover:bg-[#FF7A00]/10 transition-colors shrink-0">
                <Minus size={12} />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-[#4A2C2A]">-50,000</span>
                <span className="text-[9px] font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-1.5 py-0.5 rounded-full mt-0.5">VND</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#FF7A00] cursor-pointer hover:bg-[#FF7A00]/10 transition-colors shrink-0">
                <Plus size={12} />
            </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#4A2C2A]/5 my-1" />

      {/* Debt Tagging Toggle */}
      <div className="flex items-center justify-between p-2.5 bg-white border border-[#4A2C2A]/10 rounded-lg shadow-sm hover:border-[#FF7A00]/30 transition-colors cursor-pointer group">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-white transition-colors shrink-0">
            <Wallet size={12} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#4A2C2A]">Debt Tagging</span>
            <span className="text-[9px] text-[#8D6E63]">Split this bill?</span>
          </div>
        </div>
        <div className="w-8 h-4 bg-[#E5E7EB] rounded-full relative transition-colors group-hover:bg-[#FF7A00]/20 shrink-0">
            <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform" />
        </div>
      </div>

      {/* Note Input */}
      <div className="flex items-center gap-2 p-2.5 bg-[#F5EFE6] rounded-lg border border-transparent focus-within:border-[#FF7A00]/30 transition-colors">
        <FileText size={14} className="text-[#8D6E63]" />
        <div className="h-4 w-px bg-[#4A2C2A]/10" />
        <span className="text-xs text-[#4A2C2A] opacity-50 font-medium truncate">Add a note...</span>
      </div>

      {/* Save Button */}
      <div className="mt-1 pt-2">
        <button className="w-full py-2.5 bg-[#FF7A00] hover:bg-[#E56E00] text-white rounded-lg font-bold shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]">
          <Save size={14} />
          <span className="text-xs">Save Transaction</span>
        </button>
      </div>
    </div>
  );
};
