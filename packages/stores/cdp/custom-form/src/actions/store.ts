import { customFormStore } from "#src/store";
import type { CustomForm } from "#src/types";

export const updateCustomForm = (updatedCustomForm: CustomForm) => {
  customFormStore.setState((state) => {
    if (!updatedCustomForm) return state;

    const id = updatedCustomForm.id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: updatedCustomForm },
    };
  });
};

export const setCustomForms = ({
  customForms,
  count,
  page,
}: {
  customForms: CustomForm[];
  count: number;
  page: number;
}) => {
  customFormStore.setState((state) => {
    const byId = customForms.reduce((acc, customForm) => {
      acc[customForm.id] = customForm;
      return acc;
    }, state.byId);

    return {
      ids: customForms.map((customForm) => customForm.id),
      byId,
      count,
      page,
    };
  });
};
