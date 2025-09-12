import { buildById } from "@bsport/store-base";

import { privateServiceStore } from "#src/store";
import type { PrivateService } from "#src/types";

export const setPrivateServices = ({
  privateServices,
  count,
  page,
}: {
  privateServices: PrivateService[];
  count: number;
  page: number;
}) => {
  privateServiceStore.setState((state) => {
    if (!privateServices) return state;
    const sanitizedPrivateServices = privateServices.filter(Boolean);

    return {
      byId: buildById({
        initial: state.byId,
        newItems: sanitizedPrivateServices,
      }),
      ids: sanitizedPrivateServices.map((model) => model.id),
      count,
      page,
    };
  });
};

export const setSearchedPrivateServices = ({
  privateServices,
}: {
  privateServices: PrivateService[];
}) => {
  privateServiceStore.setState((state) => {
    if (!privateServices) return state;
    const sanitizedPrivateServices = privateServices.filter(Boolean);

    return {
      byId: buildById({
        initial: state.byId,
        newItems: sanitizedPrivateServices,
      }),
      searchedResults: buildById({
        initial: {},
        newItems: sanitizedPrivateServices,
      }),
    };
  });
};
