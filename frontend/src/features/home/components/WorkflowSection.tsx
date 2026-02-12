import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, BarChart3, Wallet } from "lucide-react";

const ExpenseTrackerUI = () => (
  <div className="w-full h-full p-6 flex flex-col gap-4 bg-[#FFFEF5]">
    <div className="flex items-center justify-between border-b border-dashed border-[#F0D25D]/30 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#F0D25D] shadow-sm border border-[#F0D25D]/20">
          <Wallet size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#8B6914]">Groceries</span>
          <span className="text-xs text-[#9B8C4F]">Today, 10:30 AM</span>
        </div>
      </div>
      <span className="text-base font-bold text-red-500">-$45.00</span>
    </div>
    <div className="flex items-center justify-between border-b border-dashed border-[#F0D25D]/30 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
          <ArrowRight size={20} className="rotate-45" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#8B6914]">Salary</span>
          <span className="text-xs text-[#9B8C4F]">Yesterday</span>
        </div>
      </div>
      <span className="text-base font-bold text-green-500">+$3,200.00</span>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          <Wallet size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#8B6914]">Coffee</span>
          <span className="text-xs text-[#9B8C4F]">Yesterday</span>
        </div>
      </div>
      <span className="text-base font-bold text-red-500">-$4.50</span>
    </div>
  </div>
);

