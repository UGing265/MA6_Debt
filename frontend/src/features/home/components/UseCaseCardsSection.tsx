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
    <section className="bg-[#FFFBEB] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-patrick text-3xl font-bold tracking-tight text-[#8B6914] sm:text-4xl">
            Keep cash in the right wallets
          </h2>
          <p className="font-quicksand mt-4 text-lg leading-8 text-[#9B8C4F]">
            Every wallet has a clear purpose.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="flex flex-col rounded-3xl border-2 border-[#F0D25D] bg-[#FFFEF5] p-8 transition-all hover:shadow-lg hover:border-[#E8CB50]"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFFBEB] ring-1 ring-[#F0D25D]/50">
                <useCase.icon
                  className="h-6 w-6 text-[#F0D25D]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-patrick text-xl font-semibold leading-7 text-[#8B6914]">
                {useCase.title}
              </h3>
              <p className="font-quicksand mt-4 flex-auto text-base leading-7 text-[#9B8C4F]">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
