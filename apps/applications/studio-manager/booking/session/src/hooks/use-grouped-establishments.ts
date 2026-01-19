import { useMemo } from "react";

import { Establishment } from "@bsport/api-core";

/**
 * Hook to group establishments by their address.
 * It returns an array of objects with the address as label and an array of MenuOptions ({ id: string; label: string }).
 */
export const useGroupedEstablishments = (
  establishments?: Establishment[] | null,
) => {
  return useMemo(() => {
    if (!establishments?.length) {
      return [];
    }

    const grouped = new Map<string, Array<{ id: string; label: string }>>();

    establishments.forEach((establishment) => {
      const address = establishment.location.address;
      const option = {
        id: establishment.id.toString(),
        label: establishment.title,
      };

      const existing = grouped.get(address);
      if (existing) {
        existing.push(option);
      } else {
        grouped.set(address, [option]);
      }
    });

    return Array.from(grouped.entries()).map(([address, options]) => ({
      title: address,
      options,
    }));
  }, [establishments]);
};
