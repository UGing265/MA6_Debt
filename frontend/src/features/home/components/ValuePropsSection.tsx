import { CheckCircle, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    name: "See all your money",
    description:
      "Know every rupee in and out. Always know where your money goes.",
    icon: ShieldCheck,
  },
  {
    name: "Quick logging",
    description:
      "Record transactions in seconds. Log the moment they happen.",
    icon: Clock,
  },
  {
    name: "Clear history",
    description:
      "Keep your records fresh. Track what matters for the month ahead.",
    icon: CheckCircle,
  },
];

export const ValuePropsSection = () => {
  return (
    <div id="features" className="bg-[#FFF7ED] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#F97316]">
            Why MA6 Debt
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#7C2D12] sm:text-4xl">
            Keep your cash clear and simple
          </p>
          <p className="mt-6 text-lg leading-8 text-[#9A3412]">
            Built for speed. Built for clarity. Built for your daily money.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col rounded-3xl border border-[#FED7AA] bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-[#F97316]"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-[#7C2D12]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF7ED] ring-1 ring-[#FED7AA]/50">
                    <feature.icon
                      className="h-6 w-6 text-[#F97316]"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[#9A3412]">
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
