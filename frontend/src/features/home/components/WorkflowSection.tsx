import React from "react";
import { ArrowRight, Wallet, ArrowRightLeft, RefreshCw, Lock } from "lucide-react";
import { SetupUI, TransactionUI, ProcessingUI, ReviewUI } from "./workflow-mocks";

const ExpenseTrackerUI = () => (
  <div className="w-full h-full p-6 flex flex-col gap-4 bg-white">
    <div className="flex items-center justify-between border-b border-dashed border-[#4A2C2A]/10 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#FF7A00] shadow-sm">
          <Wallet size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#4A2C2A]">Groceries</span>
          <span className="text-xs text-[#8D6E63]">Today, 10:30 AM</span>
        </div>
      </div>
      <span className="text-base font-bold text-red-500">-$45.00</span>
    </div>
    <div className="flex items-center justify-between border-b border-dashed border-[#4A2C2A]/10 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shadow-sm">
          <ArrowRight size={20} className="rotate-45" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#4A2C2A]">Salary</span>
          <span className="text-xs text-[#8D6E63]">Yesterday</span>
        </div>
      </div>
      <span className="text-base font-bold text-green-500">+$3,200.00</span>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
          <Wallet size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#4A2C2A]">Coffee</span>
          <span className="text-xs text-[#8D6E63]">Yesterday</span>
        </div>
      </div>
      <span className="text-base font-bold text-red-500">-$4.50</span>
    </div>
  </div>
);

