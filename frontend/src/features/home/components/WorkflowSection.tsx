"use client";

import React from "react";
import { Wallet, ArrowRightLeft, RefreshCw, Lock } from "lucide-react";
import { SetupUI, TransactionUI, ProcessingUI, ReviewUI } from "./workflow-mocks";
import { useLanguage } from "@/context/LanguageContext";

type WorkflowFeature = {
  title: string;
  description: string;
  details: string;
  icon: typeof Wallet;
  ui: React.ComponentType<{ labels?: unknown }>;
};

export const WorkflowSection = () => {
  const { t } = useLanguage();

  const features: WorkflowFeature[] = [
    {
      title: t.home.workflow.steps.one.title,
      description: t.home.workflow.steps.one.description,
      details: t.home.workflow.steps.one.details,
      icon: Wallet,
      ui: SetupUI,
    },
    {
      title: t.home.workflow.steps.two.title,
      description: t.home.workflow.steps.two.description,
      details: t.home.workflow.steps.two.details,
      icon: ArrowRightLeft,
      ui: TransactionUI,
    },
    {
      title: t.home.workflow.steps.three.title,
      description: t.home.workflow.steps.three.description,
      details: t.home.workflow.steps.three.details,
      icon: RefreshCw,
      ui: ProcessingUI,
    },
    {
      title: t.home.workflow.steps.four.title,
      description: t.home.workflow.steps.four.description,
      details: t.home.workflow.steps.four.details,
      icon: Lock,
      ui: ReviewUI,
    },
  ];

  return (
    <section className="bg-[#FFFDF5] py-24 overflow-hidden relative font-quicksand" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6 tracking-tight font-patrick">
            {t.home.workflow.title}
          </h2>
          <p className="text-xl text-[#4B5563] max-w-2xl mx-auto font-medium">
            {t.home.workflow.description}
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-[#FCD34D]/50 to-transparent" />
          
          <div className="flex flex-col gap-24 lg:gap-32">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              const Icon = feature.icon;
              const stepLabel = t.home.workflow.stepLabel.replace(
                "{number}",
                String(index + 1).padStart(2, "0")
              );

              return (
                <div key={index} className="relative group">
                  <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-0 ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                    <div className={`flex-1 w-full lg:w-1/2 px-4 lg:px-12 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-[#D97706] tracking-wider uppercase">{stepLabel}</span>
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
                          {stepLabel}
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
