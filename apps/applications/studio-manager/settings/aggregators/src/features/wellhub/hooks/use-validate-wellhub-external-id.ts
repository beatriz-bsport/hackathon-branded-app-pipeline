import { useQuery } from "@tanstack/react-query";

import { validateWellhubExternalIdQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useValidateWellhubExternalId = (
  partnershipId: number,
  externalId: string,
) => {
  const enabled = externalId.length > 0;
  const { data: isValid, isFetching } = useQuery(
    validateWellhubExternalIdQueryOptions(fetch, partnershipId, externalId),
  );

  return {
    isValidating: enabled && isFetching,
    isValid: isValid ?? false,
    hasChecked: isValid !== undefined,
  };
};
