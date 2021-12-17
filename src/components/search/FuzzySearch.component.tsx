// @flow
import React, { useState } from 'react';
import { Theme, Paper, Collapse, List, makeStyles } from '@material-ui/core';
import Fuse, { FuseOptions } from 'fuse.js';

import FuzeSearch from '../FuzeSearch.component';

export type OwnProps<T> = {
  items: T[];
  placeholder: string;
  className?: string;
  searchFields: (keyof T)[];
  itemRenderer: (item: T, search?: string) => React.ReactNode;
};

type Props<T> = OwnProps<T>;

function FuzzySearch<T>(props: Props<T>) {
  const { items, placeholder, searchFields, className, itemRenderer } = props;

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<T[]>([]);

  const classes = useStyles();

  const changeSearch =
    (fuse: Fuse<T, FuseOptions<T>>) =>
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setSearch(ev.target.value);
      const result = fuse.search(ev.target.value) as T[];
      setSearchResult(result);
    };

  return (
    <div className={className}>
      <FuzeSearch
        searchText={search}
        clearSearch={() => {
          setSearch('');
        }}
        changeSearch={changeSearch}
        items={items}
        placeholder={placeholder}
        searchFields={searchFields}
      />
      <Paper
        className={
          searchResult.length > 0 && search !== ''
            ? classes.searchPaperDisplayed
            : ''
        }
      >
        <Collapse in={searchResult.length > 0 && search !== ''}>
          <List component="nav" disablePadding>
            {searchResult.map((item) => itemRenderer(item, search))}
          </List>
        </Collapse>
      </Paper>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderTop: '0px',
  },
}));

export default FuzzySearch;
