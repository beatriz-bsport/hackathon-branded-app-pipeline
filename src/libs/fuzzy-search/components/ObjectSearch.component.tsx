import React from 'react';

import { compose } from 'recompose';
import Select from 'react-select';
import { Props as SelectProps } from 'react-select/lib/Select';
import isEqual from 'lodash/isEqual';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import { useFetchOptions } from '#src/libs/fuzzy-search/hooks/useFetchOptions';
import type {
  ObjectSearchProps,
  ObjectSelectOption,
} from '#src/libs/fuzzy-search/types';

import { useHydrateSearch } from '#src/libs/fuzzy-search/hooks/useHydrateSearch';
import type { SelectOption } from '#src/libs/types';
import { DEFAULT_SELECTOR_ID } from '../constants';
import { getSearchVariant } from '#src/libs/fuzzy-search/utils/getSearchVariant';

export type Props = OwnProps;

type OwnProps = SelectProps<SelectOption<number>> & ObjectSearchProps;

/**
 * A generic select component used to perform fuzzySearch on a specific type of objects.
 * The component uses Select from react-select to display the search results.
 * Any prop from react-select can be passed to this component and overriden.
 * @info - It is by default uncontrolled, meaning you can invoke it right away without passing any value and start
 * performing searches.
 * - If you need to access the results and want to keep it uncontrolled for convenience, use the **useObjectSearch** hook.
 * In case you are using a class component, you can use the **withObjectSearch** HOC.
 * @properties
 * - searchedObjectType: The type of object that is being searched
 * - optionsFormatter (optional): A function that formats the search results into options
 * - additionalParams (optional): Additional query parameters that can be passed to the API to filter the search results
 * - initialValues (optional): The initial values that need to be hydrated
 * - selectorId (optional): The id of the selector, used to differentiate between multiple selectors of the same type on the same page
 * - variant : variant of ObjectSearch

 * The rest of the props are passed to the Select component. For initial values use the initialValues prop (not defaultValues), except if you
 * want to override the default behaviour of the component.
 * 
 * @warning Do not use `getOptionLabel` and `getOptionValue` props from react-select, instead use the `optionsFormatter` prop.
 *
 */

const ObjectSearch: React.FC<Props> = ({
  searchedObjectType,
  additionalParams,
  initialValues,
  optionsFormatter,
  selectorId = DEFAULT_SELECTOR_ID,
  variant = 'default',
  objectId,
  ...selectorProps
}) => {
  const { formattedInitialValues, hasHydratedResults } = useHydrateSearch({
    searchedObjectType,
    valuesToHydrate: initialValues,
    selectorId,
    objectId,
  });
  const { handleInputChange, formattedResults, isLoading } = useFetchOptions({
    searchedObjectType,
    additionalParams,
    optionsFormatter,
    hasHydratedResults,
    selectorId,
    objectId,
  });
  const { components, ...otherSelectProps } = { ...selectorProps };
  const componentsVariant = getSearchVariant(variant, components);

  if (!hasHydratedResults) {
    return <PlaceholderSelect {...selectorProps} />;
  }

  return (
    <Select<ObjectSelectOption>
      components={componentsVariant}
      defaultValue={formattedInitialValues}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filterOption={(_option, _text) => true}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      options={formattedResults}
      {...otherSelectProps}
    />
  );
};

const PlaceholderSelect: React.FC<SelectProps<SelectOption<number>>> = (
  props,
) => <Select {...props} isDisabled isLoading />;

const ObjectSearchComponent = React.memo(ObjectSearch, isEqual);

export const ObjectSearchForStorybook = compose<Props, OwnProps>(
  marketplaceCssHoc(),
  (component: React.FC) => React.memo(component, isEqual),
)(ObjectSearch);

export default ObjectSearchComponent;
