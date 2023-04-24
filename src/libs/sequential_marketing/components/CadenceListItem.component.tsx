// @ts-nocheck
import React from 'react';

import classNames from 'classnames';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Skeleton from '@material-ui/lab/Skeleton';
import chroma from 'chroma-js';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Typography from '@material-ui/core/Typography';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Cadence } from '#libs/sequential_marketing/types';

type Props = {
  cadence: Cadence;
  sortable?: boolean;
  onShow?: (cadence: Cadence) => void;
  onEdit?: (cadence: Cadence) => void;
  onDelete?: (cadence: Cadence) => void;
  onRestore?: (cadence: Cadence) => void;
  onClick?: (cadence: Cadence) => void;
  withoutIndex?: boolean;
  dense?: boolean;
  selectedId?: number;
};

export const CadenceListItem: React.FC<Props> = ({
  cadence,
  sortable,
  withoutIndex,
  onShow,
  onDelete,
  onEdit,
  onRestore,
  onClick,
  dense,
  selectedId,
}) => {
  const classes = useListItemStyles();
  const { listeners, attributes, setNodeRef, transform, transition } =
    useSortable({
      id: cadence.priority_index?.toString(10),
      data: {
        cadence_id: cadence.id,
      },
    });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={classNames(classes.fullWidth, {
        [classes.spacedItems]: !dense,
      })}
    >
      <ListItem>
        {sortable && (
          <div className={classes.draggableHandle}>
            <div {...attributes} {...listeners} style={{ zIndex: 999 }}>
              <DragHandleIcon />
            </div>
          </div>
        )}
        <ListItem
          button={!!onClick}
          selected={cadence?.id === selectedId}
          classes={{ root: classes.listItemOutter }}
          onClick={() => onClick && onClick(cadence)}
        >
          <div className={classes.leftItem}>
            {!withoutIndex && (
              <div className={classes.indexContainer}>
                <Typography color="primary" variant="h6">
                  {cadence.priority_index}
                </Typography>
              </div>
            )}
            <Typography variant="body1" color="textSecondary">
              {cadence.name}
            </Typography>
          </div>
          <div className={classes.listItemAction}>
            {onShow && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onShow(cadence);
                }}
              >
                <VisibilityIcon />
              </IconButton>
            )}
            {onEdit && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cadence);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cadence);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            {onRestore && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(cadence);
                }}
              >
                <RestoreFromTrashIcon />
              </IconButton>
            )}
          </div>
        </ListItem>
      </ListItem>
    </div>
  );
};

export default CadenceListItem;

const useListItemStyles = makeStyles((theme: Theme) => ({
  fullWidth: {
    width: '100%',
  },
  listItemOutter: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spacedItems: {
    paddingBottom: theme.spacing(2),
  },
  leftItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  draggableHandle: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listItemAction: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  indexContainer: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.5),
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
}));

export const CadenceListItemLoading: React.FC = () => {
  const classes = useListItemStyles();

  return (
    <ListItem classes={{ root: classes.listItemOutter }}>
      <div className={classes.leftItem}>
        <Skeleton animation="wave" width={30} variant="circle" height={30} />
        <Skeleton animation="wave" variant="text" width={100} />
      </div>
      <div className={classes.listItemAction}>
        <IconButton disabled>
          <VisibilityIcon className={classes.skeletonBackground} />
        </IconButton>
        <IconButton disabled>
          <EditIcon className={classes.skeletonBackground} />
        </IconButton>
        <IconButton disabled>
          <DeleteIcon className={classes.skeletonBackground} />
        </IconButton>
      </div>
    </ListItem>
  );
};
