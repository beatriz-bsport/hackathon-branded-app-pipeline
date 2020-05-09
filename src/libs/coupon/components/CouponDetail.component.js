// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';

import DiscountListItem from './DiscountListItem.component';
import CouponCard from './CouponCard.component';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

import type { Discount, Coupon } from '../types';

type Props = {
  coupon: Coupon,
  discountLoading: boolean,
  discounts: Array<Discount>,
  goToInvoice: (uuid: string) => void,
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
      goToInvoice={this.props.goToInvoice}
    />
  );

  render() {
    const { classes, coupon, discounts, discountLoading, t } = this.props;
    return (
      <div>
        <Grid container>
          <Grid item xs={12} md={6} className={classes.paperContainer}>
            <Paper>
              <CouponCard coupon={coupon} goToEdit={this.props.goToEdit} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <PaginatedListBase
                page={discounts.page}
                nbItems={discounts.count}
                itemPerPage={this.props.itemPerPage}
                onPageRequested={(page: number, pageSize: number) =>
                  this.props.fetchCouponDiscounts(coupon.id, {
                    page,
                    page_size: pageSize,
                  })
                }
                items={discounts.items}
                renderItem={this.renderDiscountListItem}
                loading={discountLoading}
                listProps={{ dense: true }}
                renderEmpty={() => (
                  <React.Fragment>
                    <div className={classes.emptyContainer}>
                      <Typography variant="caption" color="textSecondary">
                        {t('noDiscount')}
                      </Typography>
                    </div>
                    <Divider />
                  </React.Fragment>
                )}
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
  withNamespaces(['coupon']),
)(CouponDetail);
