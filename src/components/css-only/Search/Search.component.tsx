import React, { useState } from 'react';
import Fuse from 'fuse.js';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { List } from '#components/css-only/Search';

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
  additionalData?: AdditionalData;
};

export type Props<AdditionalData extends BaseAdditionalData = unknown> = {
  data: SearchItemData<AdditionalData>[];
  fuseOptions?: FuseOptions;
  renderItem: React.FC<SearchItemData<AdditionalData>>;
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
}) => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const { t } = useTranslation('search');

  const changeSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const fuse = new Fuse(data, fuseOptions);

      setSearch(event.target.value);
      const result = fuse.search(event.target.value);
      setSearchResult(result);
    },
    [data, fuseOptions],
  );

  const handleClearInput = () => setSearch('');

  return (
    <div className="bs-search__container">
      <div className="bs-search__input__container">
        <button type="button" className="bs-search__input__icon">
          <SearchIcon fontSize="small" />
        </button>
        <input
          placeholder={t('input')}
          className="bs-search__input"
          value={search}
          onChange={changeSearch}
        />
        {search && (
          <button
            type="button"
            onClick={handleClearInput}
            className="bs-search__input__icon"
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
    </div>
  );
};

export default marketplaceCssHoc()(Search);
