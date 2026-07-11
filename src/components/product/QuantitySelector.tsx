"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center h-12 rounded-full border-2 border-navy/10 bg-white overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-full w-12 inline-flex items-center justify-center text-navy hover:bg-coral/5 disabled:opacity-30 transition-colors"
        aria-label="Diminuer la quantité"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center font-display font-bold text-navy tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-full w-12 inline-flex items-center justify-center text-navy hover:bg-coral/5 disabled:opacity-30 transition-colors"
        aria-label="Augmenter la quantité"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
