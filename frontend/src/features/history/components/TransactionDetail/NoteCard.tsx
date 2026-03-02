import React from "react";
import { FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { stripRepayMarker } from "../../utils/historyKind";

interface NoteCardProps {
  note: string | null | undefined;
  className?: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, className = "" }) => {
  const strippedNote = stripRepayMarker(note);
  if (!strippedNote) return null;

  return (
    <Card className={`border-gray-200 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Note
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-ink-black whitespace-pre-wrap">{strippedNote}</p>
      </CardContent>
    </Card>
  );
};
