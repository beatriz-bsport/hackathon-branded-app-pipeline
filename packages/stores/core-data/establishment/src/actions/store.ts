import { buildById } from "@bsport/store-base";

import { establishmentStore } from "#src/store";
import type { Establishment } from "#src/types";

export const setEstablishments = ({
  establishments,
  count,
  page,
}: {
  establishments: Establishment[];
  count: number;
  page: number;
}) => {
  establishmentStore.setState((state) => {
    if (!establishments) return state;
    const sanitizedEstablishments = establishments.filter(Boolean);

    return {
      byId: buildById({
        initial: state.byId,
        newItems: sanitizedEstablishments,
      }),
      list: {
        ids: sanitizedEstablishments.map((model) => model.id),
        count,
        page,
      },
    };
  });
};

export const setSearchedEstablishments = ({
  establishments,
  count,
  page,
}: {
  establishments: Establishment[];
  count: number;
  page: number;
}) => {
  establishmentStore.setState((state) => {
    if (!establishments) return state;
    const sanitizedEstablishments = establishments.filter(Boolean);

    return {
      byId: buildById({
        initial: state.byId,
        newItems: sanitizedEstablishments,
      }),
      search: {
        count,
        ids: sanitizedEstablishments.map((model) => model.id),
        page,
      },
    };
  });
};
