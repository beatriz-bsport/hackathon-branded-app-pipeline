import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { ConnectedProps, connect } from 'react-redux';

import { compose } from 'recompose';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import MaterialUISelector, {
  MuiSelectPropsWithoutOptions,
} from '#components/Selector/MaterialUISelector.component';

import { useObjectSearch } from '#libs/fuzzy-search/components/useObjectSearch';
import { getSearchState } from '#libs/fuzzy-search/selectors';
import {
  resetObjectSearch as resetObjectSearchAction,
  searchObjects as searchObjectsAction,
} from '#libs/fuzzy-search/actions';
import { ObjectSearchProps, SearchObjectType } from '#libs/fuzzy-search/types';

import type { RootState } from '../../../reducers';

export type Props = OwnProps & ConnectedProps<typeof connector>;

type OwnProps = MuiSelectPropsWithoutOptions<any> & ObjectSearchProps;

const ObjectSearch: React.FC<Props> = ({
  results,
  searchObjects,
  searchedObjectType,
  resetSearch,
  additionalParams,
  isLoading,
  ...selectorProps
}) => {
  const {
    handleInputChange,
    formattedResults,
    searchFirstResults,
    isLoadingFirstResults,
  } = useObjectSearch({
    searchObjects,
    rawResults: results,
    searchedObjectType,
    resetSearch,
    additionalParams,
  });
  return (
    <MaterialUISelector
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filterOption={(_option, _text) => true}
      isLoading={isLoading || isLoadingFirstResults}
      onInputChange={handleInputChange}
      onMenuOpen={searchFirstResults}
      options={[...formattedResults]}
      {...selectorProps}
    />
  );
};

const connector = connect(
  (
    state: RootState,
    { searchedObjectType }: { searchedObjectType: SearchObjectType },
  ) => ({
    results: getSearchState(state)[searchedObjectType].results.currentResults,
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
