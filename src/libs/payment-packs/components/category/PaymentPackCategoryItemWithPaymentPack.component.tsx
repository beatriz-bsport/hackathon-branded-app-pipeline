import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import { TFunction } from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Divider from '@material-ui/core/Divider';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from '@material-ui/core/MenuItem';
import HelpIcon from '@material-ui/icons/Help';
import { Paper, Tooltip } from '@material-ui/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import PaymentPackListItem from '../PaymentPackListItem.component';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackCategoryWithPacks,
} from '../../types';
import { MaterialStyleType } from '../../../../utils/types';
import withConfirm from '../../../../hocs/with-confirm.hoc';
import { ManagerOnly } from '../PaymentPackFilterAndSortHeader.component';

type OwnProps = {
  onEdit: (pp: PaymentPack) => void;
  onDelete: (pp: PaymentPack) => void;
  onClick: (ppId: number) => void;
  onRestore: (ppId: number) => void;
  paymentPackCategory: PaymentPackCategoryWithPacks;
  setSelectedCategory?: (category: PaymentPackCategory) => void;
  showCategoryEditDialog?: () => void;
  deletePaymentPackCategory?: (category: PaymentPackCategory) => void;
  isCategoryDragging: boolean;
  orderingOverride: any;
  filterManagerOnly: ManagerOnly;
  paymentPackOrder: any;
  isCategoryFiltered: boolean;
  paymentPackCategoryIds: Array<number>;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const ButtonWithConfirm = withConfirm(MenuItem, 'onClick', {
  title: 'paymentPack:category.deleteModal.title',
  cancel: 'paymentPack:category.deleteModal.cancel',
  confirm: 'paymentPack:category.deleteModal.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('paymentPack:category.deleteModal.content')}</p>
  ),
});

type PackListProps = MaterialStyleType<ReturnType<typeof styles>> & {
  onEdit: (pp: PaymentPack) => void;
  onDelete: (pp: PaymentPack) => void;
  onClick: (ppId: number) => void;
  onRestore: (ppId: number) => void;
  paymentPackCategory: PaymentPackCategoryWithPacks;
  orderingOverride?: any;
  filterManagerOnly: ManagerOnly;
  empty: string;
  paymentPackOrder: any;
};

type PackListItemProps = MaterialStyleType<ReturnType<typeof styles>> & {
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
  onRestore: () => void;
  pack: PaymentPack;
  sortedItems: Array<PaymentPack>;
  draggable: boolean;
};

const SortablePaymentPackListItem = React.memo((props: PackListItemProps) => {
  const { pack } = props;
  const { listeners, attributes, setNodeRef, transform, transition } =
    useSortable({
      id: props.pack.id.toString(10),
      data: {
        category: { packs: props.sortedItems },
        pack,
      },
    });
  return (
    <Paper
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      elevation={2}
      className={props.classes.paper}
    >
      <PaymentPackListItem
        attributes={attributes}
        listeners={listeners}
        draggable={props.draggable}
        pack={pack}
        divider
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onClick={props.onClick}
        onRestore={props.onRestore}
        key={pack.id}
        disabled={false}
      />
    </Paper>
  );
});

const SortablePaymentPackList = React.memo((props: PackListProps) => {
  const packs = props.paymentPackOrder
    ? [...props.paymentPackCategory.packs].sort(
        (p1, p2) =>
          (props.paymentPackOrder[p1.id] || props.paymentPackOrder[p1.id] === 0
            ? props.paymentPackOrder[p1.id]
            : p1.ordering_in_category) -
          (props.paymentPackOrder[p2.id] || props.paymentPackOrder[p2.id] === 0
            ? props.paymentPackOrder[p2.id]
            : p2.ordering_in_category),
      )
    : [...props.paymentPackCategory.packs].sort(
        (p1, p2) =>
          (props.orderingOverride[p1.id] || props.orderingOverride[p1.id] === 0
            ? props.orderingOverride[p1.id]
            : p1.ordering_in_category) -
          (props.orderingOverride[p2.id] || props.orderingOverride[p2.id] === 0
            ? props.orderingOverride[p2.id]
            : p2.ordering_in_category),
      );

  const items = packs.map((e) => e.id.toString(10));

  const showManagerOnly =
    props.filterManagerOnly === ManagerOnly.showManagerOnly &&
    packs.filter((pp) => pp.manager_only).length;

  const showManagerExclude =
    props.filterManagerOnly === ManagerOnly.showManagerExclude &&
    packs.filter((pp) => !pp.manager_only).length;

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {props.filterManagerOnly === ManagerOnly.showAll ||
      showManagerOnly ||
      showManagerExclude ? (
        packs.map((pack: PaymentPack) => {
          return props.filterManagerOnly === ManagerOnly.showAll ||
            (props.filterManagerOnly === ManagerOnly.showManagerOnly &&
              pack.manager_only) ||
            (props.filterManagerOnly === ManagerOnly.showManagerExclude &&
              !pack.manager_only) ? (
            <SortablePaymentPackListItem
              draggable={
                !props.paymentPackOrder &&
                props.filterManagerOnly === ManagerOnly.showAll
              }
              key={pack.id}
              pack={pack}
              onEdit={props.onEdit ? () => props.onEdit(pack) : null}
              onClick={
                !pack.disabled && props.onClick
                  ? () => props.onClick(pack.id)
                  : null
              }
              onDelete={props.onDelete ? () => props.onDelete(pack) : null}
              onRestore={
                props.onRestore ? () => props.onRestore(pack.id) : null
              }
              classes={props.classes}
              sortedItems={packs}
            />
          ) : null;
        })
      ) : (
        <Typography color="textSecondary">{props.empty}</Typography>
      )}
    </SortableContext>
  );
});

