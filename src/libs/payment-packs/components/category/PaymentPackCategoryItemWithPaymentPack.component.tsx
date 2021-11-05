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
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PaymentPackListItem from '../PaymentPackListItem.component';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackCategoryWithPacks,
} from '../../types';
import { MaterialStyleType } from '../../../../utils/types';
import withConfirm from '../../../../hocs/with-confirm.hoc';

type OwnProps = {
  onEdit: (pp: PaymentPack) => void;
  onDelete: (pp: PaymentPack) => void;
  onClick: (ppId: number) => void;
  onRestore: (ppId: number) => void;
  paymentPackCategory: PaymentPackCategoryWithPacks;
  setSelectedCategory?: (category: PaymentPackCategory) => void;
  showCategoryEditDialog?: () => void;
  deletePaymentPackCategory?: (category: PaymentPackCategory) => void;
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
};

type PackListItemProps = MaterialStyleType<ReturnType<typeof styles>> & {
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
  onRestore: () => void;
  pack: PaymentPack;
};

const SortablePaymentPackListItem = React.memo((props: PackListItemProps) => {
  const { pack } = props;
  const {
    listeners,
    attributes,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
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
        draggable
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

const SortablePaymentPackList = (props: PackListProps) => {
  const packs = [...props.paymentPackCategory.packs].sort(
    (p1, p2) =>
      (props.orderingOverride[p1.id] || p1.ordering_in_category) -
      (props.orderingOverride[p2.id] || p2.ordering_in_category),
  );

  const items = packs.map((e) => e.id.toString(10));

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {packs.map((pack: PaymentPack) => {
        const onEdit = () => props.onEdit(pack);
        const onDelete = () => props.onDelete(pack);
        const onClick = !pack.disabled ? () => props.onClick(pack.id) : null;
        const onRestore = () => props.onRestore(pack.id);
        return (
          <SortablePaymentPackListItem
            key={pack.id}
            pack={pack}
            onEdit={onEdit}
            onClick={onClick}
            onDelete={onDelete}
            onRestore={onRestore}
            classes={props.classes}
            sortedItems={packs}
          />
        );
      })}
    </SortableContext>
  );
};

export const PaymentPackCategoryItemWithPaymentPack = React.memo(
  (props: Props) => {
    const { t, classes, paymentPackCategory } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [expandCollapse, setExpandCollapse] = useState(true);

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
      <>
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
          <Typography variant="h5" component="h2">
            {paymentPackCategory
              ? `${paymentPackCategory.name || t('noCategory.name')} (${
                  paymentPackCategory.packs?.length || 0
                })`
              : ''}
          </Typography>
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
        <Collapse className={classes.collapse} in={expandCollapse}>
          {!!(paymentPackCategory && paymentPackCategory.packs) &&
            (paymentPackCategory.packs.length ? (
              <SortablePaymentPackList {...props} />
            ) : (
              <Typography color="textSecondary">
                {t('noCategory.empty')}
              </Typography>
            ))}
        </Collapse>
      </>
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
  paper: {
    width: '100%',
  },
});
export default compose<any, OwnProps>(
  withTranslation('paymentPack'),
  withStyles(styles),
)(PaymentPackCategoryItemWithPaymentPack);
