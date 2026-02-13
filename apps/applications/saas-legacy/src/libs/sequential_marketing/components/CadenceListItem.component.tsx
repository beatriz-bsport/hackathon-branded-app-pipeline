import React from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import Immutable from 'seamless-immutable';
import clsx from 'clsx';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import {
  CadenceStatus,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';
import CadenceStatusChip from '#src/libs/sequential_marketing/components/CadenceStatusChip.component';
import NestedMenuSelectorIconButton from '#src/components/menu/nested';
import SecondaryActionButton from '#src/components/button/SecondaryActionButton.component';

import type { Cadence } from '#src/libs/sequential_marketing/types';

type Props = {
  cadence: Cadence;
  archived?: boolean;
  dense?: boolean;
  hasInvalidPaths: boolean;
  selected?: boolean;
  sortable?: boolean;
  withoutIndex?: boolean;
  onDelete?: (cadence: Cadence) => void;
  onDuplicate?: (cadence: Cadence) => void;
  onEdit?: (cadence: Cadence) => void;
  onOpen?: (cadence: Cadence) => void;
  onRestore?: (cadence: Cadence) => void;
  onSelect?: (cadence: Cadence) => void;
};

export const CadenceListItem: React.FC<Props> = ({
  cadence,
  archived,
  dense,
  hasInvalidPaths,
  selected,
  sortable,
  withoutIndex,
  onDelete,
  onDuplicate,
  onEdit,
  onOpen,
  onRestore,
  onSelect,
}) => {
  const classes = useListItemStyles({ archived, selected });
  const { t } = useTranslation('b2b_audience');
  const isWorkflowDuplicationEnabled = useSafeFlag(
    FeatureFlags.AUDIENCE_WORKFLOW_DUPLICATION,
  );

  const { listeners, attributes, setNodeRef, transform, transition } =
    useSortable({
      id: cadence?.id?.toString(10),
      data: {
        cadencePriorityIndex: cadence?.priority_index,
      },
    });

  const handleOpen = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onOpen?.(cadence);
    },
    [onOpen, cadence],
  );

  const handleEdit = React.useCallback(() => {
    onEdit(cadence);
  }, [onEdit, cadence]);

  const handleDelete = React.useCallback(() => {
    onDelete(cadence);
  }, [onDelete, cadence]);

  const handleDuplicate = React.useCallback(() => {
    onDuplicate?.(cadence);
  }, [onDuplicate, cadence]);

  const handleRestore = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onRestore(cadence);
    },
    [onRestore, cadence],
  );

  const handleSelect = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onSelect(cadence);
    },
    [onSelect, cadence],
  );

  const showDuplicateOption = isWorkflowDuplicationEnabled && !!onDuplicate;

  const actions = React.useMemo(
    () =>
      Immutable([
        {
          label: t('workflowList.item.menu.edit'),
          icon: 'Settings',
          onClick: handleEdit,
          customColor: SequentialMarketingColors.ACTION_BUTTON_COLOR,
        },
        {
          label: t('workflowList.item.menu.archive'),
          icon: 'Delete',
          onClick: handleDelete,
          customColor: SequentialMarketingColors.ACTION_BUTTON_COLOR,
        },
        ...(showDuplicateOption
          ? [
              {
                label: t('workflowList.item.menu.duplicate'),
                icon: 'FileCopy',
                onClick: handleDuplicate,
                customColor: SequentialMarketingColors.ACTION_BUTTON_COLOR,
              },
            ]
          : []),
      ]),
    [handleEdit, handleDelete, handleDuplicate, showDuplicateOption, t],
  );

  return (
    <div
      ref={setNodeRef}
      className={clsx(classes.fullWidth, {
        [classes.spacedItems]: !dense,
      })}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <ListItem classes={{ root: classes.listItemOutter }}>
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
          {!archived && !!cadence?.cadence_status && (
            <CadenceStatusChip status={cadence.cadence_status} />
          )}
          {hasInvalidPaths && (
            <CadenceStatusChip status={CadenceStatus.INVALID} />
          )}
          <Typography
            className={classes.textNoWrap}
            color="textSecondary"
            variant="body1"
          >
            {cadence.name}
          </Typography>
        </div>
        <div className={classes.listItemAction}>
          {!archived && onOpen && (
            <Button
              color="primary"
              onClick={handleOpen}
              size="small"
              variant="outlined"
            >
              {t('workflowList.item.buttons.open')}
            </Button>
          )}
          {!archived && onSelect && (
            <SecondaryActionButton
              onClick={handleSelect}
              size="small"
              variant="outlined"
            >
              {t('workflowList.item.buttons.viewMetrics')}
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
              {t('workflowList.item.buttons.unarchive')}
            </Button>
          )}
          {!archived && (
            <NestedMenuSelectorIconButton
              noTextWrap
              actionList={actions}
              tooltipText={t('workflowList.item.menu.tooltip')}
            />
          )}
        </div>
      </ListItem>
    </div>
  );
};

export const CadenceListItemLoading: React.FC = React.memo(() => {
  const classes = useListItemStyles({});

  return (
    <ListItem classes={{ root: classes.listItemOutter }}>
      <div className={classes.leftItem}>
        <Skeleton animation="wave" height={30} variant="circle" width={30} />
        <Skeleton animation="wave" variant="text" width={100} />
      </div>
    </ListItem>
  );
});

const useListItemStyles = makeStyles<
  Theme,
  Pick<Props, 'archived' | 'selected'>
>((theme) => ({
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
    border: ({ selected }) =>
      selected && `2px solid ${theme.palette.primary.main}`,
  },
  iconButton: { padding: 0 },
  spacedItems: {
    paddingBottom: theme.spacing(2),
  },
  listItemContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(1),
    paddingLeft: ({ archived }) => (!archived ? theme.spacing(2) : 0),
    overflow: 'hidden',
  },
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
  textNoWrap: {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': '1',
    '-webkit-box-orient': 'vertical',
  },
}));

export default React.memo(CadenceListItem);