const BudgetPlannerUI = () => (
  <div className="w-full h-full p-6 flex flex-col gap-5 bg-white">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-bold text-[#4A2C2A]">Monthly Budget</span>
      <span className="text-xs font-medium text-[#8D6E63] bg-[#F5EFE6] px-2 py-1 rounded-full">Oct 2023</span>
    </div>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-[#8D6E63]">Food & Dining</span>
          <span className="font-bold text-[#FF7A00]">75%</span>
        </div>
        <div className="h-2.5 w-full bg-[#F5EFE6] rounded-full overflow-hidden">
          <div className="h-full bg-[#FF7A00] w-3/4 rounded-full" />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-[#8D6E63]">Transportation</span>
          <span className="font-bold text-green-600">40%</span>
        </div>
        <div className="h-2.5 w-full bg-[#F5EFE6] rounded-full overflow-hidden">
          <div className="h-full bg-green-500 w-2/5 rounded-full" />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-[#8D6E63]">Entertainment</span>
          <span className="font-bold text-red-600">90%</span>
        </div>
        <div className="h-2.5 w-full bg-[#F5EFE6] rounded-full overflow-hidden">
          <div className="h-full bg-red-500 w-[90%] rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const DebtManagerUI = () => (
  <div className="w-full h-full p-6 flex flex-col gap-4 bg-white">
    <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-[#FF7A00]/30 shadow-sm transition-transform hover:scale-[1.02]">
      <div className="w-10 h-10 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#4A2C2A] font-bold text-sm">
        JD
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-[#4A2C2A]">John Doe</div>
        <div className="text-xs font-medium text-[#FF7A00]">Owes you</div>
      </div>
      <div className="text-base font-bold text-green-600">+$50.00</div>
    </div>
    <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-[#4A2C2A]/10 shadow-sm transition-transform hover:scale-[1.02]">
      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm">
        AS
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-[#4A2C2A]">Alice Smith</div>
        <div className="text-xs font-medium text-[#8D6E63]">You owe</div>
      </div>
      <div className="text-base font-bold text-red-500">-$25.00</div>
    </div>
    <div className="flex justify-center mt-2">
      <span className="text-xs font-medium text-[#8D6E63] hover:text-[#FF7A00] cursor-pointer transition-colors">View all debts →</span>
    </div>
  </div>
);

const ReportsUI = () => (
  <div className="w-full h-full p-6 flex flex-col justify-end gap-4 bg-white">
    <div className="flex items-end justify-between h-40 gap-3 px-2 border-b border-[#4A2C2A]/10 pb-2">
      <div className="w-full bg-[#FF7A00]/40 rounded-t-md h-[40%] hover:bg-[#FF7A00]/50 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#4A2C2A] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$40</div>
      </div>
      <div className="w-full bg-[#FF7A00]/60 rounded-t-md h-[60%] hover:bg-[#FF7A00]/70 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#4A2C2A] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$60</div>
      </div>
      <div className="w-full bg-[#FF7A00]/50 rounded-t-md h-[30%] hover:bg-[#FF7A00]/60 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#4A2C2A] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$30</div>
      </div>
      <div className="w-full bg-[#FF7A00] rounded-t-md h-[80%] hover:bg-[#E56E00] transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#4A2C2A] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$80</div>
      </div>
      <div className="w-full bg-[#FF7A00]/80 rounded-t-md h-[50%] hover:bg-[#FF7A00]/90 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#4A2C2A] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$50</div>
      </div>
    </div>
    <div className="flex justify-between text-xs font-medium text-[#8D6E63] px-2">
      <span>Mon</span>
      <span>Tue</span>
      <span>Wed</span>
      <span>Thu</span>
      <span>Fri</span>
    </div>
  </div>
);

const features = [
  {
    title: "Set Up Wallets",
    description: "Create parent and sub-wallets, add debt partners",
    details: "Easily configure your wallet hierarchy and invite partners to start tracking shared expenses.",
    icon: Wallet,
    ui: SetupUI,
  },
  {
    title: "Record Transactions",
    description: "Quick deduct with debt tagging and notes",
    details: "Fast transaction entry with smart tagging features to keep your records accurate and detailed.",
    icon: ArrowRightLeft,
    ui: TransactionUI,
  },
  {
    title: "Auto-Processing",
    description: "Automatic calculation and balance updates",
    details: "Real-time balance adjustments and debt calculations happen instantly in the background.",
    icon: RefreshCw,
    ui: ProcessingUI,
  },
  {
    title: "Review & Lock",
    description: "Lock data after 30 days, review history",
    details: "Monthly data locking ensures historical accuracy and provides a stable audit trail.",
    icon: Lock,
    ui: ReviewUI,
  },
];

export const WorkflowSection = () => {
  return (
    <section className="bg-[#FFFDF5] py-24 overflow-hidden relative font-quicksand" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6 tracking-tight font-patrick">
            Simple Workflow
          </h2>
          <p className="text-xl text-[#4B5563] max-w-2xl mx-auto font-medium">
            Learn in 4 simple steps.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-[#FCD34D]/50 to-transparent" />
          
          <div className="flex flex-col gap-24 lg:gap-32">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              const Icon = feature.icon;
              
              return (
                <div key={index} className="relative group">
                  <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-0 ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                    <div className={`flex-1 w-full lg:w-1/2 px-4 lg:px-12 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-[#D97706] tracking-wider uppercase">Step 0{index + 1}</span>
                        <h3 className="text-3xl font-bold text-[#1F2937] font-patrick">{feature.title}</h3>
                        <p className="text-lg font-medium text-[#4B5563]">{feature.description}</p>
                        <p className="text-base text-[#4B5563]/80 leading-relaxed">{feature.details}</p>
                      </div>
                    </div>
                    
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-16 h-16 rounded-full bg-[#FFFDF5] border-4 border-white shadow-lg flex items-center justify-center text-[#D97706] group-hover:scale-110 transition-transform duration-300">
                        <Icon size={28} strokeWidth={2} />
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full lg:w-1/2 px-4 lg:px-12">
                      <div className={`relative bg-white rounded-2xl border border-[#1F2937]/10 shadow-lg p-2 aspect-[4/3] overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${!isEven ? 'hover:rotate-1' : 'hover:-rotate-1'}`}>
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FCD34D] to-[#F59E0B]" />
                        
                        <div className="w-full h-full bg-white rounded-xl overflow-hidden relative">
                          <feature.ui />
                        </div>

                        <div className="lg:hidden absolute top-4 right-4 bg-[#FCD34D] text-[#1F2937] text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">
                          Step 0{index + 1}
                        </div>

                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#FCD34D]/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#1F2937]/5 rounded-full blur-3xl pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
