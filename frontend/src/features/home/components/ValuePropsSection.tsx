"use client";

import { CheckCircle, Clock, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const ValuePropsSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      name: t.home.valueProps.items.one.name,
      description: t.home.valueProps.items.one.description,
      icon: ShieldCheck,
    },
    {
      name: t.home.valueProps.items.two.name,
      description: t.home.valueProps.items.two.description,
      icon: Clock,
    },
    {
      name: t.home.valueProps.items.three.name,
      description: t.home.valueProps.items.three.description,
      icon: CheckCircle,
    },
  ];

  return (
    <div id="features" className="bg-[#FFFDF5] py-24 sm:py-32 font-quicksand">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#D97706] font-patrick text-lg">
            {t.home.valueProps.eyebrow}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#1F2937] font-patrick sm:text-4xl">
            {t.home.valueProps.title}
          </p>
          <p className="mt-6 text-lg leading-8 text-[#4B5563]">
            {t.home.valueProps.description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col rounded-3xl border border-[#1F2937]/10 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-[#FCD34D]/60"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-[#1F2937] font-patrick text-xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706]">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[#4B5563]">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
