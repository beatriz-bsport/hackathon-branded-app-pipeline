import type { SelectOption } from '#src/libs/types';
import type { SelectOptions } from '#src/libs/fuzzy-search/types';

export const flattenOptions = (
  options: SelectOptions,
): SelectOption<number>[] => {
  return options.flatMap((option) => {
    if ('options' in option) {
      return flattenOptions(option.options);
    }
    return option;
  });
};
