import React, { FormEvent, useCallback, useState } from 'react';
import Fuse from 'fuse.js';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { useTranslation } from 'react-i18next';

import { List } from '#components/css-only/Search';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './style.css';

export type FuseOptions = {
  shouldSort: boolean;
  threshold: number;
  distance: number;
  keys: string[];
};

export type BaseAdditionalData = {
  primary?: string;
  secondary?: string;
  tertiary?: string;
  kind?: string;
  actionIcon?: React.ReactElement;
  onClick?: () => void;
  onActionClick?: () => void;
};

export type SearchItemData<AdditionalData extends BaseAdditionalData> = {
  name: string;
  id: number;
  identifier: string;
  additionalData?: AdditionalData;
};

export type Props<AdditionalData extends BaseAdditionalData = unknown> = {
  data: SearchItemData<AdditionalData>[];
  fuseOptions?: FuseOptions;
  renderItem: React.FC<SearchItemData<AdditionalData>>;
  onPressEnter?: (
    searchResult: SearchItemData<AdditionalData>[],
    inputText: string,
  ) => void;
  onClearInput: () => void;
};

const defaultFuseOptions = {
  shouldSort: true,
  threshold: 0.3,
  distance: 100,
  keys: ['name'],
};

const Search: React.FC<Props> = ({
  fuseOptions = defaultFuseOptions,
  data,
  renderItem,
  onClearInput,
  onPressEnter,
}) => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const { t } = useTranslation('search');

  const changeSearch = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const fuse = new Fuse(data, fuseOptions);

      setSearch(event.target.value);
      const result = fuse.search(event.target.value);
      setSearchResult(result);
    },
    [data, fuseOptions],
  );

  const handleClearInput = useCallback(() => {
    setSearch('');
    onClearInput && onClearInput();
  }, [onClearInput]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSearchResult(null);
      onPressEnter(searchResult, search);
    },
    [onPressEnter, search, searchResult],
  );

  return (
    <form className="bs-search__container" onSubmit={handleSubmit}>
      <div className="bs-search__input__container">
        <button className="bs-search__input__icon" type="button">
          <SearchIcon fontSize="small" />
        </button>
        <input
          className="bs-search__input"
          onChange={changeSearch}
          placeholder={t('input')}
          value={search}
        />
        {search && (
          <button
            className="bs-search__input__icon"
            onClick={handleClearInput}
            type="button"
          >
            <ClearIcon fontSize="small" />
          </button>
        )}
      </div>

      {!!searchResult && !!search && (
        <div className="bs-search__results__container">
          {!!searchResult.length && (
            <List items={searchResult} renderItem={renderItem} />
          )}

          {!searchResult.length && (
            <div className="bs-search__results__container__list__placeholder__container">
              <p className="bs-search__results__container__list__placeholder">
                {t('search:noResult')}
              </p>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export const SearchForStorybook = marketplaceCssHoc()(Search);

export default Search;
