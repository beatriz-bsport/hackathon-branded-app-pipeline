// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, pure } from 'recompose';
import { VOUCHER_TYPE_AMOUNT } from '@bsport/common/lib/master-data/coupon';
import { isCurrentlyActive } from '../utils';

import type { Coupon } from '../types';

type Props = {
  coupon: Coupon,
  classes: Object,
  t: TFunction,
  goToEdit: () => void,
};

export const CouponCard = (props: Props) => {
  const { coupon, classes } = props;
  const currentlyActive = isCurrentlyActive(coupon);
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.headline}>
        <div>
          <Typography variant="h4">{props.coupon.name}</Typography>
          <Typography variant="h5">{props.coupon.code}</Typography>
        </div>
        <div className={classes.headlineRight}>
          {currentlyActive ? (
            <CheckCircleOutlineIcon
              className={classes.isActiveIcon}
              color="primary"
            />
          ) : (
            <CancelIcon className={classes.isActiveIcon} color="error" />
          )}
          <Typography align="right" variant="h5">
            {coupon.voucher_type === VOUCHER_TYPE_AMOUNT
              ? `${coupon.amount_off}€`
              : `${coupon.percent_off}%`}
          </Typography>
        </div>
      </div>
      <div className={classes.actionButtons}>
        <Button color="primary" onClick={props.goToEdit}>
          {props.t('detail.seeParameters')}
        </Button>
      </div>
    </Paper>
  );
};

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    width: '100%',
  },
  headline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  isActiveIcon: {
    marginRight: theme.spacing.unit,
  },
  headlineRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['coupon']),
  pure,
)(CouponCard);
