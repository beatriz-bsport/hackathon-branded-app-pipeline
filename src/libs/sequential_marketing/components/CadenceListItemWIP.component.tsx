import React from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';

import makeStyles from '@material-ui/core/styles/makeStyles';
import chroma from 'chroma-js';

import IconButton from '@material-ui/core/IconButton';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Theme } from '@material-ui/core';
import Immutable from 'seamless-immutable';
import SecondaryActionButton from '#components/button/SecondaryActionButton.component';
import CadenceStatusChip from '#libs/sequential_marketing/components/CadenceStatusChip.component';
import type { Cadence } from '#libs/sequential_marketing/types';
import NestedMenuSelectorIconButton from '#components/menu/nested';
import { SequentialMarketingColors } from '../constants';

type Props = {
  cadence: Cadence;
  sortable?: boolean;
  onOpenCadenceDetails?: (cadence: Cadence) => void;
  onEdit?: (cadence: Cadence) => void;
  onDelete?: (cadence: Cadence) => void;
  onRestore?: (cadence: Cadence) => void;
  onMetricsButtonClick?: (cadence: Cadence) => void;
  withoutIndex?: boolean;
  dense?: boolean;
  selectedId?: number;
  archived?: boolean;
  status: any;
};

export const CadenceListItemWIP: React.FC<Props> = ({
  cadence,
  sortable,
  withoutIndex,
  onOpenCadenceDetails,
  onDelete,
  onEdit,
  onRestore,
  onMetricsButtonClick,
  dense,
  selectedId,
  archived,
  status,
}) => {
  const classes = useListItemStyles({ archived });
  const { t } = useTranslation('marketing');

  const { listeners, attributes, setNodeRef, transform, transition } =
    useSortable({
      id: cadence?.id?.toString(10),
      data: {
        cadencePriorityIndex: cadence?.priority_index,
      },
    });

  const handleOnMetricsButtonClick = React.useCallback(
    () => onMetricsButtonClick && onMetricsButtonClick(cadence),
    [cadence, onMetricsButtonClick],
  );

  const handleonOpenCadenceDetails = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onOpenCadenceDetails?.(cadence);
    },
    [onOpenCadenceDetails, cadence],
  );

  const handleEdit = React.useCallback(
    () => (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      event.stopPropagation();
      onEdit(cadence);
    },
    [onEdit, cadence],
  );

  const handleDelete = React.useCallback(
    () => (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      event.stopPropagation();
      onDelete(cadence);
    },
    [onDelete, cadence],
  );

  const handleRestore = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onRestore(cadence);
    },
    [onRestore, cadence],
  );

  const actions = React.useMemo(
    () =>
      Immutable([
        {
          label: t('audience.listItem.labels.edit'),
          icon: 'Settings',
          onClick: handleEdit,
          customColor: SequentialMarketingColors.ACTION_BUTTON_COLOR,
        },
        {
          label: t('audience.listItem.labels.archive'),
          icon: 'Delete',
          onClick: handleDelete,
          customColor: SequentialMarketingColors.ACTION_BUTTON_COLOR,
        },
      ]),
    [handleEdit, handleDelete, t],
  );

  return (
    <div
      ref={setNodeRef}
      className={classNames(classes.fullWidth, {
        [classes.spacedItems]: !dense,
      })}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <ListItem
        classes={{ root: classes.listItemOutter }}
        selected={cadence?.id === selectedId}
      >
        {!archived && sortable && (
          <IconButton
            className={classes.iconButton}
            {...listeners}
            {...attributes}
            style={{ zIndex: 999 }}
          >
            <DragIndicatorIcon />
          </IconButton>
        )}
        <div className={classes.listItemContent}>
          {!archived && !withoutIndex && (
            <Typography
              className={classes.indexContainer}
              color="primary"
              variant="h6"
            >
              {cadence.priority_index}
            </Typography>
          )}
          {!archived && !!status && <CadenceStatusChip status={status} />}
          <Typography noWrap color="textSecondary" variant="body1">
            {cadence.name}
          </Typography>
        </div>
        <div className={classes.listItemAction}>
          {!archived && onOpenCadenceDetails && (
            <Button
              color="primary"
              onClick={handleonOpenCadenceDetails}
              size="small"
              variant="outlined"
            >
              {t('audience.listItem.labels.open')}
            </Button>
          )}
          {!archived && onMetricsButtonClick && (
            <SecondaryActionButton
              onClick={handleOnMetricsButtonClick}
              size="small"
              variant="outlined"
            >
              {t('audience.listItem.labels.metrics')}
            </SecondaryActionButton>
          )}
          {archived && onRestore && (
            <Button
              color="primary"
              onClick={handleRestore}
              size="small"
              startIcon={<RestoreFromTrashIcon />}
              variant="outlined"
            >
              {t('audience.listItem.labels.unarchive')}
            </Button>
          )}
          {!archived && (
            <Tooltip title={t('audience.listItem.tooltip.moreActions')}>
              <NestedMenuSelectorIconButton noTextWrap actionList={actions} />
            </Tooltip>
          )}
        </div>
      </ListItem>
    </div>
  );
};

const useListItemStyles = makeStyles<Theme, Pick<Props, 'archived'>>(
  (theme) => ({
    fullWidth: {
      width: '100%',
    },
    listItemOutter: {
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2),
      border: `1px solid #E6E6E6`,
    },
    iconButton: { padding: 0 },
    spacedItems: {
      paddingBottom: theme.spacing(2),
    },
    listItemContent: ({ archived }) => ({
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing(1),
      paddingLeft: !archived ? theme.spacing(2) : 0,
      overflow: 'hidden',
    }),
    listItemAction: {
      display: 'flex',
      justifyContent: 'flex-end',
      flex: 1,
      gap: theme.spacing(1),
      alignItems: 'center',
      paddingLeft: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    indexContainer: {
      borderRadius: theme.spacing(1),
      textAlign: 'center',
      verticalAlign: 'middle',
      width: theme.spacing(4),
      // the minWidth is here in case workflow's name is too large : it prevents the indexContainer's width from reducing
      minWidth: theme.spacing(4),
      height: theme.spacing(4),
      backgroundColor: chroma(theme.palette.primary.main).alpha(0.09).hex(),
    },
    skeletonBackground: {
      animationName: `$customPulse`,
      animationDuration: '1s',
      animationIterationCount: 'infinite',
    },
    '@keyframes customPulse': {
      '0%': {
        color: 'rgba(0, 0, 0, 0.11)',
      },
      '50%': {
        color: 'rgba(0, 0, 0, 0.26)',
      },
      '100%': {
        color: 'rgba(0, 0, 0, 0.11)',
      },
    },
  }),
);

export default React.memo(CadenceListItemWIP);
