// @flow
import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withStyles } from '@material-ui/core';
import { compose, withProps } from 'recompose';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import withTitle from '../../hocs/with-title.hoc';
import { getCouponById } from '../../libs/coupon/selectors';
import { fetchCouponPage, updateCoupon } from '../../libs/coupon/actions';
import type { Coupon } from '../../libs/coupon/types';
import CouponForm from '../../libs/coupon/components/CouponForm.component';

type Props = {
  createOrUpdateLoading: boolean,
  updateCoupon: (id: string, data: *) => void,
  fetchCouponPage: (number) => void,
  goToCouponList: () => void,
  initial: ?Coupon,
  classes: Object,
};

export class CouponCreate extends Component<Props> {
  componentDidMount() {
    this.props.fetchCouponPage(1);
  }

  render() {
    const { classes } = this.props;
    if (!this.props.initial) {
      return <CircularProgress />;
    }
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <CouponForm
            initial={this.props.initial}
            processing={this.props.createOrUpdateLoading}
            onSubmit={this.props.updateCoupon}
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
  withNamespaces(),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      createOrUpdateLoading: state.coupon.coupon.createOrUpdate.loading,
      initial: getCouponById(state, id),
    }),
    {
      updateCouponAction: updateCoupon,
      goToCouponList: () => push('/coupon'),
      fetchCouponPage,
    },
  ),
  withProps(({ updateCouponAction, id, goToCouponList }) => ({
    updateCoupon: (data) =>
      updateCouponAction(id, data, { onSuccess: goToCouponList }),
  })),
  withTitle(({ t }: { t: TFunction }) => t('titles:coupon.couponEdit')),
)(CouponCreate);
