// @flow
import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withStyles } from '@material-ui/core';
import { compose, withProps } from 'recompose';

import { createCoupon } from '../../libs/coupon/actions';
import CouponForm from '../../libs/coupon/components/CouponForm.component';

type Props = {
  createOrUpdateLoading: boolean,
  createCoupon: (data: *) => void,
  goToCouponList: () => void,
  classes: Object,
};

export class CouponCreate extends Component<Props> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <CouponForm
            processing={this.props.createOrUpdateLoading}
            onSubmit={this.props.createCoupon}
            onCancel={this.props.goToCouponList}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    minWidth: '60vw',
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      createOrUpdateLoading: state.coupon.coupon.createOrUpdate.loading,
    }),
    {
      createCouponAction: createCoupon,
      goToCouponList: () => push('/coupon'),
    },
  ),
  withProps(({ createCouponAction, goToCouponList }) => ({
    createCoupon: (data) =>
      createCouponAction(data, { onSuccess: goToCouponList }),
  })),
)(CouponCreate);
