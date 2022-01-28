import React, { useState } from 'react';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { LinearProgress, Paper, Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
// @ts-ignore
import withConfirm from '../../hocs/with-confirm.hoc';
import {
  Category,
  CategoryWithItems,
  ListItem,
} from '#components/ordering/types';

type Props = {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
  onDuplicate: (id: number) => void;
  selectedItem: number;
  itemLoading: boolean;

  selectorItemOrder: { [id: number]: number };
  filteredItems: Array<number>;

  category: CategoryWithItems;
  categoryIds: Array<number>;
  editCategory: (category: Category) => void;
  deleteCategory: (category: CategoryWithItems) => void;

  isCategoryDragging: boolean;
  isCategoryDraggable: boolean;
  orderingOverride: { [id: number]: number };

  ListItemComponent: ListItem;
  width: string | number;

  noCategoryHelper: string;
};

const ButtonWithConfirm = withConfirm(MenuItem, 'onClick', {
  title: 'ordering:category.deleteModal.title',
  cancel: 'ordering:category.deleteModal.cancel',
  confirm: 'ordering:category.deleteModal.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('ordering:category.deleteModal.content')}</p>
  ),
});

type ListProps = {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
  onDuplicate: (id: number) => void;
  selectedItem: number;

  selectorItemOrder: { [id: number]: number };
  filteredItems: Array<number>;

  category: CategoryWithItems;
  orderingOverride: { [id: number]: number };

  ListItemComponent: ListItem;
};

type ListItemProps = {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
  onDuplicate: (id: number) => void;

  selectedItem: number;
  item: any;
  sortedItems: Array<any>;

  draggable: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  ListItemComponent: ListItem;
};

const SortableListItem = React.memo((props: ListItemProps) => {
  const { item } = props;
  const classes = useListItemStyles();
  const { listeners, attributes, setNodeRef, transform, transition } =
    useSortable({
      id: item.id.toString(10),
      data: {
        category: { items: props.sortedItems },
        item,
      },
    });
  return (
    <Paper
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      elevation={2}
      className={classes.paper}
    >
      <props.ListItemComponent
        attributes={attributes}
        listeners={listeners}
        draggable={props.draggable}
        item={item}
        divider
        onEdit={props.onEdit ? () => props.onEdit(item.id) : null}
        onDelete={props.onDelete ? () => props.onDelete(item.id) : null}
        onClick={props.onClick ? () => props.onClick(item.id) : null}
        onDuplicate={
          props.onDuplicate ? () => props.onDuplicate(item.id) : null
        }
        selected={props.selectedItem === item.id}
        key={item.id}
        disabled={false}
      />
    </Paper>
  );
});

const SortableItemList = React.memo((props: ListProps) => {
  const { t } = useTranslation(['ordering']);
  const items = props.selectorItemOrder
    ? [...props.category.items].sort(
        (i1, i2) =>
          (props.selectorItemOrder[i1.id] ||
          props.selectorItemOrder[i1.id] === 0
            ? props.selectorItemOrder[i1.id]
            : i1.ordering_in_category) -
          (props.selectorItemOrder[i2.id] ||
          props.selectorItemOrder[i2.id] === 0
            ? props.selectorItemOrder[i2.id]
            : i2.ordering_in_category),
      )
    : [...props.category.items].sort(
        (i1, i2) =>
          (props.orderingOverride[i1.id] || props.orderingOverride[i1.id] === 0
            ? props.orderingOverride[i1.id]
            : i1.ordering_in_category) -
          (props.orderingOverride[i2.id] || props.orderingOverride[i2.id] === 0
            ? props.orderingOverride[i2.id]
            : i2.ordering_in_category),
      );

  const ids = items.map((e) => e.id.toString(10));

  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      {!props.filteredItems ||
      items.find((item) => props.filteredItems.includes(item.id)) ? (
        items.map((item) => {
          return (
            <SortableListItem
              draggable={!props.selectorItemOrder}
              key={item.id}
              item={item}
              onEdit={props.onEdit}
              onClick={props.onClick}
              onDelete={props.onDelete}
              onDuplicate={props.onDuplicate}
              sortedItems={items}
              ListItemComponent={props.ListItemComponent}
              selectedItem={props.selectedItem}
            />
          );
        })
      ) : (
        <Typography color="textSecondary">
          {t('category.noAvailable')}
        </Typography>
      )}
    </SortableContext>
  );
});

