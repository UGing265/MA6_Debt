import { CheckCircle, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    name: "Full money visibility",
    description:
      "Track every cash inflow and outflow so you always know where your money goes.",
    icon: ShieldCheck,
  },
  {
    name: "Instant logging",
    description:
      "Record transactions in seconds at the exact moment they happen.",
    icon: Clock,
  },
  {
    name: "30-day discipline",
    description:
      "Protect data history after 30 days to keep your monthly spending accountability strong.",
    icon: CheckCircle,
  },
];

export const ValuePropsSection = () => {
  return (
    <div id="features" className="bg-[#FFFBEB] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#F0D25D]">
            Why MA6 Debt
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#8B6914] sm:text-4xl">
            A practical system for physical cash control
          </p>
          <p className="mt-6 text-lg leading-8 text-[#9B8C4F]">
            Built for speed, clarity, and consistency in daily personal finance management.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="flex flex-col rounded-3xl border border-[#E8CB50] bg-[#FFFEF5] p-8 shadow-sm transition-all hover:shadow-lg hover:border-[#F0D25D]"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-[#8B6914]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBEB] ring-1 ring-[#E8CB50]/50">
                    <feature.icon
                      className="h-6 w-6 text-[#F0D25D]"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[#9B8C4F]">
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
