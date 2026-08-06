"use client";

import { Wallet, PiggyBank, CreditCard } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const UseCaseCardsSection = () => {
  const { t } = useLanguage();
  const useCases = [
    {
      title: t.home.useCases.items.mainWallet.title,
      description: t.home.useCases.items.mainWallet.description,
      icon: Wallet,
    },
    {
      title: t.home.useCases.items.subWallets.title,
      description: t.home.useCases.items.subWallets.description,
      icon: PiggyBank,
    },
    {
      title: t.home.useCases.items.debtTracking.title,
      description: t.home.useCases.items.debtTracking.description,
      icon: CreditCard,
    },
  ];

  return (
    <section className="bg-[#FFFBEB] py-24 sm:py-32 font-quicksand">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] font-patrick sm:text-4xl">
            {t.home.useCases.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#4B5563]">
            {t.home.useCases.description}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="flex flex-col rounded-3xl border border-[#1F2937]/10 bg-white p-8 transition-all hover:shadow-md hover:border-[#FCD34D]/60"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#D97706]">
                <useCase.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold leading-7 text-[#1F2937] font-patrick">
                {useCase.title}
              </h3>
              <p className="mt-4 flex-auto text-base leading-7 text-[#4B5563]">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
