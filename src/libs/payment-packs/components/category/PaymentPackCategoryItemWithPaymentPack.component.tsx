import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import { TFunction } from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
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
import PaymentPackListItem from '../PaymentPackListItem.component';
import type { PaymentPack, PaymentPackCategory } from '../../types';
import { MaterialStyleType } from '../../../../utils/types';
import withConfirm from '../../../../hocs/with-confirm.hoc';

interface PaymentPackByCategory {
  id: number;
  name: string;
  company_id: number;
  publicPacks: Array<PaymentPack>;
  managerPacks: Array<PaymentPack>;
}

interface PaymentPackByUnCategorized {
  publicPacks: Array<PaymentPack>;
  managerPacks: Array<PaymentPack>;
}
type OwnProps = {
  onEdit: (pp: PaymentPack) => void;
  onDelete: (pp: PaymentPack) => void;
  onClick: (ppId: number) => void;
  onRestore: (ppId: number) => void;
  paymentPackUnCategorized?: PaymentPackByUnCategorized;
  paymentPackCategory?: PaymentPackByCategory;
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
export const PaymentPackCategoryItemWithPaymentPack = (props: Props) => {
  const { t, classes, paymentPackUnCategorized, paymentPackCategory } = props;
  const [expandCollaspe, setExpandCollapse] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopover = (event: any, ppCategory: PaymentPackCategory) => {
    event.stopPropagation();
    if (
      anchorEl === null ||
      (anchorEl !== null && anchorEl !== event.currentTarget)
    ) {
      setAnchorEl(event.currentTarget);
      props.setSelectedCategory({
        name: ppCategory.name,
        company_id: ppCategory.company_id,
        id: ppCategory.id,
      });
    } else {
      setAnchorEl(null);
      props.setSelectedCategory(null);
    }
  };
  const renderPackList = (packs: Array<PaymentPack>, disabled: boolean) => (
    <Paper>
      <List disablePadding>
        {packs.map((pack) => (
          <PaymentPackListItem
            pack={pack}
            divider
            onEdit={() => props.onEdit(pack)}
            onDelete={() => props.onDelete(pack)}
            onClick={!pack.disabled ? () => props.onClick(pack.id) : null}
            onRestore={() => props.onRestore(pack.id)}
            key={pack.id}
            disabled={disabled}
          />
        ))}
      </List>
    </Paper>
  );
  if (paymentPackUnCategorized) {
    return (
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} md={6}>
          <div className={classes.topTitle}>
            <Typography variant="h5" component="h2">
              {t('publicPacksTitle')}
            </Typography>
          </div>
          {paymentPackUnCategorized &&
          paymentPackUnCategorized.publicPacks &&
          paymentPackUnCategorized.publicPacks.length ? (
            <>{renderPackList(paymentPackUnCategorized.publicPacks, false)}</>
          ) : null}
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.topTitle}>
            <Typography variant="h5" component="h2">
              {t('privatePacksTitle')}
            </Typography>
          </div>
          {paymentPackUnCategorized &&
          paymentPackUnCategorized.managerPacks &&
          paymentPackUnCategorized.managerPacks.length ? (
            <>{renderPackList(paymentPackUnCategorized.managerPacks, false)}</>
          ) : null}
        </Grid>
      </Grid>
    );
  }
  if (paymentPackCategory) {
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
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={12}>
            <div className={classes.header}>
              <div className={classes.title}>
                <Typography variant="h5" component="h2">
                  {`${paymentPackCategory.name} (${
                    paymentPackCategory?.managerPacks
                      ? paymentPackCategory?.managerPacks.length
                      : 0
                  })`}
                </Typography>
              </div>
              <div className={classes.titleActions}>
                <IconButton
                  aria-haspopup="true"
                  aria-owns={anchorEl ? 'category-popover' : undefined}
                  onClick={(event) => handlePopover(event, paymentPackCategory)}
                >
                  <MoreVertIcon />
                </IconButton>
                <IconButton onClick={() => setExpandCollapse(!expandCollaspe)}>
                  {expandCollaspe ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </div>
            </div>
            <Divider className={classes.divider} />
          </Grid>
          <Collapse className={classes.collapse} in={expandCollaspe}>
            <Grid container direction="row" spacing={3}>
              <Grid item xs={12} md={6}>
                {paymentPackCategory &&
                paymentPackCategory.publicPacks &&
                paymentPackCategory.publicPacks.length ? (
                  <>{renderPackList(paymentPackCategory.publicPacks, false)}</>
                ) : null}
              </Grid>
              <Grid item xs={12} md={6}>
                {paymentPackCategory &&
                paymentPackCategory.managerPacks &&
                paymentPackCategory.managerPacks.length ? (
                  <>{renderPackList(paymentPackCategory.managerPacks, false)}</>
                ) : null}
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </>
    );
  }
  return <div />;
};
const styles = (theme: Theme) => ({
  header: {
    display: 'flex',
    aignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(4),
  },
  title: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  topTitle: {
    width: '100%',
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
  },
  titleActions: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  popoverIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.grey[700],
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
  collapse: {
    width: '100%',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
});
export default compose<any, OwnProps>(
  withTranslation('paymentPack'),
  withStyles(styles),
)(PaymentPackCategoryItemWithPaymentPack);
