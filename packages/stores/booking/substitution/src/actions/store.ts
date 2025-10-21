import { substitutionStore } from "#src/store";
import type { SubstitutionRequest } from "#src/types";

export const setSubstitutionRequests = ({
  items,
}: {
  items: SubstitutionRequest[];
}) => {
  substitutionStore.setState((state) => {
    const byId = items.reduce(
      (acc, model) => {
        acc[model.id] = model;
        return acc;
      },
      { ...state.requests.byId },
    );

    return {
      requests: {
        byId,
        ids: items.map((request) => request.id),
      },
    };
  });
};
