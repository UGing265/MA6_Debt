import React from "react";
import { Loader2, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  disabled: boolean;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ isSubmitting, disabled }) => {
  const { t } = useLanguage();

  return (
    <button
      data-testid="qd-submit"
      disabled={disabled}
      type="submit"
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-note-yellow px-6 py-3 text-sm font-semibold text-ink-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.quickDeduct.page.processing}
        </>
      ) : (
        <>
          <Zap className="h-4 w-4" />
          {t.quickDeduct.page.formSubmit}
        </>
      )}
    </button>
  );
};
