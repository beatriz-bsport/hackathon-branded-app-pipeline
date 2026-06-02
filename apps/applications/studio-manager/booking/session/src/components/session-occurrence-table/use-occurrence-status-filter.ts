import { useCallback, useRef, useState } from "react";

import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { type StatusFilter } from "./status-filter-mapping";
import { useStatusFilterConfig } from "./use-status-filter-config";

/**
 * Owns the status-filter state for an occurrence table (Series / All occurrences)
 * and returns the `status` plus the Kaizen `filterConfig` to feed the header.
 *
 * Why the `statusRef`: when Kaizen's `Filter` calls our `onFilterChange`, the
 * `status` visible to the handler's closure is observably stale — it stays at
 * its mount value (`null`) even after a status was selected (confirmed by
 * logging during a live repro). A naive `if (next === status) return` guard —
 * added to swallow Kaizen's fire-on-mount so a deep-linked page isn't reset to
 * 1 — then wrongly swallows the "clear" action too: `next=null` compares equal
 * to the stale `status=null`, so `setStatus(null)` never runs and the table
 * stays filtered. Comparing against the ref instead of the closed-over state
 * makes the guard correct regardless of closure/render timing, so real changes
 * — including clearing — always apply.
 */
export const useOccurrenceStatusFilter = (paginationNamespace: string) => {
  const { currentPageSize, setPageSettings } = usePaginationQueryParams({
    namespace: paginationNamespace,
  });

  const [status, setStatus] = useState<StatusFilter | null>(null);
  const statusRef = useRef<StatusFilter | null>(null);

  const handleStatusChange = useCallback(
    (next: StatusFilter | null) => {
      // Ignore no-op notifications (e.g. Kaizen's fire-on-mount with the empty
      // initial state) so a deep-linked page isn't reset to 1 on a cold load.
      if (next === statusRef.current) return;
      statusRef.current = next;
      setStatus(next);
      // A real change to the result set → jump back to the first page.
      setPageSettings(DEFAULT_PAGE, currentPageSize);
    },
    [setPageSettings, currentPageSize],
  );

  const filterConfig = useStatusFilterConfig(status, handleStatusChange);

  return { status, filterConfig };
};
