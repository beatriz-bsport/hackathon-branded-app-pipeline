// @flow
import React from 'react';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import CouponListItem from './CouponListItem.component';
import type { Coupon } from '../types';

type Props = {
  classes: Object,
  activeCoupons: Array<Coupon>,
  inactiveCoupons: Array<Coupon>,
  goToCoupon: (id: number) => void,
  goToEdit: (id: number) => void,
  setCouponToDelete: (id: number) => void,
  t: TFunction,
};

export const CouponList = (props: Props) => {
  const { classes, activeCoupons, inactiveCoupons, goToCoupon, t } = props;
  return (
    <div>
      {activeCoupons.length === 0 ? null : (
        <div className={classes.section}>
          <Typography
            className={classes.sectionTitle}
            variant="h6"
            component="h2"
          >
            {t('list.activeCoupons')}
          </Typography>
          <Paper>
            <List disablePadding dense divider>
              {activeCoupons.map((coupon) => (
                <CouponListItem
                  key={coupon.id}
                  onClick={() => goToCoupon(coupon.id)}
                  onEdit={props.goToEdit}
                  onDelete={props.setCouponToDelete}
                  coupon={coupon}
                  divider
                />
              ))}
            </List>
          </Paper>
        </div>
      )}
      {inactiveCoupons.length === 0 ? null : (
        <div className={classes.section}>
          <Typography
            className={classes.sectionTitle}
            variant="h6"
            component="h2"
          >
            {t('list.inactiveCoupons')}
          </Typography>
          <Paper>
            <List disablePadding dense divider>
              {props.inactiveCoupons.map((coupon) => (
                <CouponListItem
                  key={coupon.id}
                  onClick={() => props.goToCoupon(coupon.id)}
                  onEdit={props.goToEdit}
                  onDelete={props.setCouponToDelete}
                  coupon={coupon}
                  divider
                />
              ))}
            </List>
          </Paper>
        </div>
      )}
    </div>
  );
};

const styles = (theme) => ({
  section: {
    marginBottom: theme.spacing.unit * 2,
  },
  sectionTitle: {
    marginBottom: theme.spacing.unit,
  },
});
export default compose(
  withNamespaces(['coupon']),
  withStyles(styles),
)(CouponList);
