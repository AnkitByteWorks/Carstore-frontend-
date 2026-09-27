import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="py-20 text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-slate-900 flex items-center justify-center mb-6">
        <Search className="h-10 w-10 text-slate-700" />
      </div>
      <h3 className="font-playfair text-2xl font-bold text-white mb-2">
        No cars found
      </h3>
      <p className="text-slate-400 mb-6 max-w-sm mx-auto">
        We couldn&apos;t find any cars matching your filters. Try adjusting your
        search.
      </p>
      <Button
        onClick={onReset}
        variant="outline"
        className="border-gold text-gold hover:bg-gold hover:text-slate-950"
      >
        Clear Filters
      </Button>
    </div>
  );
}
