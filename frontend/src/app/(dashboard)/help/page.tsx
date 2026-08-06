"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Wallet, Users, Zap, ArrowLeftRight, CheckCircle2, AlertCircle, Info, BookOpen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HelpPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      <PageHeader
        title={t.dashboard.help.page.title}
        description={t.dashboard.help.page.description}
      />

      <div className="bg-white rounded-xl border border-gray-100/60 shadow-sm overflow-hidden p-6 space-y-8">

        {/* Intro */}
        <div className="bg-indigo-50 text-indigo-800 p-4 rounded-lg flex items-start gap-3 border border-indigo-100/50">
          <Info className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="text-sm leading-relaxed">
            <p className="font-semibold mb-1">{t.dashboard.help.page.welcomeTitle}</p>
            <p>{t.dashboard.help.page.welcomeBody}</p>
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
                  <h3 className="font-semibold text-ink-black text-base">{t.dashboard.help.sections.wallets.title}</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">{t.dashboard.help.sections.wallets.subtitle}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-4">
              <p>{t.dashboard.help.sections.wallets.body}</p>
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <div>{t.dashboard.help.sections.wallets.parentWallets}</div>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <div>{t.dashboard.help.sections.wallets.childWallets}</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-sm mt-3">
                <span className="font-semibold text-note-yellow">{t.dashboard.help.sections.wallets.netWorthRule}</span> {t.dashboard.help.sections.wallets.netWorthRuleBody}
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
                  <h3 className="font-semibold text-ink-black text-base">{t.dashboard.help.sections.partners.title}</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">{t.dashboard.help.sections.partners.subtitle}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-4">
              <p>{t.dashboard.help.sections.partners.body}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                  <div className="font-bold text-green-700 mb-1">{t.dashboard.help.sections.partners.positiveLabel}</div>
                  <p className="text-sm text-green-800">{t.dashboard.help.sections.partners.positiveBody}</p>
                </div>
                <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                  <div className="font-bold text-red-700 mb-1">{t.dashboard.help.sections.partners.negativeLabel}</div>
                  <p className="text-sm text-red-800">{t.dashboard.help.sections.partners.negativeBody}</p>
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
                  <h3 className="font-semibold text-ink-black text-base">{t.dashboard.help.sections.quickDeduct.title}</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">{t.dashboard.help.sections.quickDeduct.subtitle}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-4">
              <p>
                {t.dashboard.help.sections.quickDeduct.body.replace("Who Paid?", t.dashboard.help.sections.quickDeduct.whoPaid)}
              </p>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-note-yellow"></div>
                  <h4 className="font-semibold text-ink-black mb-2 flex items-center gap-2">
                    {t.dashboard.help.sections.quickDeduct.caseATitle} <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">{t.dashboard.help.sections.quickDeduct.caseASubtitle}</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>{t.dashboard.help.sections.quickDeduct.caseAItem1}</li>
                    <li>{t.dashboard.help.sections.quickDeduct.caseAItem2}</li>
                    <li>{t.dashboard.help.sections.quickDeduct.caseAItem3}</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
                  <h4 className="font-semibold text-ink-black mb-2 flex items-center gap-2">
                    {t.dashboard.help.sections.quickDeduct.caseBTitle} <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">{t.dashboard.help.sections.quickDeduct.caseBSubtitle}</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>{t.dashboard.help.sections.quickDeduct.caseBItem1}</li>
                    <li>{t.dashboard.help.sections.quickDeduct.caseBItem2}</li>
                    <li>{t.dashboard.help.sections.quickDeduct.caseBItem3}</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <h4 className="font-semibold text-sm text-ink-black mb-1">{t.dashboard.help.sections.quickDeduct.adjustmentTitle}</h4>
                <p className="text-sm">
                  {t.dashboard.help.sections.quickDeduct.adjustmentBody}
                  {t.dashboard.help.sections.quickDeduct.adjustmentBody2}
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
                  <h3 className="font-semibold text-ink-black text-base">{t.dashboard.help.sections.transfer.title}</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">{t.dashboard.help.sections.transfer.subtitle}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-3">
              <p>{t.dashboard.help.sections.transfer.body}</p>
              <div className="flex gap-2 items-start mt-2">
                <AlertCircle className="w-5 h-5 text-purple-500 shrink-0" />
                <p className="text-sm">
                  <strong>{t.dashboard.help.sections.transfer.importantRule}</strong> {t.dashboard.help.sections.transfer.importantRuleBody}
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
                  <h3 className="font-semibold text-ink-black text-base">{t.dashboard.help.sections.scenarios.title}</h3>
                  <p className="text-xs text-pencil-gray font-normal mt-0.5">{t.dashboard.help.sections.scenarios.subtitle}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-5 text-gray-600 space-y-6">

              {/* Scenario 1 */}
              <div>
                <h4 className="font-semibold text-ink-black flex items-center gap-2 mb-2">
                  <span className="bg-rose-100 text-rose-700 w-5 h-5 flex items-center justify-center rounded-full text-xs">1</span>
                  {t.dashboard.help.scenarios.one}
                </h4>
                <p className="text-sm mb-2">{t.dashboard.help.sections.scenarios.oneBody}</p>
                <div className="bg-white border text-sm border-gray-200 rounded-md p-3 space-y-1">
                  <p><strong>{t.dashboard.help.scenarios.total}:</strong> 500,000</p>
                  <p><strong>{t.dashboard.help.scenarios.wallet}:</strong> {t.dashboard.help.sections.scenarios.walletSelection}</p>
                  <p><strong>{t.dashboard.help.scenarios.partner}:</strong> John</p>
	                  <p><strong>{t.dashboard.help.scenarios.whoPaid}:</strong> {t.dashboard.help.sections.scenarios.iPay}</p>
                  <p><strong>{t.dashboard.help.scenarios.debtAmount}:</strong> 250,000</p>
                </div>
                <p className="text-sm mt-3 flex gap-1.5 items-start text-pencil-gray"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="flex-1"><strong>{t.dashboard.help.scenarios.result}:</strong> {t.dashboard.help.sections.scenarios.oneResult}</span></p>
              </div>

              {/* Scenario 2 */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-ink-black flex items-center gap-2 mb-2">
                  <span className="bg-rose-100 text-rose-700 w-5 h-5 flex items-center justify-center rounded-full text-xs">2</span>
                  {t.dashboard.help.scenarios.two}
                </h4>
                <p className="text-sm mb-2">{t.dashboard.help.sections.scenarios.twoBody}</p>
                <div className="bg-white border text-sm border-gray-200 rounded-md p-3 space-y-1">
                  <p><strong>{t.dashboard.help.scenarios.total}:</strong> 50,000</p>
                  <p><strong>{t.dashboard.help.scenarios.wallet}:</strong> {t.dashboard.help.sections.scenarios.walletSelection}</p>
                  <p><strong>{t.dashboard.help.scenarios.partner}:</strong> John</p>
	                  <p><strong>{t.dashboard.help.scenarios.whoPaid}:</strong> {t.dashboard.help.sections.scenarios.iPay}</p>
                  <p><strong>{t.dashboard.help.scenarios.debtAmount}:</strong> 50,000</p>
                </div>
                <p className="text-sm mt-3 flex gap-1.5 items-start text-pencil-gray"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="flex-1"><strong>{t.dashboard.help.scenarios.result}:</strong> {t.dashboard.help.sections.scenarios.twoResult}</span></p>
              </div>

              {/* Scenario 3 */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-ink-black flex items-center gap-2 mb-2">
                  <span className="bg-rose-100 text-rose-700 w-5 h-5 flex items-center justify-center rounded-full text-xs">3</span>
                  {t.dashboard.help.scenarios.three}
                </h4>
                <p className="text-sm mb-2">{t.dashboard.help.sections.scenarios.threeBody}</p>
                <div className="bg-white border text-sm border-gray-200 rounded-md p-3 space-y-1">
                  <p><strong>{t.dashboard.help.scenarios.total}:</strong> 100,000</p>
                  <p><strong>{t.dashboard.help.scenarios.wallet}:</strong> {t.dashboard.help.sections.scenarios.doesNotMatterWallet}</p>
                  <p><strong>{t.dashboard.help.scenarios.partner}:</strong> John</p>
	                  <p><strong>{t.dashboard.help.scenarios.whoPaid}:</strong> {t.dashboard.help.sections.scenarios.partnerPays}</p>
                  <p><strong>{t.dashboard.help.scenarios.debtAmount}:</strong> 50,000</p>
                </div>
                <p className="text-sm mt-3 flex gap-1.5 items-start text-pencil-gray"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="flex-1"><strong>{t.dashboard.help.scenarios.result}:</strong> {t.dashboard.help.sections.scenarios.threeResult}</span></p>
              </div>

              {/* Scenario 4 */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-ink-black flex items-center gap-2 mb-2">
                  <span className="bg-rose-100 text-rose-700 w-5 h-5 flex items-center justify-center rounded-full text-xs">4</span>
                  {t.dashboard.help.scenarios.four}
                </h4>
                <p className="text-sm mb-2">{t.dashboard.help.sections.scenarios.fourBody}</p>
                <div className="bg-white border text-sm border-gray-200 rounded-md p-3 space-y-1">
                  <p><strong>{t.dashboard.help.scenarios.tool}:</strong> {t.dashboard.help.sections.scenarios.goToAdjustmentTab}</p>
                  <p><strong>{t.dashboard.help.scenarios.partner}:</strong> John</p>
                  <p><strong>{t.dashboard.help.scenarios.amount}:</strong> 250,000</p>
                  <p><strong>{t.dashboard.help.scenarios.action}:</strong> {t.dashboard.help.sections.scenarios.clickAdjustDown}</p>
                </div>
                <p className="text-sm mt-3 flex gap-1.5 items-start text-pencil-gray"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="flex-1"><strong>{t.dashboard.help.scenarios.result}:</strong> {t.dashboard.help.sections.scenarios.fourResult}</span></p>
              </div>

            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </div>
  );
}
