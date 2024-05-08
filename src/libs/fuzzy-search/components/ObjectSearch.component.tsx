import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { ConnectedProps, connect } from 'react-redux';

import { compose } from 'recompose';
import Select from 'react-select';
import { Props as SelectProps } from 'react-select/lib/Select';
import isEqual from 'lodash/isEqual';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import { useObjectSearch } from '#libs/fuzzy-search/components/useObjectSearch';
import { getSearchState } from '#libs/fuzzy-search/selectors';
import {
  resetObjectSearch as resetObjectSearchAction,
  searchObjects as searchObjectsAction,
} from '#libs/fuzzy-search/actions';
import {
  ObjectSearchProps,
  SearchObjectType,
  SelectOptions,
} from '#libs/fuzzy-search/types';

import type { RootState } from '../../../reducers';
import { useHydrateSearch } from '#libs/fuzzy-search/components/useHydrateSearch';
import { SelectOption } from '#src/libs/types';

export type Props = OwnProps & ConnectedProps<typeof connector>;

type OwnProps = SelectProps<SelectOption<number>> & ObjectSearchProps;

/**
 * A generic select component used to perform fuzzySearch on a specific type of objects.
 * The component uses Select from react-select to display the search results.
 * Any prop from react-select can be passed to this component and overriden.
 * @info - It is by default uncontrolled, meaning you can invoke it right away without passing any value and start
 * performing searches.
 * - If you need to access the results and want to keep it uncontrolled for convenience, use the useSearchResults hook.
 * @properties
 * - searchedObjectType: The type of object that is being searched
 * - optionsFormatter (optional): A function that formats the search results into options
 * - additionalParams (optional): Additional query parameters that can be passed to the API to filter the search results
 * - initialValues (optional): The initial values that need to be hydrated
 *
 * The rest of the props are passed to the Select component. For initial values use the initialValues prop (not defaultValues), except if you
 * want to override the default behaviour of the component.
 *
 */

const ObjectSearch: React.FC<Props> = ({
  results,
  resultsById,
  searchObjects,
  searchedObjectType,
  resetSearch,
  additionalParams,
  initialValues,
  isLoading,
  optionsFormatter,
  ...selectorProps
}) => {
  const { formattedInitialValues, hasHydratedResults } = useHydrateSearch({
    resultsById,
    searchedObjectType,
    initialValues,
    searchObjects,
  });
  const { handleInputChange, formattedResults } = useObjectSearch({
    searchObjects,
    rawResults: results,
    searchedObjectType,
    resetSearch,
    additionalParams,
    optionsFormatter,
    hasHydratedResults,
  });

  if (!hasHydratedResults) {
    return <PlaceholderSelect {...selectorProps} />;
  }

  return (
    <Select
      defaultValue={formattedInitialValues}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filterOption={(_option, _text) => true}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      options={[...formattedResults] as SelectOptions}
      {...selectorProps}
    />
  );
};

const PlaceholderSelect: React.FC<SelectProps<SelectOption<number>>> = (
  props,
) => <Select {...props} isDisabled isLoading />;

const connector = connect(
  (
    state: RootState,
    { searchedObjectType }: { searchedObjectType: SearchObjectType },
  ) => ({
    results: getSearchState(state)[searchedObjectType].results.currentResults,
    resultsById: getSearchState(state)[searchedObjectType].results.byId,
    isLoading: getSearchState(state)[searchedObjectType].isLoading,
  }),
  {
    searchObjects: searchObjectsAction,
    resetSearch: resetObjectSearchAction,
  },
);

const ObjectSearchComponent = compose<Props, OwnProps>(
  connector,
  (component: React.FC) => React.memo(component, isEqual),
)(ObjectSearch);

export const ObjectSearchForStorybook = compose<Props, OwnProps>(
  connector,
  marketplaceCssHoc(),
  (component: React.FC) => React.memo(component, isEqual),
)(ObjectSearch);

export default ObjectSearchComponent;
