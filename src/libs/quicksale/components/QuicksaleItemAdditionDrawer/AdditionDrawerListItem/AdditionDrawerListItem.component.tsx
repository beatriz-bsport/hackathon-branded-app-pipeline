import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Delete from '@material-ui/icons/Delete';
import { Theme, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import { QuicksaleCardInfo } from '../../../types';

export type SimpleItemListAction = {
  type: 'ADD_ITEM' | 'REMOVE_ITEM';
  payload: QuicksaleCardInfo;
};

type Props = {
  item: QuicksaleCardInfo;
  dispatch?: React.Dispatch<SimpleItemListAction>;
  checked?: boolean;
  onSelectCallback?: () => void;
  clickToSelect?: boolean;
  displayBin?: boolean;
  noDivider?: boolean;
};

const AdditionDrawerListItem: React.FC<Props> = ({
  item,
  dispatch,
  checked,
  onSelectCallback,
  clickToSelect,
  displayBin,
  noDivider,
}) => {
  const classes = useStyle({
    checkbox: checked !== undefined,
    binIcon: displayBin,
    clickableListItem: clickToSelect,
  });

  const deselectItem = React.useCallback(
    () => dispatch?.({ type: 'REMOVE_ITEM', payload: item }),
    [dispatch, item],
  );

  const stopPropagation = React.useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      ev.stopPropagation();
    },
    [],
  );

  const handleCheck = React.useCallback(() => {
    if (checked) deselectItem();
    else {
      onSelectCallback?.();
      dispatch?.({ type: 'ADD_ITEM', payload: item });
    }
  }, [checked, deselectItem, dispatch, item, onSelectCallback]);

  return (
    <div className={classes.listItemContainer}>
      <div
        className={classes.listItem}
        role="button"
        tabIndex={0}
        onKeyDown={stopPropagation}
        onClick={clickToSelect ? handleCheck : undefined}
      >
        {checked !== undefined && (
          <Checkbox
            color="primary"
            checked={checked}
            onChange={handleCheck}
            className={classes.checkbox}
          />
        )}
        <div className={classes.flexCol}>
          <Typography variant="body2">{item.title}</Typography>
          <Typography variant="caption">{item.subtitle}</Typography>
        </div>

        <div className={classNames(classes.flexCol, classes.justifySelfEnd)}>
          <Typography variant="caption">
            {`${item.price.toFixed(2)} ${getCurrencyDisplay()}`}
          </Typography>
          {item.recurrence && (
            <Typography variant="caption">{item.recurrence}</Typography>
          )}
        </div>

        {displayBin && (
          <div
            className={classNames(
              classes.deleteItemButtonContainer,
              classes.flexCol,
            )}
          >
            <IconButton onClick={deselectItem}>
              <Delete />
            </IconButton>
          </div>
        )}
      </div>
      {!noDivider && <Divider />}
    </div>
  );
};

const getGridTemplateColumns = (itemOnLeft: boolean, itemOnRight: boolean) =>
  `${itemOnLeft ? 'auto' : ''} 1fr auto ${itemOnRight ? 'auto' : ''}`;

const useStyle = makeStyles<
  Theme,
  { checkbox?: boolean; binIcon?: boolean; clickableListItem?: boolean }
>((theme) => ({
  listItem: ({ checkbox, binIcon, clickableListItem }) => ({
    display: 'grid',
    width: '100%',
    minHeight: '56px',
    gridTemplateColumns: getGridTemplateColumns(checkbox, binIcon),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    ...(clickableListItem
      ? {
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }
      : {}),
  }),
  listItemContainer: {
    width: '100%',
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  justifySelfEnd: {
    justifySelf: 'flex-end',
    textAlign: 'end',
  },
  deleteItemButtonContainer: {
    width: '48px',
    marginLeft: theme.spacing(2),
  },
  checkbox: {
    marginRight: theme.spacing(1),
    '&:hover': { backgroundColor: 'transparent' },
  },
}));

export default React.memo(AdditionDrawerListItem);
