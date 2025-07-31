import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Fuse, { FuseOptions } from 'fuse.js';

import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import FuzeSearch from '#src/components/FuzeSearch.component';
import CustomMuiIcon from '#src/components/icons/CustomMuiIcon.component';
import type { QuicksaleCardInfo } from '#src/libs/quicksale/types';
import useStyles from './styles';

type ListItemProps = {
  item: QuicksaleCardInfo;
  onItemClick: (item: QuicksaleCardInfo) => void;
};

const ListItem: React.FC<ListItemProps> = ({ item, onItemClick }) => {
  const classes = useStyles();

  const handleIconButtonClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    onItemClick(item);
  };

  return (
    <div
      className={classes.listItemContainer}
      onClick={() => onItemClick(item)}
      role="button"
      tabIndex={0}
    >
      <div className={classes.listItemInfo}>
        <Typography variant="body2">{item.title}</Typography>
        <Typography variant="caption">{item.subtitle}</Typography>
      </div>
      <IconButton
        className={classes.listItemIconButton}
        onClick={handleIconButtonClick}
      >
        <CustomMuiIcon
          customClassName={classes.listItemIcon}
          icon="AddShoppingCart"
          variant="primary"
        />
      </IconButton>
    </div>
  );
};

type Props = {
  searchText: string;
  searchItems: QuicksaleCardInfo[];
  searchResults: QuicksaleCardInfo[];
  clearSearch: () => void;
  onSearchTextChange: (
    fuse: Fuse<QuicksaleCardInfo, FuseOptions<QuicksaleCardInfo>>,
  ) => (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onItemClick: (item: QuicksaleCardInfo) => void;
  onSearchIconClick: () => void;
  openPopper: boolean;
};

const QuicksaleInterfaceSearchBar: React.FC<Props> = ({
  searchText,
  searchItems,
  searchResults,
  clearSearch,
  onSearchTextChange,
  onItemClick,
  onSearchIconClick,
  openPopper,
}) => {
  const { t } = useTranslation('quicksale');
  const classes = useStyles();
  const searchBarRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') onSearchIconClick();
    },
    [onSearchIconClick],
  );

  return (
    <div
      ref={searchBarRef}
      className={classes.searchBarContainer}
      onKeyDown={handleKeyDown}
    >
      <FuzeSearch
        disableAutoFocus
        searchOnItemsChange
        adornmentPosition="end"
        changeSearch={onSearchTextChange}
        clearSearch={clearSearch}
        inputClassName={classes.textBar}
        items={searchItems}
        onClickSearch={onSearchIconClick}
        placeholder={t('interface.searchAProduct')}
        searchFields={['title']}
        searchText={searchText}
        variant="outlined"
      />
      <Popper
        anchorEl={searchBarRef.current}
        className={classes.popper}
        open={openPopper}
        placement="bottom-start"
        style={{
          width: searchBarRef.current ? searchBarRef.current.clientWidth : 0,
        }}
      >
        <Paper className={classes.resultListContainer}>
          {searchResults.map((result) => (
            <ListItem
              key={`search ${result.sectionId} ${result.id}`}
              item={result}
              onItemClick={onItemClick}
            />
          ))}
        </Paper>
      </Popper>
    </div>
  );
};

export default React.memo(QuicksaleInterfaceSearchBar);
