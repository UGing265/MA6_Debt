import React from "react";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface TransferFormActionsProps {
  isSubmitting: boolean;
  isDisabled: boolean;
  canSwap: boolean;
  onSwap: () => void;
}

export const TransferFormActions: React.FC<TransferFormActionsProps> = ({
  isSubmitting,
  isDisabled,
  canSwap,
  onSwap,
}) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Swap Button */}
      <div className="flex justify-center md:pb-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSwap}
          disabled={isDisabled || !canSwap}
          data-testid="transfer-swap"
          className="h-10 w-10 p-0 rounded-full border-note-yellow/30 hover:bg-note-yellow/20 hover:border-note-yellow"
          aria-label={t.transfer.page.swapWallets}
          title={t.transfer.page.swapWallets}
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Submit Button - rendered separately in form */}
    </>
  );
};

export const TransferSubmitButton: React.FC<{ isSubmitting: boolean; disabled: boolean }> = ({
  isSubmitting,
  disabled,
}) => {
  const { t } = useLanguage();

  return (
    <Button
      type="submit"
      data-testid="transfer-submit"
      disabled={disabled}
      className="w-full h-11 bg-gradient-to-r from-note-yellow to-amber-400 hover:from-amber-400 hover:to-note-yellow text-ink-black font-bold text-base rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t.common.updating}
        </>
      ) : (
        t.transfer.page.title
      )}
    </Button>
  );
};
