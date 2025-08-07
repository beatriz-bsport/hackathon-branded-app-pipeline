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
  onSearchIconClick: (searchText?: string) => void;
};

const ListItem: React.FC<ListItemProps> = ({
  item,
  onItemClick,
  onSearchIconClick,
}) => {
  const { t } = useTranslation('quicksale');
  const classes = useStyles();

  const handleIconButtonClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    if (item.is_base_item) {
      onSearchIconClick(item.title || '');
    } else {
      onItemClick(item);
    }
  };

  const handleItemClick = () => {
    if (item.is_base_item) {
      onSearchIconClick(item.title || '');
    } else {
      onItemClick(item);
    }
  };

  return (
    <div
      className={classes.listItemContainer}
      onClick={handleItemClick}
      role="button"
      tabIndex={0}
    >
      <div className={classes.listItemInfo}>
        <Typography variant="body2">{item.title}</Typography>
        {!!item.numberOfVariants && (
          <Typography variant="caption">
            {t('objectCard.numberOfVariants', {
              count: item.numberOfVariants,
            })}
          </Typography>
        )}
      </div>
      <IconButton
        className={classes.listItemIconButton}
        onClick={handleIconButtonClick}
      >
        <CustomMuiIcon
          customClassName={classes.listItemIcon}
          icon={item.is_base_item ? 'Search' : 'AddShoppingCart'}
          variant="primary"
        />
      </IconButton>
    </div>
  );
};

type Props = {
  clearSearch: () => void;
  onItemClick: (item: QuicksaleCardInfo) => void;
  onSearchIconClick: (searchText?: string) => void;
  onSearchTextChange: (
    fuse: Fuse<QuicksaleCardInfo, FuseOptions<QuicksaleCardInfo>>,
  ) => (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  openPopper: boolean;
  searchItems: QuicksaleCardInfo[];
  searchResults: QuicksaleCardInfo[];
  searchText: string;
};

const QuicksaleInterfaceSearchBar: React.FC<Props> = ({
  clearSearch,
  onItemClick,
  onSearchIconClick,
  onSearchTextChange,
  openPopper,
  searchItems,
  searchResults,
  searchText,
}) => {
  const { t } = useTranslation('quicksale');
  const classes = useStyles();
  const searchBarRef = useRef<HTMLDivElement | null>(null);

  // Deduplicate search results based on item ID
  const deduplicatedSearchResults = React.useMemo(() => {
    const seen = new Set();
    return searchResults.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [searchResults]);

  // Handler for FuzeSearch onClickSearch (receives event)
  const handleFuzeSearchClick = useCallback(() => {
    onSearchIconClick();
  }, [onSearchIconClick]);

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
        onClickSearch={handleFuzeSearchClick}
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
          {deduplicatedSearchResults.map((result) => (
            <ListItem
              key={`search ${result.sectionId} ${result.id}`}
              item={result}
              onItemClick={onItemClick}
              onSearchIconClick={onSearchIconClick}
            />
          ))}
        </Paper>
      </Popper>
    </div>
  );
};

export default React.memo(QuicksaleInterfaceSearchBar);
