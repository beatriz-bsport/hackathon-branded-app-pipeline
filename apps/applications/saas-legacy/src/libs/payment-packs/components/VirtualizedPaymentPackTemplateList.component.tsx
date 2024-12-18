import React from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core';

import DelayedTextField from '#src/components/DelayedTextField.component';
import PaymentPackTemplateListItem from './PaymentPackTemplateListItem.component';
import { PaymentPackTemplate } from '../types';

const HEIGHT_ITEM = 80;

const Row = ({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: React.ReactChild;
}) => <div style={style}>{children}</div>;

type VirtualProps = {
  itemCount: number;
  variableItemSize: (index: number) => number;
  itemSize: number;
  minItemsDisplaid?: number;
  renderRow: (index: number) => React.ReactChild;
};

const VirtualizedVariableList: React.FC<VirtualProps> = ({
  itemCount,
  itemSize = 100,
  variableItemSize,
  minItemsDisplaid = 1,
  renderRow,
}) => (
  <div
    style={{ flex: 1, minHeight: minItemsDisplaid * itemSize, height: '100%' }}
  >
    <AutoSizer>
      {(dimensions: { height: number; width: number }) => (
        <List
          height={dimensions.height}
          itemCount={itemCount}
          itemSize={variableItemSize}
          width={dimensions.width}
        >
          {(props: { index: number; style: React.CSSProperties }) => (
            <Row key={props.index} style={props.style}>
              {renderRow(props.index)}
            </Row>
          )}
        </List>
      )}
    </AutoSizer>
  </div>
);

const PaymentPackTemplateList = (props: {
  paymentPackTemplateList: PaymentPackTemplate[];
  onClick: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const [search, doSearch] = React.useState<string>('');
  const clearSearch = () => doSearch('');

  const searchedList = search
    ? props.paymentPackTemplateList.filter((ppt) =>
        ppt.name.toLowerCase().includes(search.toLowerCase()),
      )
    : props.paymentPackTemplateList;
  const classes = useStyles();
  return (
    <>
      {/*
          We have to implement a search because :
          1. virtualized list means that the elements are not rendered thus
              we can not Ctrl+F
          2. the user will probably want to Ctrl+F because.. why we implemented
              a virtualized list ? -> list is long
        */}
      <div className={classes.searchContainer}>
        <DelayedTextField
          fullWidth
          InputProps={{
            className: classes.input,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label={search ? 'Clear search' : 'Search'}
                  onClick={clearSearch}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          onChange={(ev) => doSearch(ev.target.value)}
          value={search}
          variant="outlined"
        />
      </div>
      <VirtualizedVariableList
        itemCount={searchedList?.length || 0}
        itemSize={HEIGHT_ITEM}
        minItemsDisplaid={5}
        renderRow={(index) => {
          const ppt = searchedList[index];
          return (
            <PaymentPackTemplateListItem
              key={ppt.id}
              // @ts-expect-error
              divider
              index={index}
              onClick={props.onClick}
              onDelete={props.onDelete}
              onEdit={props.onEdit}
              paymentPackTemplate={ppt}
            />
          );
        }}
        variableItemSize={() => HEIGHT_ITEM}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    padding: theme.spacing(1),
  },
  searchIcon: {
    marginRight: theme.spacing(1),
  },
  input: {
    width: '100%',
  },
}));

export default PaymentPackTemplateList;
