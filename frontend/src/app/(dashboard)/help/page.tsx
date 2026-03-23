import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Wallet, Users, Zap, ArrowLeftRight, CheckCircle2, AlertCircle, Info, BookOpen } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      <PageHeader
        title="User Guide"
        description="Learn how MA6 Debt works and the logic behind your cash flows."
      />

      <div className="bg-white rounded-xl border border-gray-100/60 shadow-sm overflow-hidden p-6 space-y-8">

        {/* Intro */}
        <div className="bg-indigo-50 text-indigo-800 p-4 rounded-lg flex items-start gap-3 border border-indigo-100/50">
          <Info className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="text-sm leading-relaxed">
            <p className="font-semibold mb-1">Welcome to MA6 Debt</p>
            <p>
              This guide explains the core logic behind wallets, debt partners, and transactions.
              Understanding these will help you manage your personal finances and shared expenses perfectly.
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          {/* SECTION 1: Wallets */}
          <AccordionItem value="item-1" className="border-b-0 mb-4 bg-gray-50/50 rounded-lg px-4 border border-gray-100">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-black text-base">1. Wallet Architecture</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">Parent & Child Wallet Hierarchy</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-4">
              <p>
                The system uses a nested wallet structure to help you budget money without losing track of your actual physical accounts.
              </p>
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <div>
                    <span className="font-medium text-ink-black">Parent Wallets</span> represent your physical money sources (e.g., "Techcombank", "Cash in Pocket").
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <div>
                    <span className="font-medium text-ink-black">Child Wallets</span> are budget envelopes inside a Parent Wallet (e.g., "Grocery", "Gas").
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-sm mt-3">
                <span className="font-semibold text-note-yellow">Net Worth Rule:</span> The overall balance of a Parent Wallet shown to you is actually <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Parent Balance + Sum of all Child Balances</code>.
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SECTION 2: Debt Partners */}
          <AccordionItem value="item-2" className="border-b-0 mb-4 bg-gray-50/50 rounded-lg px-4 border border-gray-100">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-black text-base">2. Debt Partners</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">Understanding Positive & Negative Balances</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-4">
              <p>
                Partners are the people you share expenses with or loan money to. The most important metric is their <strong>Balance</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                  <div className="font-bold text-green-700 mb-1">Balance &gt; 0 (Positive)</div>
                  <p className="text-sm text-green-800">
                    This means the partner <strong>owes you money</strong>. This is your Receivable asset.
                  </p>
                </div>
                <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                  <div className="font-bold text-red-700 mb-1">Balance &lt; 0 (Negative)</div>
                  <p className="text-sm text-red-800">
                    This means <strong>you owe money</strong> to the partner. This is your Payable debt.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SECTION 3: Quick Deduct */}
          <AccordionItem value="item-3" className="border-b-0 mb-4 bg-gray-50/50 rounded-lg px-4 border border-gray-100">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-md">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-black text-base">3. Transactions (Quick Deduct)</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">The core accounting logic</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-4">
              <p>
                This is where you log expenses that involve another person. The <span className="font-semibold text-ink-black">Who Paid?</span> toggle radically changes the logic:
              </p>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-note-yellow"></div>
                  <h4 className="font-semibold text-ink-black mb-2 flex items-center gap-2">
                    Case A: "I Pay" <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">You paid the bill</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Money is immediately <strong>deducted</strong> from your selected Wallet.</li>
                    <li>The system records that the partner owes you that money.</li>
                    <li>The Partner's Balance <strong>increases</strong> (Positive).</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
                  <h4 className="font-semibold text-ink-black mb-2 flex items-center gap-2">
                    Case B: "Partner Pays" <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">They paid the bill</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Money in your Wallet stays exactly the same (no deduction).</li>
                    <li>The system records that you owe them money.</li>
                    <li>The Partner's Balance <strong>decreases</strong> (turns Negative).</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <h4 className="font-semibold text-sm text-ink-black mb-1">What is an Adjustment?</h4>
                <p className="text-sm">
                  Adjustments are tools to manually change a partner's balance without touching your wallets.
                  Use this to forgive debt, settle up outside the app, or fix mistakes.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SECTION 4: Transfer */}
          <AccordionItem value="item-4" className="border-b-0 bg-gray-50/50 rounded-lg px-4 border border-gray-100">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-md">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-black text-base">4. Internal Transfers</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">Moving money between your own wallets</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-3">
              <p>
                An internal transfer moves money from one of your wallets to another (e.g., withdrawing cash from your bank account to put in your physical wallet).
              </p>
              <div className="flex gap-2 items-start mt-2">
                <AlertCircle className="w-5 h-5 text-purple-500 shrink-0" />
                <p className="text-sm">
                  <strong>Important Rule:</strong> Internal transfers do not change your total Net Worth. They only change the location of your money. Neither debt partners nor expenses are created.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SECTION 5: Practical Scenarios */}
          <AccordionItem value="item-5" className="border-b-0 bg-gray-50/50 rounded-lg px-4 border border-gray-100 mt-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-black text-base">5. Real-World Scenarios (Practical Guide)</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">Common examples to understand the flow</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-6">

              {/* Scenario 1 */}
              <div>
                <h4 className="font-semibold text-ink-black flex items-center gap-2 mb-2">
                  <span className="bg-rose-100 text-rose-700 w-5 h-5 flex items-center justify-center rounded-full text-xs">1</span>
                  Eating out with a friend (You Paid)
                </h4>
                <p className="text-sm mb-2">You go to dinner with John. The bill is 500k. You pay the restaurant. John owes you his half (250k).</p>
                <div className="bg-white border text-sm border-gray-200 rounded-md p-3 space-y-1">
                  <p><strong>Total:</strong> 500,000</p>
                  <p><strong>Wallet:</strong> Select your spending wallet</p>
                  <p><strong>Partner:</strong> John</p>
                  <p><strong>Who Paid?:</strong> I Pay</p>
                  <p><strong>Debt Amount:</strong> 250,000</p>
                </div>
                <p className="text-sm mt-3 flex gap-1.5 items-start text-pencil-gray"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="flex-1"><strong>Result:</strong> Your wallet loses 500k. John's balance increases by +250k.</span></p>
              </div>

              {/* Scenario 2 */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-ink-black flex items-center gap-2 mb-2">
                  <span className="bg-rose-100 text-rose-700 w-5 h-5 flex items-center justify-center rounded-full text-xs">2</span>
                  Buying something for a friend
                </h4>
                <p className="text-sm mb-2">You buy a coffee for John. The coffee is 50k. He owes you all of it.</p>
                <div className="bg-white border text-sm border-gray-200 rounded-md p-3 space-y-1">
                  <p><strong>Total:</strong> 50,000</p>
                  <p><strong>Wallet:</strong> Select your spending wallet</p>
                  <p><strong>Partner:</strong> John</p>
                  <p><strong>Who Paid?:</strong> I Pay</p>
                  <p><strong>Debt Amount:</strong> 50,000</p>
                </div>
                <p className="text-sm mt-3 flex gap-1.5 items-start text-pencil-gray"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="flex-1"><strong>Result:</strong> Your wallet loses 50k. John's balance increases by +50k.</span></p>
              </div>

              {/* Scenario 3 */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-ink-black flex items-center gap-2 mb-2">
                  <span className="bg-rose-100 text-rose-700 w-5 h-5 flex items-center justify-center rounded-full text-xs">3</span>
                  Eating out (Friend Paid)
                </h4>
                <p className="text-sm mb-2">You go to a cafe with John. The bill is 100k. John pays. You owe him your half (50k).</p>
                <div className="bg-white border text-sm border-gray-200 rounded-md p-3 space-y-1">
                  <p><strong>Total:</strong> 100,000</p>
                  <p><strong>Wallet:</strong> (Does not matter, your wallet won't be charged)</p>
                  <p><strong>Partner:</strong> John</p>
                  <p><strong>Who Paid?:</strong> Partner Pays</p>
                  <p><strong>Debt Amount:</strong> 50,000</p>
                </div>
                <p className="text-sm mt-3 flex gap-1.5 items-start text-pencil-gray"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="flex-1"><strong>Result:</strong> Your wallet stays exactly the same. John's balance decreases by -50k.</span></p>
              </div>

              {/* Scenario 4 */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-ink-black flex items-center gap-2 mb-2">
                  <span className="bg-rose-100 text-rose-700 w-5 h-5 flex items-center justify-center rounded-full text-xs">4</span>
                  Settling Debt (Debt Adjustment)
                </h4>
                <p className="text-sm mb-2">John owed you 250k. He pays you back by buying you a gift, or you just want to erase his debt without logging an income transaction.</p>
                <div className="bg-white border text-sm border-gray-200 rounded-md p-3 space-y-1">
                  <p><strong>Tool:</strong> Go to the Adjustment Tab</p>
                  <p><strong>Partner:</strong> John</p>
                  <p><strong>Amount:</strong> 250,000</p>
                  <p><strong>Action:</strong> Click "Adjust Down"</p>
                </div>
                <p className="text-sm mt-3 flex gap-1.5 items-start text-pencil-gray"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="flex-1"><strong>Result:</strong> Your wallet is unchanged. John's balance decreases by 250k (back to zero).</span></p>
              </div>

            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </div>
  );
}
