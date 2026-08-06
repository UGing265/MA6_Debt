import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { TransferFormValues } from "../types/transferForm";
import { useLanguage } from "@/context/LanguageContext";

interface NoteInputFieldProps {
  form: UseFormReturn<TransferFormValues>;
  disabled: boolean;
}

export const NoteInputField: React.FC<NoteInputFieldProps> = ({ form, disabled }) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="note"
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="block text-left text-xs font-semibold text-ink-black">{t.transfer.page.note}</FormLabel>
          <FormControl>
            <input
            placeholder={t.transfer.page.notePlaceholder}
              data-testid="transfer-note"
              disabled={disabled}
              value={field.value ?? ""}
              onChange={field.onChange}
              className="h-11 w-full rounded-xl border border-gray-200 hover:border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-ink-black outline-none transition-all placeholder:text-pencil-gray/70 focus:border-amber-400 focus:ring-2 focus:ring-note-yellow/30 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