type SimplifiedCategoryProps = {
  paymentPackCategory: PaymentPackCategoryWithPacks;
};

type SimplifiedProps = SimplifiedCategoryProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const PresentationalComponentPaymentPackCategory = React.memo(
  (props: SimplifiedProps) => {
    const { t, classes, paymentPackCategory } = props;

    return (
      <div>
        <div className={classes.flex}>
          <IconButton>
            <DragHandleIcon />
          </IconButton>
          <Typography variant="h5" component="h2">
            {paymentPackCategory
              ? `${paymentPackCategory.name || t('noCategory.name')} (${
                  paymentPackCategory.packs?.length || 0
                })`
              : ''}
          </Typography>
        </div>
        <div className={classes.titleActions}>
          {paymentPackCategory.id !== -1 ? (
            <IconButton aria-haspopup="true">
              <MoreVertIcon />
            </IconButton>
          ) : (
            <Tooltip title={t('noCategory.help')}>
              <IconButton>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          )}
          <ExpandMoreIcon />
        </div>
      </div>
    );
  },
);

export const PaymentPackCategoryItemWithPaymentPack = React.memo(
  (props: Props) => {
    const { t, classes, paymentPackCategory } = props;
    const [anchorEl, setAnchorEl] = useState(null);

    const [expandCollapse, setExpandCollapse] = useState(true);

    const { setNodeRef, attributes, listeners, transition, transform } =
      useSortable({
        id: paymentPackCategory.id?.toString(10) || 'null',
        data: { categoryIds: props.paymentPackCategoryIds },
      });

    const handlePopover = (event: any, ppCategory: PaymentPackCategory) => {
      event.stopPropagation();
      if (anchorEl === null || anchorEl !== event.currentTarget) {
        setAnchorEl(event.currentTarget);
        props.setSelectedCategory({
          name: ppCategory.name,
          company_id: ppCategory.company_id,
          id: ppCategory.id,
          category_ordering: ppCategory.category_ordering,
        });
      } else {
        setAnchorEl(null);
        props.setSelectedCategory(null);
      }
    };

    return (
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
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
            props.setSelectedCategory(null);
          }}
        >
          <List dense>
            <MenuItem
              button
              onClick={() => {
                props.showCategoryEditDialog();
                setAnchorEl(null);
              }}
            >
              <EditIcon className={classes.popoverIcon} />
              <Typography>{t('category.popover.edit')}</Typography>
            </MenuItem>
            <ButtonWithConfirm
              button
              onClick={() => {
                props.deletePaymentPackCategory(paymentPackCategory);
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
            {paymentPackCategory.id && !props.isCategoryFiltered && (
              <IconButton {...listeners} {...attributes}>
                <DragHandleIcon />
              </IconButton>
            )}
            <Typography variant="h5" component="h2">
              {paymentPackCategory
                ? `${paymentPackCategory.name || t('noCategory.name')} (${
                    paymentPackCategory.packs?.length || 0
                  })`
                : ''}
            </Typography>
          </div>
          <div className={classes.titleActions}>
            {paymentPackCategory.id ? (
              <IconButton
                aria-haspopup="true"
                aria-owns={anchorEl ? 'category-popover' : undefined}
                onClick={(event) => handlePopover(event, paymentPackCategory)}
              >
                <MoreVertIcon />
              </IconButton>
            ) : (
              <Tooltip title={t('noCategory.help')}>
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
        <Divider className={classes.divider} />
        {!props.isCategoryDragging && (
          <Collapse className={classes.collapse} in={expandCollapse}>
            {!!(paymentPackCategory && paymentPackCategory.packs) &&
              (paymentPackCategory.packs.length ? (
                <SortablePaymentPackList
                  {...props}
                  empty={t('selector.noAvailable')}
                />
              ) : (
                <Typography color="textSecondary">
                  {t('noCategory.empty')}
                </Typography>
              ))}
          </Collapse>
        )}
      </div>
    );
  },
);

const styles = (theme: Theme) => ({
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
  paper: {
    width: '100%',
  },
});

export const PresentationalComponentPackCategory = compose<
  any,
  SimplifiedCategoryProps
>(
  withTranslation('paymentPack'),
  withStyles(styles),
)(PresentationalComponentPaymentPackCategory);

export default compose<any, OwnProps>(
  withTranslation('paymentPack'),
  withStyles(styles),
)(PaymentPackCategoryItemWithPaymentPack);