type SimplifiedProps = {
  category: CategoryWithItems;
  width: string | number;
};

export const PresentationalComponentCategory = React.memo(
  (props: SimplifiedProps) => {
    const { category, width } = props;
    const { t } = useTranslation(['ordering']);
    const classes = useStyles({ width });

    return (
      <div>
        <div className={classes.flex}>
          <IconButton>
            <DragHandleIcon />
          </IconButton>
          <Typography variant="h5" component="h2">
            {category
              ? `${category.name || t('category.noCategory.name')} (${
                  category.items?.length || 0
                })`
              : ''}
          </Typography>
        </div>
        <div className={classes.titleActions}>
          <IconButton aria-haspopup="true">
            <MoreVertIcon />
          </IconButton>
          <ExpandMoreIcon />
        </div>
      </div>
    );
  },
);

export const CategoryItemWithItems = React.memo((props: Props) => {
  const { category, width } = props;
  const { t } = useTranslation(['ordering']);
  const classes = useStyles({ width });
  const [anchorEl, setAnchorEl] = useState(null);

  const [expandCollapse, setExpandCollapse] = useState(true);

  const { setNodeRef, attributes, listeners, transition, transform } =
    useSortable({
      id: category.id?.toString(10) || 'null',
      data: { categoryIds: props.categoryIds },
    });

  const handlePopover = (event: any) => {
    event.stopPropagation();
    if (anchorEl === null || anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={classes.root}
    >
      <Popover
        id="category-popover"
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <List dense>
          <MenuItem
            button
            onClick={() => {
              props.editCategory(category);
              setAnchorEl(null);
            }}
          >
            <EditIcon className={classes.popoverIcon} />
            <Typography>{t('category.popover.edit')}</Typography>
          </MenuItem>
          <ButtonWithConfirm
            button
            onClick={() => {
              props.deleteCategory(category);
              setAnchorEl(null);
            }}
          >
            <DeleteIcon className={classes.popoverIcon} />
            <Typography>{t('category.popover.delete')}</Typography>
          </ButtonWithConfirm>
        </List>
      </Popover>

      <div className={classes.header}>
        <div className={classes.flex}>
          {category.id && props.isCategoryDraggable && (
            <IconButton {...listeners} {...attributes}>
              <DragHandleIcon />
            </IconButton>
          )}
          <Typography variant="h5" component="h2">
            {category
              ? `${category.name || t('category.noCategory.name')} (${
                  category.items?.length || 0
                })`
              : ''}
          </Typography>
        </div>
        <div className={classes.titleActions}>
          {category.id && (
            <IconButton
              aria-haspopup="true"
              aria-owns={anchorEl ? 'category-popover' : undefined}
              onClick={(event) => handlePopover(event)}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          {!category.id && props.noCategoryHelper && (
            <Tooltip title={props.noCategoryHelper}>
              <IconButton>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={() => setExpandCollapse(!expandCollapse)}>
            {expandCollapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
      </div>
      {props.itemLoading ? (
        <LinearProgress />
      ) : (
        <div>
          <Divider className={classes.divider} />
          {!props.isCategoryDragging && (
            <Collapse className={classes.collapse} in={expandCollapse}>
              {!!(category && category.items) &&
                (category.items.length ? (
                  <SortableItemList {...props} />
                ) : (
                  <Typography color="textSecondary">
                    {t('category.empty')}
                  </Typography>
                ))}
            </Collapse>
          )}
        </div>
      )}
    </div>
  );
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: (props: { width: string | number }) => props.width || '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(4),
  },
  titleActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  popoverIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.grey[700],
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  collapse: {
    width: '100%',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const useListItemStyles = makeStyles(() => ({
  paper: {
    width: '100%',
  },
}));

export default CategoryItemWithItems;
