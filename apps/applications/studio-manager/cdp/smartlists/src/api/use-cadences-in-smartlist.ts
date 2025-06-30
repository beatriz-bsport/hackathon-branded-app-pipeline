import { useEffect } from "react";

import { fetchCadencesInSmartlistAction } from "@bsport/store-cdp-smartlist";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export type UseCadencesInSmartlistParams = {
  smartlistId: number;
};

/**
 * Hook to fetch cadence IDs for a specific smartlist
 * @param params - Parameters containing the smartlist ID
 * @returns Object containing cadence IDs, loading state, and refetch function
 */
export function useCadencesInSmartlist(params: UseCadencesInSmartlistParams) {
  const fetchCadencesInSmartlist = async () => {
    return fetchCadencesInSmartlistAction(fetch, { id: params.smartlistId });
  };

  const [{ data: cadenceIds = [], isLoading }, fetchData] = useAsync({
    asyncFn: fetchCadencesInSmartlist,
    dependencies: [params.smartlistId],
  });

  useEffect(() => {
    if (params.smartlistId) {
      fetchData();
    }
  }, [fetchData]);

  return {
    cadenceIds,
    isLoading,
    refetch: fetchData,
  };
}
