import React, { useCallback } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

// @ts-expect-error
// @ts-expect-error
import PaginatedListBase from '#components/PaginatedListBase.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { Discount, Coupon, FetchDiscountParams } from '#libs/coupon/types';
import CouponCard from './CouponCard.component';
import DiscountListItem from './DiscountListItem.component';

type Props = {
  coupon: Coupon;
  discountLoading: boolean;
  isLoading: boolean;
  discounts: {
    items: Discount[];
    page: number;
    count: number;
  };
  goToInvoice: (uuid: string) => void;
  goToBillingPlan: (id: number) => void;
  goToEdit: () => void;
  itemPerPage: number;
  fetchCouponDiscounts: (id: number, params: FetchDiscountParams) => void;
  openVoucherCodesDialog: () => void;
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: theme.spacing(1),
  },
  emptyContainer: {
    padding: theme.spacing(2),
    backgroundColor: 'F8F8F8',
  },
}));

const CouponDetail: React.FC<Props> = ({
  coupon,
  discountLoading,
  isLoading,
  discounts,
  goToInvoice,
  goToBillingPlan,
  goToEdit,
  itemPerPage,
  fetchCouponDiscounts,
  openVoucherCodesDialog,
}) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();

  const getListItemRenderer = useCallback(
    (hasReadInvoicePermission: boolean) => (discount: Discount) =>
      (
        <DiscountListItem
          divider
          discount={discount}
          goToBillingPlan={goToBillingPlan}
          goToInvoice={hasReadInvoicePermission && goToInvoice}
        />
      ),
    [goToBillingPlan, goToInvoice],
  );

  const renderEmpty = useCallback(
    () => (
      <React.Fragment>
        <div className={classes.emptyContainer}>
          <Typography color="textSecondary" variant="caption">
            {t('noDiscount')}
          </Typography>
        </div>
        <Divider />
      </React.Fragment>
    ),
    [classes.emptyContainer, t],
  );

  const onPageRequestedHandler = useCallback(
    (page: number, pageSize: number) =>
      fetchCouponDiscounts(coupon.id, {
        page,
        page_size: pageSize,
      }),
    [fetchCouponDiscounts, coupon.id],
  );

  return (
    <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.readInvoices">
      {(hasReadInvoicePermission: boolean) => (
        <div>
          <Grid container>
            <Grid item className={classes.paperContainer} md={6} xs={12}>
              <Paper>
                <CouponCard
                  coupon={coupon}
                  goToEdit={goToEdit}
                  isLoading={isLoading}
                  openVoucherCodesDialog={openVoucherCodesDialog}
                />
              </Paper>
            </Grid>
            <Grid item className={classes.paperContainer} md={6} xs={12}>
              <Paper>
                <PaginatedListBase
                  itemPerPage={itemPerPage}
                  items={discounts.items}
                  listProps={{ dense: true }}
                  loading={discountLoading}
                  nbItems={discounts.count}
                  onPageRequested={onPageRequestedHandler}
                  page={discounts.page}
                  renderEmpty={renderEmpty}
                  renderItem={getListItemRenderer(hasReadInvoicePermission)}
                />
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
    </ObjectLevelPermissionProvider>
  );
};

export default React.memo(CouponDetail);
