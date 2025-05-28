import { buildById } from "@bsport/store-base";

import { sequentialMarketingStore } from "#src/store";
import type { Cadence } from "#src/types";

export const setCadences = ({
  cadences,
  count,
  page,
}: {
  cadences: Cadence[];
  count: number;
  page: number;
}) => {
  sequentialMarketingStore.setState((state) => {
    const byId = buildById({ initial: state.byId, newItems: cadences });

    return {
      ids: cadences.map((cadence) => cadence.id),
      byId,
      count,
      page,
    };
  });
};
