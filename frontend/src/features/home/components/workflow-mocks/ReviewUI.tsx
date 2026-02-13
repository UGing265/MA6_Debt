import React from "react";
import { Calendar, Lock, Unlock, Search, History } from "lucide-react";

const ReviewUI = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const startOffset = 1; 

  return (
    <div className="w-full h-full p-4 flex flex-col gap-2.5 bg-white">
      <div className="flex flex-col gap-2 border-b border-dashed border-[#4A2C2A]/10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#FF7A00] shadow-sm shrink-0">
              <Calendar size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#4A2C2A] truncate">Review Period</span>
              <span className="text-[9px] text-[#8D6E63] truncate">Monthly Check-in</span>
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <div className="w-6 h-6 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#8D6E63] cursor-pointer hover:bg-[#FF7A00]/10 transition-colors">
              <Search size={10} />
            </div>
            <div className="w-6 h-6 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#8D6E63] cursor-pointer hover:bg-[#FF7A00]/10 transition-colors">
              <History size={10} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F5EFE6]/50 p-0.5 rounded-lg">
          <div className="flex-1 flex items-center justify-center gap-1 py-1 px-2 bg-gray-100 rounded-md text-gray-400 border border-transparent cursor-not-allowed">
            <Lock size={10} />
            <span className="text-[9px] font-bold">Dec '23</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1 py-1 px-2 bg-white rounded-md text-[#4A2C2A] shadow-sm border border-[#4A2C2A]/5 cursor-pointer">
            <Unlock size={10} className="text-[#FF7A00]" />
            <span className="text-[9px] font-bold">Jan '24</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-7 mb-1.5">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-[8px] font-bold text-[#8D6E63] opacity-80 uppercase">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((day) => {
            const isToday = day === 15;
            const isPast = day < 15;
            
            return (
              <div 
                key={day}
                className={`
                  aspect-square rounded flex items-center justify-center text-[9px] relative transition-all cursor-pointer
                  ${isToday 
                    ? 'bg-[#FF7A00] text-white font-bold shadow-sm scale-105 z-10' 
                    : 'bg-white text-[#4A2C2A] hover:bg-[#F5EFE6] border border-[#4A2C2A]/5'
                  }
                `}
              >
                {day}
                {isPast && (
                  <div className="absolute bottom-0.5 w-0.5 h-0.5 rounded-full bg-[#FF7A00]/40" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-[8px] font-medium text-[#8D6E63]">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span>Locked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
          <span>Active</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewUI;
