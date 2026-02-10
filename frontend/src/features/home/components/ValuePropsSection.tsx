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
    <div id="features" className="bg-[#F2F2F2] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#C8A93C]">
            Why MA6 Debt
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A practical system for physical cash control
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Built for speed, clarity, and consistency in daily personal finance management.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg border border-[#E8CB50] bg-[#FEF9E7]">
                    <feature.icon
                      className="h-6 w-6 text-[#C8A93C]"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
