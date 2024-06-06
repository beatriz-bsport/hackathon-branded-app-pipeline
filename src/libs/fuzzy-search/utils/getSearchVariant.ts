import { SelectComponents } from 'react-select/lib/components';
import type {
  ObjectSelectOption,
  VariantType,
} from '#src/libs/fuzzy-search/types';
import { UnderlinedSearchBarControl } from '#src/libs/fuzzy-search/components/variants';

export const getSearchVariant = (
  variant: VariantType,
  components: Partial<SelectComponents<ObjectSelectOption>>,
): Partial<SelectComponents<ObjectSelectOption>> => {
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
