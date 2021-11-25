import { withTranslation, WithTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Paper, Tooltip } from '@material-ui/core';
import { CSS } from '@dnd-kit/utilities';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HelpIcon from '@material-ui/icons/Help';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import { Theme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { MaterialStyleType } from '../../../../utils/types';
import {
  PrivatePass,
  PrivatePassCategory,
  PrivatePassCategoryWithPasses,
} from '../../types';
import PrivatePassListItem from '../pass/PrivatePassListItem.component';
import { ManagerOnly } from '../../../payment-packs/components/PaymentPackFilterAndSortHeader.component';
import withConfirm from '../../../../hocs/with-confirm.hoc';

type OwnProps = {
  onEdit: (pp: PrivatePass) => void;
  onDelete: (ppId: number) => void;
  onClick: (ppId: number) => void;
  privatePassCategory: PrivatePassCategoryWithPasses;
  setSelectedCategory: (category: PrivatePassCategory) => void;
  showCategoryEditDialog: () => void;
  deletePrivatePassCategory: (category: PrivatePassCategory) => void;
  isCategoryDragging: boolean;
  orderingOverride: any;
  filterManagerOnly: ManagerOnly;
  privatePassOrder: any;
  isCategoryFiltered: boolean;
  privatePassCategoryIds: Array<number>;
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
  onEdit: (pp: PrivatePass) => void;
  onDelete: (ppId: number) => void;
  onClick: (ppId: number) => void;
  privatePassCategory: PrivatePassCategoryWithPasses;
  orderingOverride?: any;
  filterManagerOnly: ManagerOnly;
  empty: string;
  privatePassOrder: any;
};

type PackListItemProps = MaterialStyleType<ReturnType<typeof styles>> & {
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
  ppass: PrivatePass;
  sortedItems: Array<PrivatePass>;
  draggable: boolean;
};

const SortablePrivatePassListItem = React.memo((props: PackListItemProps) => {
  const { ppass } = props;
  const { listeners, attributes, setNodeRef, transform, transition } =
    useSortable({
      id: props.ppass.id.toString(10),
      data: {
        category: { ppasses: props.sortedItems },
        ppass,
      },
    });
  return (
    <Paper
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      elevation={2}
      className={props.classes.paper}
    >
      <PrivatePassListItem
        attributes={attributes}
        listeners={listeners}
        draggable={props.draggable}
        pass={ppass}
        divider
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onClick={props.onClick}
        key={ppass.id}
        disabled={false}
      />
    </Paper>
  );
});

const SortablePrivatePassList = React.memo((props: PackListProps) => {
  const ppasses = props.privatePassOrder
    ? [...props.privatePassCategory.passes].sort(
        (p1, p2) =>
          (props.privatePassOrder[p1.id] || props.privatePassOrder[p1.id] === 0
            ? props.privatePassOrder[p1.id]
            : p1.ordering_in_category) -
          (props.privatePassOrder[p2.id] || props.privatePassOrder[p2.id] === 0
            ? props.privatePassOrder[p2.id]
            : p2.ordering_in_category),
      )
    : [...props.privatePassCategory.passes].sort(
        (p1, p2) =>
          (props.orderingOverride[p1.id] || props.orderingOverride[p1.id] === 0
            ? props.orderingOverride[p1.id]
            : p1.ordering_in_category) -
          (props.orderingOverride[p2.id] || props.orderingOverride[p2.id] === 0
            ? props.orderingOverride[p2.id]
            : p2.ordering_in_category),
      );

  const items = ppasses.map((e) => e.id.toString(10));

  const showManagerOnly =
    props.filterManagerOnly === ManagerOnly.showManagerOnly &&
    ppasses.filter((pp) => pp.manager_only).length;

  const showManagerExclude =
    props.filterManagerOnly === ManagerOnly.showManagerExclude &&
    ppasses.filter((pp) => !pp.manager_only).length;
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {props.filterManagerOnly === ManagerOnly.showAll ||
      showManagerOnly ||
      showManagerExclude ? (
        ppasses.map((ppass: PrivatePass) => {
          return props.filterManagerOnly === ManagerOnly.showAll ||
            (props.filterManagerOnly === ManagerOnly.showManagerOnly &&
              ppass.manager_only) ||
            (props.filterManagerOnly === ManagerOnly.showManagerExclude &&
              !ppass.manager_only) ? (
            <SortablePrivatePassListItem
              draggable={
                !props.privatePassOrder &&
                props.filterManagerOnly === ManagerOnly.showAll
              }
              key={ppass.id}
              ppass={ppass}
              onEdit={props.onEdit ? () => props.onEdit(ppass) : null}
              onClick={
                ppass.available && props.onClick
                  ? () => props.onClick(ppass.id)
                  : null
              }
              onDelete={props.onDelete ? () => props.onDelete(ppass.id) : null}
              classes={props.classes}
              sortedItems={ppasses}
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
  privatePassCategory: PrivatePassCategoryWithPasses;
};

type SimplifiedProps = SimplifiedCategoryProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const PresentationalComponentPrivatePassCategory = React.memo(
  (props: SimplifiedProps) => {
    const { t, classes, privatePassCategory } = props;

    return (
      <div>
        <div className={classes.flex}>
          <IconButton>
            <DragHandleIcon />
          </IconButton>
          <Typography variant="h5" component="h2">
            {privatePassCategory
              ? `${
                  privatePassCategory.name || t('paymentPack:noCategory.name')
                } (${privatePassCategory.passes?.length || 0})`
              : ''}
          </Typography>
        </div>
        <div className={classes.titleActions}>
          {privatePassCategory.id !== -1 ? (
            <IconButton aria-haspopup="true">
              <MoreVertIcon />
            </IconButton>
          ) : (
            <Tooltip title={t('paymentPack:noCategory.help')}>
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

export const PrivatePassCategoryItemWithPrivatePass = React.memo(
  (props: Props) => {
    const { t, classes, privatePassCategory } = props;
    const [anchorEl, setAnchorEl] = useState(null);

    const [expandCollapse, setExpandCollapse] = useState(true);

    const { setNodeRef, attributes, listeners, transition, transform } =
      useSortable({
        id: privatePassCategory.id?.toString(10) || 'null',
        data: { categoryIds: props.privatePassCategoryIds },
      });

    const handlePopover = (event: any, ppCategory: PrivatePassCategory) => {
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
              <Typography>{t('paymentPack:category.popover.edit')}</Typography>
            </MenuItem>
            <ButtonWithConfirm
              button
              onClick={() => {
                props.deletePrivatePassCategory(privatePassCategory);
                setAnchorEl(null);
              }}
            >
              <DeleteIcon className={classes.popoverIcon} />
              <Typography>
                {t('paymentPack:category.popover.delete')}
              </Typography>
            </ButtonWithConfirm>
          </List>
        </Popover>

        <div className={classes.header}>
          <div className={classes.flex}>
            {privatePassCategory.id && !props.isCategoryFiltered && (
              <IconButton {...listeners} {...attributes}>
                <DragHandleIcon />
              </IconButton>
            )}
            <Typography variant="h5" component="h2">
              {privatePassCategory
                ? `${
                    privatePassCategory.name || t('paymentPack:noCategory.name')
                  } (${privatePassCategory.passes?.length || 0})`
                : ''}
            </Typography>
          </div>
          <div className={classes.titleActions}>
            {privatePassCategory.id ? (
              <IconButton
                aria-haspopup="true"
                aria-owns={anchorEl ? 'category-popover' : undefined}
                onClick={(event) => handlePopover(event, privatePassCategory)}
              >
                <MoreVertIcon />
              </IconButton>
            ) : (
              <Tooltip title={t('paymentPack:noCategory.help')}>
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
            {!!(privatePassCategory && privatePassCategory.passes) &&
              (privatePassCategory.passes.length ? (
                <SortablePrivatePassList
                  {...props}
                  empty={t('paymentPack:selector.noAvailable')}
                />
              ) : (
                <Typography color="textSecondary">
                  {t('paymentPack:noCategory.empty')}
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

export const PresentationalComponentPassCategory = compose<
  any,
  SimplifiedCategoryProps
>(
  withTranslation('privatePass'),
  withStyles(styles),
)(PresentationalComponentPrivatePassCategory);

export default compose<any, OwnProps>(
  withTranslation('privatePass'),
  withStyles(styles),
)(PrivatePassCategoryItemWithPrivatePass);