const BudgetPlannerUI = () => (
  <div className="w-full h-full p-6 flex flex-col gap-5 bg-[#FFFEF5]">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-bold text-[#8B6914]">Monthly Budget</span>
      <span className="text-xs font-medium text-[#9B8C4F] bg-[#FFFBEB] border border-[#F0D25D]/20 px-2 py-1 rounded-full">Oct 2023</span>
    </div>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-[#9B8C4F]">Food & Dining</span>
          <span className="font-bold text-[#F0D25D]">75%</span>
        </div>
        <div className="h-2.5 w-full bg-[#FFFBEB] rounded-full overflow-hidden shadow-inner border border-[#F0D25D]/10">
          <div className="h-full bg-[#F0D25D] w-3/4 rounded-full shadow-sm" />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-[#9B8C4F]">Transportation</span>
          <span className="font-bold text-green-600">40%</span>
        </div>
        <div className="h-2.5 w-full bg-[#FFFBEB] rounded-full overflow-hidden shadow-inner border border-[#F0D25D]/10">
          <div className="h-full bg-green-500 w-2/5 rounded-full shadow-sm" />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-[#9B8C4F]">Entertainment</span>
          <span className="font-bold text-red-600">90%</span>
        </div>
        <div className="h-2.5 w-full bg-[#FFFBEB] rounded-full overflow-hidden shadow-inner border border-[#F0D25D]/10">
          <div className="h-full bg-red-500 w-[90%] rounded-full shadow-sm" />
        </div>
      </div>
    </div>
  </div>
);

const DebtManagerUI = () => (
  <div className="w-full h-full p-6 flex flex-col gap-4 bg-[#FFFEF5]">
    <div className="flex items-center gap-4 p-3 bg-[#FFFBEB] rounded-xl border border-[#F0D25D] shadow-sm transition-transform hover:scale-[1.02]">
      <div className="w-10 h-10 rounded-full bg-[#F0D25D]/20 flex items-center justify-center text-[#8B6914] font-bold text-sm shadow-sm">
        JD
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-[#8B6914]">John Doe</div>
        <div className="text-xs font-medium text-[#F0D25D]">Owes you</div>
      </div>
      <div className="text-base font-bold text-green-600">+$50.00</div>
    </div>
    <div className="flex items-center gap-4 p-3 bg-[#FFFBEB] rounded-xl border border-[#F0D25D]/20 shadow-sm transition-transform hover:scale-[1.02]">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
        AS
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-[#8B6914]">Alice Smith</div>
        <div className="text-xs font-medium text-[#9B8C4F]">You owe</div>
      </div>
      <div className="text-base font-bold text-red-500">-$25.00</div>
    </div>
    <div className="flex justify-center mt-2">
      <span className="text-xs font-medium text-[#9B8C4F] hover:text-[#F0D25D] cursor-pointer transition-colors">View all debts →</span>
    </div>
  </div>
);

const ReportsUI = () => (
  <div className="w-full h-full p-6 flex flex-col justify-end gap-4 bg-[#FFFEF5]">
    <div className="flex items-end justify-between h-40 gap-3 px-2 border-b border-[#F0D25D]/20 pb-2">
      <div className="w-full bg-[#F0D25D]/40 rounded-t-md h-[40%] hover:bg-[#F0D25D]/50 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#8B6914] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$40</div>
      </div>
      <div className="w-full bg-[#F0D25D]/60 rounded-t-md h-[60%] hover:bg-[#F0D25D]/70 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#8B6914] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$60</div>
      </div>
      <div className="w-full bg-[#F0D25D]/50 rounded-t-md h-[30%] hover:bg-[#F0D25D]/60 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#8B6914] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$30</div>
      </div>
      <div className="w-full bg-[#F0D25D] rounded-t-md h-[80%] hover:bg-[#E8CB50] transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#8B6914] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$80</div>
      </div>
      <div className="w-full bg-[#F0D25D]/80 rounded-t-md h-[50%] hover:bg-[#F0D25D]/90 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#8B6914] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$50</div>
      </div>
    </div>
    <div className="flex justify-between text-xs font-medium text-[#9B8C4F] px-2">
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
    title: "Track your spending",
    description: "See where your money goes",
    details: "Log each expense in seconds. Put them into groups. Keep your wallet clean.",
    icon: Wallet,
    ui: ExpenseTrackerUI,
  },
  {
    title: "Plan your budget",
    description: "Set limits and stick to them",
    details: "Make monthly budgets for each group. Get alerts when you're close to your limit.",
    icon: Calendar,
    ui: BudgetPlannerUI,
  },
  {
    title: "Manage debt",
    description: "Track who you owe and who owes you",
    details: "Keep a clear list of all debts. Send reminders. Settle up easily.",
    icon: Users,
    ui: DebtManagerUI,
  },
  {
    title: "View reports",
    description: "Simple charts show your progress",
    details: "See your money in clear charts. Know your habits at a glance.",
    icon: BarChart3,
    ui: ReportsUI,
  },
];

export const WorkflowSection = () => {
  return (
    <section className="bg-[#FFFBEB] py-24 overflow-hidden relative" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <h2 className="font-patrick text-3xl md:text-5xl font-bold text-[#8B6914] mb-6 tracking-tight">
            Simple Workflow
          </h2>
          <p className="font-quicksand text-xl text-[#9B8C4F] max-w-2xl mx-auto font-medium">
            Learn in 4 simple steps.
          </p>
        </div>

        <div className="flex flex-col gap-32 relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-[#F0D25D]/30 -translate-x-1/2 z-0" />

          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            const Icon = feature.icon;

            return (
              <div key={index} className="relative group z-10">
                <div
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`flex-1 text-center ${isEven ? 'lg:text-right' : 'lg:text-left'} space-y-6 max-w-md`}>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FFFBEB] text-[#F0D25D] mb-2 lg:mb-0 shadow-sm ring-4 ring-[#FFFBEB] border border-[#F0D25D]/20 ${isEven ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                      <Icon size={28} />
                    </div>
                    
                    <h3 className="font-patrick text-3xl font-bold text-[#8B6914]">
                      {feature.title}
                    </h3>
                    
                    <div className="space-y-4">
                      <p className="font-quicksand text-xl font-semibold text-[#9B8C4F]">
                        {feature.description}
                      </p>
                      <p className="font-quicksand text-base text-[#9B8C4F]/80 leading-relaxed">
                        {feature.details}
                      </p>
                    </div>

                    <Button 
                      className="font-quicksand bg-[#F0D25D] hover:bg-[#E8CB50] text-white rounded-full border-2 border-[#F0D25D] px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all mt-4"
                    >
                      Try Now
                    </Button>
                  </div>

                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#F0D25D] rounded-full border-4 border-[#FFFBEB] shadow-sm z-20" />

                  <div className="flex-1 w-full max-w-md lg:max-w-lg perspective-1000">
                    <div className={`relative bg-[#FFFEF5] rounded-2xl border-2 border-[#F0D25D] shadow-lg p-2 aspect-[4/3] overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:-rotate-1 ${!isEven ? 'hover:rotate-1' : ''}`}>
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#F0D25D] to-[#E8CB50]" />
                      
                      <div className="w-full h-full bg-[#FFFEF5] rounded-xl border border-[#F0D25D]/10 overflow-hidden relative shadow-inner">
                        <feature.ui />
                      </div>

                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#F0D25D]/5 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#8B6914]/5 rounded-full blur-3xl pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
