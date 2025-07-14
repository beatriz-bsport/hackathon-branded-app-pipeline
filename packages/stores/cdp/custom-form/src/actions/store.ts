import { customFormStore } from "#src/store";
import type { CustomForm, CustomFormStatistics } from "#src/types";

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
    const filteredCustomForms = customForms.filter(
      (customForm) => customForm?.id && customForm?.name,
    );
    const newByIdEntries = filteredCustomForms.reduce(
      (acc: Record<number, CustomForm>, customForm) => {
        acc[customForm.id] = customForm;
        return acc;
      },
      {},
    );

    const mergedById = {
      ...state.customForms.byId,
      ...newByIdEntries,
    };
    const ids = filteredCustomForms.map((customForm) => customForm.id);

    return {
      ...state,
      customForms: {
        ids,
        byId: mergedById,
        count,
        page,
      },
    };
  });
};

export const setCustomFormStatistics = ({
  customFormStatistics,
  count,
  page,
}: {
  customFormStatistics: CustomFormStatistics[];
  count: number;
  page: number;
}) => {
  customFormStore.setState((state) => {
    const newByIdEntries = customFormStatistics
      .filter((_statistic) => _statistic?.id)
      .reduce((acc: Record<number, CustomFormStatistics>, statistic) => {
        acc[statistic.id] = statistic;
        return acc;
      }, {});
    const mergedById = {
      ...state.statistics.byId,
      ...newByIdEntries,
    };
    const ids = customFormStatistics.map((statistic) => statistic.id);

    return {
      statistics: {
        ids,
        byId: mergedById,
        count,
        page,
      },
    };
  });
};
