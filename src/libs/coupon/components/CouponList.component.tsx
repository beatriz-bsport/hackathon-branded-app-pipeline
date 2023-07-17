import React, { useCallback, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

import { Divider, makeStyles } from '@material-ui/core';
import { CouponKind } from '@bsport/common/lib/master-data/coupon';
import CouponListItem from './CouponListItem.component';
import CouponTypeFilter from './CouponTypeFilter/CouponTypeFilter.component';
import { CouponFilterOptions, type Coupon } from '../types';

type Props = {
  activeCoupons: Coupon[];
  inactiveCoupons: Coupon[];
  goToCoupon: (id: number) => void;
  onEdit: (coupon: Coupon) => void;
  setCouponToDelete: (id: number) => void;
};

const useStyles = makeStyles((theme) => ({
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
}));

export const CouponList: React.FC<Props> = ({
  activeCoupons,
  inactiveCoupons,
  goToCoupon,
  onEdit,
  setCouponToDelete,
}) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();

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
            <List dense disablePadding>
              {filteredActiveCoupons.map((coupon) => (
                <CouponListItem
                  key={coupon.id}
                  divider
                  coupon={coupon}
                  onClick={goToCoupon}
                  onDelete={setCouponToDelete}
                  onEdit={onEdit}
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
          <Divider className={classes.divider} />
          <Paper>
            <List dense disablePadding>
              {filteredInactiveCoupons.map((coupon) => (
                <CouponListItem
                  key={coupon.id}
                  divider
                  coupon={coupon}
                  onClick={goToCoupon}
                  onDelete={setCouponToDelete}
                  onEdit={onEdit}
                />
              ))}
            </List>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default React.memo(CouponList);
