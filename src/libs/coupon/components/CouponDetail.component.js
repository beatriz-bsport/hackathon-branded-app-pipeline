// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';

import DiscountListItem from './DiscountListItem.component';
import CouponCard from './CouponCard.component';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

import { Discount, Coupon } from '../types';

type Props = {
  coupon: Coupon,
  discountLoading: boolean,
  isLoading: boolean,
  discounts: Array<Discount>,
  goToInvoice: (uuid: string) => void,
  goToBillingPlan: (id: number) => void,
  classes: Object,
  goToEdit: () => void,
  t: TFunction,
  itemPerPage: number,
  fetchCouponDiscounts: (id: number, params: any) => void,
};

export class CouponDetail extends React.PureComponent<Props> {
  renderDiscountListItem = (discount: Discount) => (
    <DiscountListItem
      divider
      discount={discount}
      goToBillingPlan={this.props.goToBillingPlan}
      goToInvoice={this.props.goToInvoice}
    />
  );

  render() {
    const { classes, coupon, discounts, discountLoading, t } = this.props;
    return (
      <div>
        <Grid container>
          <Grid item className={classes.paperContainer} md={6} xs={12}>
            <Paper>
              <CouponCard
                coupon={coupon}
                goToEdit={this.props.goToEdit}
                isLoading={this.props.isLoading}
              />
            </Paper>
          </Grid>
          <Grid item className={classes.paperContainer} md={6} xs={12}>
            <Paper className={classes.paper}>
              <PaginatedListBase
                itemPerPage={this.props.itemPerPage}
                items={discounts.items}
                listProps={{ dense: true }}
                loading={discountLoading}
                nbItems={discounts.count}
                onPageRequested={(page: number, pageSize: number) =>
                  this.props.fetchCouponDiscounts(coupon.id, {
                    page,
                    page_size: pageSize,
                  })
                }
                page={discounts.page}
                renderEmpty={() => (
                  <React.Fragment>
                    <div className={classes.emptyContainer}>
                      <Typography color="textSecondary" variant="caption">
                        {t('noDiscount')}
                      </Typography>
                    </div>
                    <Divider />
                  </React.Fragment>
                )}
                renderItem={this.renderDiscountListItem}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing(1),
  },
  emptyContainer: {
    padding: theme.spacing(2),
    backgroundColor: 'F8F8F8',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['coupon']),
)(CouponDetail);
