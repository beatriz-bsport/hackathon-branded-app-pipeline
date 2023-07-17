// @flow
import React, { useCallback, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';

import { Divider } from '@material-ui/core';
import CouponListItem from './CouponListItem.component';
import CouponTypeFilter from './CouponTypeFilter/CouponTypeFilter.component';
import { CouponFilterOptions, type Coupon } from '../types';

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

  const [filteredInactiveCoupons, setFilteredInactiveCoupons] =
    useState(inactiveCoupons);

  const [filteredActiveCoupons, setFilteredActiveCoupons] =
    useState(activeCoupons);

  const handleFilter = useCallback(
    (couponType: CouponFilterOptions | CouponKind) => {
      if (
        couponType === CouponFilterOptions.DEFAULT &&
        !!activeCoupons &&
        !!inactiveCoupons
      ) {
        setFilteredInactiveCoupons(inactiveCoupons);
        setFilteredActiveCoupons(activeCoupons);
      } else {
        const inactiveCouponsToDisplay =
          inactiveCoupons?.filter(
            (coupon) => coupon?.coupon_type === couponType,
          ) ?? [];
        const activeCouponsToDisplay =
          activeCoupons?.filter(
            (coupon) => coupon?.coupon_type === couponType,
          ) ?? [];
        setFilteredInactiveCoupons(inactiveCouponsToDisplay);
        setFilteredActiveCoupons(activeCouponsToDisplay);
      }
    },
    [inactiveCoupons, activeCoupons],
  );

  useEffect(() => {
    setFilteredInactiveCoupons(inactiveCoupons);
    setFilteredActiveCoupons(activeCoupons);
  }, [inactiveCoupons, activeCoupons]);

  return (
    <div>
      <div className={classes.filter}>
        <CouponTypeFilter onCouponTypeFilter={handleFilter} />
      </div>
      {filteredActiveCoupons.length > 0 && (
        <div className={classes.section}>
          <Typography className={classes.sectionTitle} variant="h5">
            {t('list.activeCoupons')}
          </Typography>
          <Divider className={classes.divider} />
          <Paper>
            <List dense disablePadding divider>
              {filteredActiveCoupons.map((coupon) => (
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
      {filteredInactiveCoupons.length > 0 && (
        <div className={classes.section}>
          <Typography className={classes.sectionTitle} variant="h5">
            {t('list.inactiveCoupons')}
          </Typography>
          <Divider className={props.classes.divider} />
          <Paper>
            <List dense disablePadding divider>
              {filteredInactiveCoupons.map((coupon) => (
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
  filter: {
    width: '20%',
    minWidth: '290px',
  },
});
export default compose(
  withTranslation(['coupon']),
  withStyles(styles),
)(CouponList);
