import { buildById } from "@bsport/store-base";

import { establishmentStore } from "#src/store";
import type { Establishment, EstablishmentGroup } from "#src/types";

export const setEstablishments = ({
  establishments,
  count,
  page,
  search,
}: {
  establishments: Establishment[];
  count: number;
  page: number;
  search?: boolean;
}) => {
  establishmentStore.setState((state) => {
    if (!establishments) return state;
    const sanitizedEstablishments = establishments.filter(Boolean);

    const newItems = buildById<Establishment>({
      initial: state.establishment.byId,
      newItems: sanitizedEstablishments,
    });
    return {
      establishment: {
        byId: newItems,
        ids: search ? [] : sanitizedEstablishments.map((model) => model.id),
        searchedIds: search
          ? sanitizedEstablishments.map((model) => model.id)
          : [],
        count,
        page,
      },
    };
  });
};

export const setEstablishmentGroups = ({
  establishmentGroups,
  count,
  page,
  search,
}: {
  establishmentGroups: EstablishmentGroup[];
  count: number;
  page: number;
  search?: boolean;
}) => {
  establishmentStore.setState((state) => {
    if (!establishmentGroups) return state;
    const sanitizedEstablishmentGroups = establishmentGroups.filter(Boolean);
    const newItems = buildById<EstablishmentGroup>({
      initial: state.establishmentGroup.byId,
      newItems: sanitizedEstablishmentGroups,
    });

    return {
      establishmentGroup: {
        byId: newItems,
        ids: search
          ? []
          : sanitizedEstablishmentGroups.map((model) => model.id),
        searchedIds: search
          ? sanitizedEstablishmentGroups.map((model) => model.id)
          : [],
        count,
        page,
      },
    };
  });
};
