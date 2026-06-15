import { RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  /** Refetch the current page's data. Typically the controller's `refresh`. */
  onClick: () => void;
  /** True while a refetch is in flight; spins the icon and blocks re-clicks. */
  loading?: boolean;
  className?: string;
}

/**
 * Button that silently refetches the current page's data. Existing rows stay on
 * screen while the icon spins (refetch keeps cached data), so there is no loading
 * flash or skeleton.
 */
export function RefreshButton({
  onClick,
  loading,
  className,
}: RefreshButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={loading}
      aria-label="Refresh"
      title="Refresh"
      className={className}
    >
      <RefreshCwIcon className={cn(loading && "animate-spin")} />
      Refresh
    </Button>
  );
}
