import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { TransferFormValues } from "../types/transferForm";

interface NoteInputFieldProps {
  form: UseFormReturn<TransferFormValues>;
  disabled: boolean;
}

export const NoteInputField: React.FC<NoteInputFieldProps> = ({ form, disabled }) => {
  return (
    <FormField
      control={form.control}
      name="note"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">Note</FormLabel>
          <FormControl>
            <Input
              placeholder="Add a note for this transfer..."
              data-testid="transfer-note"
              disabled={disabled}
              className="h-10"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
