// @flow
import React from 'react';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';

import { Divider } from '@material-ui/core';
import CouponListItem from './CouponListItem.component';
import type { Coupon } from '../types';

type Props = {
  classes: Object,
  activeCoupons: Array<Coupon>,
  inactiveCoupons: Array<Coupon>,
  goToCoupon: (id: number) => void,
  onEdit: (coupon: Coupon) => void,
  setCouponToDelete: (id: number) => void,
  t: TFunction,
};

export const CouponList = (props: Props) => {
  const { classes, activeCoupons, inactiveCoupons, goToCoupon, t } = props;
  return (
    <div>
      {activeCoupons.length === 0 ? null : (
        <div className={classes.section}>
          <Typography className={classes.sectionTitle} variant="h5">
            {t('list.activeCoupons')}
          </Typography>
          <Divider className={classes.divider} />
          <Paper>
            <List dense disablePadding divider>
              {activeCoupons.map((coupon) => (
                <CouponListItem
                  key={coupon.id}
                  divider
                  coupon={coupon}
                  onClick={() => goToCoupon(coupon.id)}
                  onDelete={props.setCouponToDelete}
                  onEdit={props.onEdit}
                  onEditCoupon={() => goToCoupon(coupon.id)}
                />
              ))}
            </List>
          </Paper>
        </div>
      )}
      {inactiveCoupons.length === 0 ? null : (
        <div className={classes.section}>
          <Typography className={classes.sectionTitle} variant="h5">
            {t('list.inactiveCoupons')}
          </Typography>
          <Divider className={props.classes.divider} />
          <Paper>
            <List dense disablePadding divider>
              {props.inactiveCoupons.map((coupon) => (
                <CouponListItem
                  key={coupon.id}
                  divider
                  coupon={coupon}
                  onClick={() => props.goToCoupon(coupon.id)}
                  onDelete={props.setCouponToDelete}
                  onEdit={props.onEdit}
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
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
});
export default compose(
  withTranslation(['coupon']),
  withStyles(styles),
)(CouponList);
