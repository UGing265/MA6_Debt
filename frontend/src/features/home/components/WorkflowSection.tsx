import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, BarChart3, Wallet } from "lucide-react";

const ExpenseTrackerUI = () => (
  <div className="w-full h-full p-6 flex flex-col gap-4 bg-white">
    <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
          <Wallet size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700">Groceries</span>
          <span className="text-xs text-gray-400">Today, 10:30 AM</span>
        </div>
      </div>
      <span className="text-base font-bold text-red-500">-$45.00</span>
    </div>
    <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
          <ArrowRight size={20} className="rotate-45" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700">Salary</span>
          <span className="text-xs text-gray-400">Yesterday</span>
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
          <span className="text-sm font-semibold text-gray-700">Coffee</span>
          <span className="text-xs text-gray-400">Yesterday</span>
        </div>
      </div>
      <span className="text-base font-bold text-red-500">-$4.50</span>
    </div>
  </div>
);

const BudgetPlannerUI = () => (
  <div className="w-full h-full p-6 flex flex-col gap-5 bg-white">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-bold text-gray-800">Monthly Budget</span>
      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Oct 2023</span>
    </div>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-gray-600">Food & Dining</span>
          <span className="font-bold text-orange-600">75%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-orange-500 w-3/4 rounded-full shadow-sm" />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-gray-600">Transportation</span>
          <span className="font-bold text-green-600">40%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-green-500 w-2/5 rounded-full shadow-sm" />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-gray-600">Entertainment</span>
          <span className="font-bold text-red-600">90%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-red-500 w-[90%] rounded-full shadow-sm" />
        </div>
      </div>
    </div>
  </div>
);

const DebtManagerUI = () => (
  <div className="w-full h-full p-6 flex flex-col gap-4 bg-white">
    <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl border border-orange-100 shadow-sm transition-transform hover:scale-[1.02]">
      <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-sm shadow-sm">
        JD
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-gray-800">John Doe</div>
        <div className="text-xs font-medium text-orange-600">Owes you</div>
      </div>
      <div className="text-base font-bold text-green-600">+$50.00</div>
    </div>
    <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
        AS
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-gray-800">Alice Smith</div>
        <div className="text-xs font-medium text-gray-500">You owe</div>
      </div>
      <div className="text-base font-bold text-red-500">-$25.00</div>
    </div>
    <div className="flex justify-center mt-2">
      <span className="text-xs font-medium text-gray-400 hover:text-orange-500 cursor-pointer transition-colors">View all debts →</span>
    </div>
  </div>
);

const ReportsUI = () => (
  <div className="w-full h-full p-6 flex flex-col justify-end gap-4 bg-white">
    <div className="flex items-end justify-between h-40 gap-3 px-2 border-b border-gray-100 pb-2">
      <div className="w-full bg-orange-200 rounded-t-md h-[40%] hover:bg-orange-300 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$40</div>
      </div>
      <div className="w-full bg-orange-300 rounded-t-md h-[60%] hover:bg-orange-400 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$60</div>
      </div>
      <div className="w-full bg-orange-400 rounded-t-md h-[30%] hover:bg-orange-500 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$30</div>
      </div>
      <div className="w-full bg-orange-500 rounded-t-md h-[80%] hover:bg-orange-600 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$80</div>
      </div>
      <div className="w-full bg-orange-600 rounded-t-md h-[50%] hover:bg-orange-700 transition-colors relative group">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$50</div>
      </div>
    </div>
    <div className="flex justify-between text-xs font-medium text-gray-400 px-2">
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
    <section className="bg-[#F9F3EB] py-24 overflow-hidden relative" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <h2 className="font-patrick text-3xl md:text-5xl font-bold text-[#FF7A00] mb-6 tracking-tight">
            Simple Workflow
          </h2>
          <p className="font-quicksand text-xl text-[#5C4033] max-w-2xl mx-auto font-medium">
            Learn in 4 simple steps.
          </p>
        </div>

        <div className="flex flex-col gap-32 relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-[#A69080]/30 -translate-x-1/2 z-0" />

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
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 text-[#FF7A00] mb-2 lg:mb-0 shadow-sm ring-4 ring-[#F9F3EB] ${isEven ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                      <Icon size={28} />
                    </div>
                    
                    <h3 className="font-patrick text-3xl font-bold text-[#FF7A00]">
                      {feature.title}
                    </h3>
                    
                    <div className="space-y-4">
                      <p className="font-quicksand text-xl font-semibold text-[#5C4033]">
                        {feature.description}
                      </p>
                      <p className="font-quicksand text-base text-[#8D7A6B] leading-relaxed">
                        {feature.details}
                      </p>
                    </div>

                    <Button 
                      className="font-quicksand bg-[#FF7A00] hover:bg-[#E66E00] text-white rounded-full border border-[#C85A00] px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all mt-4"
                    >
                      Try Now
                    </Button>
                  </div>

                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#FF7A00] rounded-full border-4 border-[#F9F3EB] shadow-sm z-20" />

                  <div className="flex-1 w-full max-w-md lg:max-w-lg perspective-1000">
                    <div className={`relative bg-white rounded-2xl border border-[#A69080] shadow-lg p-2 aspect-[4/3] overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:-rotate-1 ${!isEven ? 'hover:rotate-1' : ''}`}>
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF7A00] to-[#FF9E40]" />
                      
                      <div className="w-full h-full bg-[#FAFAFA] rounded-xl border border-gray-100 overflow-hidden relative shadow-inner">
                        <feature.ui />
                      </div>

                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#A69080]/5 rounded-full blur-3xl pointer-events-none" />
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
