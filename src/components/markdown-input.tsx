"use client";

import { useState } from "react";

import { MarkdownViewer } from "./markdown-viewer";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface MarkdownInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export function MarkdownInput({
  value,
  onChange,
  placeholder,
  maxLength,
  className,
}: MarkdownInputProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={showPreview ? "outline" : "default"}
          size="sm"
          onClick={() => setShowPreview(false)}
        >
          Write
        </Button>
        <Button
          type="button"
          variant={showPreview ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPreview(true)}
          disabled={!value}
        >
          Preview
        </Button>
      </div>

      {showPreview ? (
        <div className="min-h-[100px] rounded-md border bg-muted/50 p-3">
          {value ? (
            <MarkdownViewer content={value} />
          ) : (
            <p className="text-muted-foreground text-sm italic">
              Nothing to preview
            </p>
          )}
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="min-h-[100px]"
        />
      )}

      <p className="text-muted-foreground text-xs">
        Supports markdown formatting: **bold**, *italic*, lists, and more
      </p>
    </div>
  );
}
