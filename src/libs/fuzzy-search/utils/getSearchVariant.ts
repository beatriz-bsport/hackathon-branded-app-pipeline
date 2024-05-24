import { SelectComponents } from 'react-select/lib/components';
import type { SelectOptions, VariantType } from '#libs/fuzzy-search/types';
import { UnderlinedSearchBarControl } from '#libs/fuzzy-search/components/variants';

export const getSearchVariant = (
  variant: VariantType,
  components: Partial<SelectComponents<SelectOptions[number]>>,
): Partial<SelectComponents<SelectOptions[number]>> => {
  switch (variant) {
    case 'underlined':
      return {
        Control: UnderlinedSearchBarControl,
        DropdownIndicator: null,
        ...components,
      };
    default:
      return components;
  }
};
