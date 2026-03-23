import React from "react";

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  error?: string;
}

export const NoteInput: React.FC<NoteInputProps> = ({ value, onChange, disabled, error }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-left text-xs font-medium text-pencil-gray">Note</label>
      <input
        disabled={disabled}
        placeholder="e.g. Lunch"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors placeholder:text-pencil-gray focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
