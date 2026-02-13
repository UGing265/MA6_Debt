import React from "react";
import { Wallet, ArrowDown, RefreshCw, Calculator } from "lucide-react";

const ProcessingUI = () => {
  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7A00]/20 to-[#FF7A00]/60" />
      
      <div className="flex flex-col items-center gap-2 w-full max-w-[200px]">
        
        <div className="w-full bg-white border border-[#4A2C2A]/10 rounded-lg p-2.5 shadow-sm relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-[#F5EFE6] rounded text-[#FF7A00]">
                <Wallet size={12} />
              </div>
              <span className="text-[10px] font-bold text-[#4A2C2A]">Sub-wallet</span>
            </div>
            <span className="text-[9px] font-medium text-[#8D6E63]">Sending...</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-xs font-bold text-[#4A2C2A]">$150.00</span>
             <span className="text-[10px] font-bold text-red-500">-$25.00</span>
          </div>
        </div>

        <div className="relative h-8 w-full flex items-center justify-center">
           <div className="absolute inset-0 flex items-center justify-center text-[#FF7A00]/80 animate-bounce">
              <ArrowDown size={14} />
           </div>
           <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#FF7A00]/10 text-[#FF7A00] text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <RefreshCw size={8} className="animate-spin" />
              Syncing
           </div>
        </div>

        <div className="w-full bg-[#4A2C2A] text-white rounded-lg p-2.5 shadow-md relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[#FF7A00]/10 animate-pulse" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="p-1 bg-white/10 rounded text-white">
                  <Calculator size={12} />
                </div>
                <span className="text-[10px] font-bold">Parent Wallet</span>
              </div>
              <span className="text-[9px] font-medium text-white/80">Receiving</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-xs font-bold">$1,250.00</span>
               <span className="text-[10px] font-bold text-[#FF7A00] bg-white/10 px-1 py-0.5 rounded">+$25.00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProcessingUI;
