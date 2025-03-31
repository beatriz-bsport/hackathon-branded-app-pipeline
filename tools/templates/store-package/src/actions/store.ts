import { modelStore } from "#src/store";
import type { Model } from "#src/types";

export const updateModel = (updatedModel: Model) => {
  modelStore.setState((state) => {
    if (!updatedModel) return state;

    const id = updatedModel.id;

    if (!id) return state;

    /**
     * @indication
     * Zustand automatically merges the return state with the current state
     * Meaning we don't have to provide ...state as long as we keep a flat store
     */
    return {
      byId: { ...state.byId, [id]: updatedModel },
    };
  });
};

export const setModels = ({
  models,
  count,
  page,
}: {
  models: Model[];
  count: number;
  page: number;
}) => {
  modelStore.setState((state) => {
    const byId = models.reduce((acc, model) => {
      acc[model.id] = model;
      return acc;
    }, state.byId);

    return {
      ids: models.map((model) => model.id),
      byId,
      count,
      page,
    };
  });
};
