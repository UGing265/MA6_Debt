import { Settings, PlusCircle, FileText, BarChart3 } from "lucide-react";

const steps = [
  {
    name: "Setup",
    description: "Create parent wallets, sub-wallets, and debt partners.",
    icon: Settings,
  },
  {
    name: "Transaction",
    description: "Log cash in or out instantly with optional partner tagging.",
    icon: PlusCircle,
  },
  {
    name: "Processing",
    description: "Auto-update sub-wallets, parent totals, and debt balances.",
    icon: FileText,
  },
  {
    name: "Review",
    description: "Search history and keep monthly discipline with data locking.",
    icon: BarChart3,
  },
];

export const WorkflowSection = () => {
  return (
    <div className="bg-[#FFF7ED] py-24 sm:py-32" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#F97316]">
            Simple Workflow
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#7C2D12] sm:text-4xl">
            How it works from day one
          </p>
          <p className="mt-6 text-lg leading-8 text-[#9A3412]">
            Follow four clear steps to keep your physical cash management consistent.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.name}
                className="flex flex-col items-center text-center rounded-3xl border border-[#FED7AA] bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-[#F97316]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF7ED] ring-1 ring-[#FED7AA]/50 text-[#F97316]">
                  <step.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-[#7C2D12]">
                  {index + 1}. {step.name}
                </dt>
                <dd className="mt-1 text-base leading-7 text-[#9A3412]">
                  {step.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
