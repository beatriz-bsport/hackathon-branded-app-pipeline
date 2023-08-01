import React from 'react';
import { useTranslation } from 'react-i18next';
import Fuse, { FuseOptions } from 'fuse.js';

import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// @ts-expect-error
import FuzeSearch from '#components/FuzeSearch.component';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import type { QuicksaleCardInfo } from '../../types';

import useStyles from './styles';

type ListItemProps = {
  item: QuicksaleCardInfo;
  onItemClick: (item: QuicksaleCardInfo) => void;
};

const ListItem: React.FC<ListItemProps> = ({ item, onItemClick }) => {
  const onClick = React.useCallback(
    () => onItemClick(item),
    [item, onItemClick],
  );

  const stopPropagation = React.useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      ev.stopPropagation();
    },
    [],
  );

  const onIconButtonClick = React.useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.stopPropagation();
      onClick();
    },
    [onClick],
  );

  const classes = useStyles();

  return (
    <div
      className={classes.listItemContainer}
      onClick={onClick}
      onKeyDown={stopPropagation}
      role="button"
      tabIndex={0}
    >
      <div className={classes.listItemInfo}>
        <Typography variant="body2">{item.title}</Typography>
        <Typography variant="caption">{item.subtitle}</Typography>
      </div>

      <IconButton
        className={classes.listItemIconButton}
        onClick={onIconButtonClick}
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
  searchText?: string;
  clearSearch?: () => void;
  onSearchTextChange?: (
    fuse: Fuse<QuicksaleCardInfo, FuseOptions<QuicksaleCardInfo>>,
  ) => (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  searchItems?: QuicksaleCardInfo[];
  searchResults?: QuicksaleCardInfo[];
  onItemClick: (item: QuicksaleCardInfo) => void;
  onSearchIconClick?: () => void;
  openPopper?: boolean;
};

const QuicksaleInterfaceSearchBar: React.FC<Props> = ({
  searchText,
  clearSearch,
  onSearchTextChange,
  searchItems,
  searchResults,
  onItemClick,
  onSearchIconClick,
  openPopper,
}) => {
  const { t } = useTranslation('quicksale');

  const searchBarRef = React.useRef(null);

  const classes = useStyles();

  return (
    <div ref={searchBarRef} className={classes.searchBarContainer}>
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
          {searchResults.length > 0 &&
            searchResults.map((result) => (
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
