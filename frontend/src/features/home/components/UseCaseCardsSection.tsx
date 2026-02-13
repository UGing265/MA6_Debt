import { Wallet, PiggyBank, CreditCard } from "lucide-react";

const useCases = [
  {
    title: "Main Wallet",
    description: "Daily money. Regular rent. Salary.",
    icon: Wallet,
  },
  {
    title: "Sub-wallets",
    description: "Split cash by purpose: food, transport, savings, and emergency.",
    icon: PiggyBank,
  },
  {
    title: "Debt Tracking",
    description: "Know who you owe and who owes you. Track and settle easily.",
    icon: CreditCard,
  },
];

export const UseCaseCardsSection = () => {
  return (
    <section className="bg-[#F5EFE6] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#4A2C2A] sm:text-4xl">
            Keep cash in the right wallets
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#8D6E63]">
            Every wallet has a clear purpose.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="flex flex-col rounded-3xl border border-[#4A2C2A]/10 bg-white p-8 transition-all hover:shadow-md hover:border-[#FF7A00]/20"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EFE6] text-[#FF7A00]">
                <useCase.icon
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold leading-7 text-[#4A2C2A]">
                {useCase.title}
              </h3>
              <p className="mt-4 flex-auto text-base leading-7 text-[#8D6E63]">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
