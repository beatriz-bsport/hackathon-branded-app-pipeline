import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { ConnectedProps, connect } from 'react-redux';

import { compose } from 'recompose';
import Select from 'react-select';
import { Props as SelectProps } from 'react-select/lib/Select';
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
      menuPortalTarget={document.querySelector('body')}
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
  React.memo,
)(ObjectSearch);

export const ObjectSearchForStorybook = compose<Props, OwnProps>(
  connector,
  marketplaceCssHoc(),
  React.memo,
)(ObjectSearch);

export default ObjectSearchComponent;
