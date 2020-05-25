// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { compose, withState, withProps } from 'recompose';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import withTitle from '../../hocs/with-title.hoc';
import CouponListComponent from '../../libs/coupon/components/CouponList.component';
import CouponDeleteModal from '../../libs/coupon/components/CouponDeleteModal.component';
import { fetchCouponPage, deleteCoupon } from '../../libs/coupon/actions';
import {
  getActiveCoupons,
  getInactiveCoupons,
} from '../../libs/coupon/selectors';
import type { Coupon } from '../../libs/coupon/types';

type Props = {
  inactiveCoupons: Array<Coupon>,
  activeCoupons: Array<Coupon>,
  loading: boolean,
  fetchCouponPage: (page: number) => void,

  goToCoupon: (id: string) => void,
  goToEdit: (id: string) => void,
  goToCreate: () => void,

  couponToDelete: (id: string) => void,
  setCouponToDelete: (id: number) => void,
  closeDeleteModal: () => void,
  deleteCoupon: (id: string) => void,

  t: TFunction,
  classes: Object,
};

export class CouponList extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchCouponPage(1);
  }

  render() {
    const { classes, t } = this.props;
    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        {!this.props.loading &&
        this.props.inactiveCoupons.length === 0 &&
        this.props.activeCoupons.length === 0 ? (
          <Typography className={classes.emptyText} color="textSecondary">
            {t('list.isEmpty')}
          </Typography>
        ) : (
          <CouponListComponent
            inactiveCoupons={this.props.inactiveCoupons}
            activeCoupons={this.props.activeCoupons}
            goToCoupon={this.props.goToCoupon}
            goToEdit={this.props.goToEdit}
            setCouponToDelete={this.props.setCouponToDelete}
          />
        )}
        <CouponDeleteModal
          open={!!this.props.couponToDelete}
          onClose={this.props.closeDeleteModal}
          onSubmit={this.props.deleteCoupon}
        />
        <div className={classes.addButtonContainer}>
          <Fab
            color="primary"
            variant="extended"
            onClick={this.props.goToCreate}
          >
            <AddIcon />
            {t('createCoupon')}
          </Fab>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  emptyText: {
    margin: theme.spacing(3),
  },
  addButtonContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['coupon']),
  connect(
    (state) => ({
      inactiveCoupons: getInactiveCoupons(state),
      activeCoupons: getActiveCoupons(state),
      loading: state.coupon.loading,
    }),
    {
      fetchCouponPage,
      deleteCouponAction: deleteCoupon,
      goToCreate: () => push('/coupon/add/'),
      goToEdit: (id: string) => push(`/coupon/${id}/edit/`),
      goToCoupon: (id: string) => push(`/coupon/${id}/`),
    },
  ),
  withStyles(styles),
  withState('couponToDelete', 'setCouponToDelete', null),
  withProps(({ setCouponToDelete, couponToDelete, deleteCouponAction }) => ({
    closeDeleteModal: () => setCouponToDelete(null),
    deleteCoupon: () => {
      deleteCouponAction(couponToDelete);
      setCouponToDelete(null);
    },
  })),
  withTitle(({ t }: { t: TFunction }) => t('titles:coupon.couponList')),
)(CouponList);
