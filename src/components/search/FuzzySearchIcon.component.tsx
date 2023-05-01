// @ts-nocheck
import React, { useState } from 'react';
import { Theme, Collapse, makeStyles } from '@material-ui/core';
import Fuse, { FuseOptions } from 'fuse.js';

import { FixedSizeGrid } from 'react-window';
import FuzeSearch from '../FuzeSearch.component';
import { NUMBER_OF_MUI_ICONS } from '../input/muiIcon/muiIconNames';

export type OwnProps<T> = {
  items: T[];
  placeholder: string;
  searchFields: (keyof T)[];
  itemRenderer: (item: T, search?: string) => React.ReactNode;
  startWithAll: boolean;
  customClasses?: { [className: string]: string };
  iconRender?: boolean;
  numberOfColumns?: number;
  gridHeight?: number; // in pixels
  gridWidth?: number; // in pixels
};

const NUMBER_OF_COLUMNS = 5;
const WIDTH = 400;
const HEIGHT = 400;

type Props<T> = OwnProps<T>;

function FuzzySearchIcon<T>(props: Props<T>) {
  const {
    items,
    placeholder,
    searchFields,
    itemRenderer,
    startWithAll,
    customClasses,
    iconRender,
    numberOfColumns,
    gridHeight,
    gridWidth,
  } = {
    ...props,
    numberOfColumns: props.numberOfColumns ?? NUMBER_OF_COLUMNS,
    gridHeight: props.gridHeight ?? HEIGHT,
    gridWidth: props.gridWidth ?? WIDTH,
  };

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

  const Cell = ({ columnIndex, rowIndex, style }) => (
    <div style={style} className={classes.cell}>
      {itemRenderer(searchResult[columnIndex + rowIndex * numberOfColumns])}
    </div>
  );

  const CellEmptySearch = ({ columnIndex, rowIndex, style }) => (
    <div style={style} className={classes.cell}>
      <div>{itemRenderer(items[columnIndex + rowIndex * numberOfColumns])}</div>
    </div>
  );

  return (
    <div className={iconRender ? classes.wrapper : null}>
      <div className={iconRender ? classes.searchBar : null}>
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
      </div>
      <div>
        {startWithAll && search === '' ? (
          <FixedSizeGrid
            className={customClasses?.iconGrid}
            columnCount={numberOfColumns}
            columnWidth={gridWidth / numberOfColumns}
            width={gridWidth}
            height={gridHeight}
            rowCount={Math.floor(NUMBER_OF_MUI_ICONS / numberOfColumns) + 1}
            rowHeight={80}
            style={{ overflowX: 'hidden' }}
          >
            {CellEmptySearch}
          </FixedSizeGrid>
        ) : (
          <Collapse in={searchResult.length > 0 && search !== ''}>
            <FixedSizeGrid
              className={customClasses?.iconGrid}
              columnCount={numberOfColumns}
              columnWidth={gridWidth / numberOfColumns}
              width={gridWidth}
              height={gridHeight}
              rowCount={Math.floor(searchResult.length / numberOfColumns) + 1}
              rowHeight={80}
              style={{ overflowX: 'hidden' }}
            >
              {Cell}
            </FixedSizeGrid>
          </Collapse>
        )}
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  searchList: {
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  wrapper: {
    position: 'relative',
  },
  searchBar: {
    position: 'sticky',
    top: '0',
    backgroundColor: 'white',
    zIndex: 9999,
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default FuzzySearchIcon;
