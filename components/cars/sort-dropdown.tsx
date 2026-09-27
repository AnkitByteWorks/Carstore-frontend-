"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortDropdownProps {
  value: string;
  direction: "asc" | "desc";
  onChange: (sortBy: string, direction: "asc" | "desc") => void;
}

const SORT_OPTIONS = [
  { value: "id-asc", label: "Newest First", sortBy: "id", direction: "asc" as const },
  { value: "id-desc", label: "Oldest First", sortBy: "id", direction: "desc" as const },
  { value: "price-asc", label: "Price: Low to High", sortBy: "price", direction: "asc" as const },
  { value: "price-desc", label: "Price: High to Low", sortBy: "price", direction: "desc" as const },
  { value: "name-asc", label: "Name: A to Z", sortBy: "name", direction: "asc" as const },
  { value: "name-desc", label: "Name: Z to A", sortBy: "name", direction: "desc" as const },
];

export function SortDropdown({ value, direction, onChange }: SortDropdownProps) {
  const currentValue = `${value}-${direction}`;

  return (
    <Select
      value={currentValue}
      onValueChange={(v) => {
        const option = SORT_OPTIONS.find((o) => o.value === v);
        if (option) onChange(option.sortBy, option.direction);
      }}
    >
      <SelectTrigger className="w-[200px] bg-slate-900 border-slate-800 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-slate-800 text-white">
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
