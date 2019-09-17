// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import DiscountListItem from './DiscountListItem.component';
import CouponCard from './CouponCard.component';
import PaginatedListStateful from '../../../components/PaginatedListStateful.component';

import type { Discount, Coupon } from '../types';

type Props = {
  coupon: Coupon,
  discountLoading: boolean,
  discounts: Array<Discount>,
  goToInvoice: (uuid: string) => void,
  classes: Object,
  goToEdit: () => void,
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
    const { classes, coupon, discounts, discountLoading } = this.props;
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
              <PaginatedListStateful
                items={discounts}
                renderItem={this.renderDiscountListItem}
                loading={discountLoading}
                itemPerPage={8}
                listProps={{ dense: true }}
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
    padding: theme.spacing.unit,
  },
});

export default withStyles(styles)(CouponDetail);
