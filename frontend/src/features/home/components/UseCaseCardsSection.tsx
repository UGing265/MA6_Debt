import { Wallet, PiggyBank, CreditCard } from "lucide-react";

const useCases = [
  {
    title: "Main Wallet",
    description: "Manage your daily cash flow, core expenses, and regular income.",
    icon: Wallet,
  },
  {
    title: "Sub-wallets",
    description: "Split cash by purpose: food, transport, savings, and emergency funds.",
    icon: PiggyBank,
  },
  {
    title: "Debt Tracking",
    description: "Track receivables and payables with partner tagging and real-time updates.",
    icon: CreditCard,
  },
];

export const UseCaseCardsSection = () => {
  return (
    <section className="bg-[#F2EEDB] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Organize your cash by real-life usage
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Keep every amount in the right wallet with clear purpose and ownership.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="flex flex-col rounded-2xl border border-[#E8CB50] bg-white p-8 transition-all hover:shadow-md"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-[#E8CB50] bg-[#FEF9E7]">
                <useCase.icon
                  className="h-6 w-6 text-[#C8A93C]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold leading-7 text-gray-900">
                {useCase.title}
              </h3>
              <p className="mt-4 flex-auto text-base leading-7 text-gray-600">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
