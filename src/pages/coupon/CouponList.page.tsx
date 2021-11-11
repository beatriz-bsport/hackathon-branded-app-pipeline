// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { compose, withState, withProps } from 'recompose';
import { Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import { List } from '@material-ui/core';
import Fuse, { FuseOptions } from 'fuse.js';
import FuzeSearch from '../../components/FuzeSearch.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import withTitle from '../../hocs/with-title.hoc';
import CouponListComponent from '../../libs/coupon/components/CouponList.component';
import CouponListItem from '../../libs/coupon/components/CouponListItem.component';
import CouponDeleteModal from '../../libs/coupon/components/CouponDeleteModal.component';
import { fetchCouponPage, deleteCoupon } from '../../libs/coupon/actions';
import {
  getActiveCoupons,
  getInactiveCoupons,
  getAllCoupons,
} from '../../libs/coupon/selectors';
import type { Coupon } from '../../libs/coupon/types';
import { MaterialStyleType } from '../../utils/types';
import type { PaymentCombo } from '../../libs/payment-combo/types';

type OwnProps = {
  inactiveCoupons: Array<Coupon>;
  allCoupons: Array<Coupon>;
  activeCoupons: Array<Coupon>;
  loading: boolean;
  fetchCouponPage: (page: number) => void;

  goToCoupon: (id: string) => void;
  goToEdit: (id: string) => void;
  goToCreate: () => void;

  couponToDelete: (id: string) => void;
  setCouponToDelete: (id: number) => void;
  closeDeleteModal: () => void;
  deleteCoupon: (id: string) => void;

  t: TFunction;
  classes: Object;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  searchText: string;
  searchResult: Array<PaymentCombo>;
};

export class CouponList extends React.PureComponent<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchCouponPage(1);
  }

  changeSearch =
    (fuse: Fuse<PaymentCombo, FuseOptions<PaymentCombo>>) =>
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      this.setState({
        searchText: ev.target.value,
        searchResult: fuse.search(ev.target.value),
      });
    };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  render() {
    const { classes, t } = this.props;
    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        {this.props.inactiveCoupons.length === 0 &&
        this.props.activeCoupons.length === 0 &&
        !this.props.loading ? (
          <IsEmptyList
            text={this.props.t('list.isEmpty')}
            button={this.props.t('createCoupon')}
            onCreate={this.props.goToCreate}
          />
        ) : (
          <div>
            <div className={classes.search}>
              <FuzeSearch
                searchText={this.state.searchText}
                clearSearch={this.clearSearch}
                changeSearch={this.changeSearch}
                items={this.props.allCoupons}
                placeholder={t('search')}
                searchFields={['name']}
                searchResult={this.state.searchResult}
              />

              <Paper
                className={
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== ''
                    ? classes.searchPaperDisplayed
                    : classes.searchPaperHidden
                }
              >
                <Collapse
                  in={
                    this.state.searchResult.length > 0 &&
                    this.state.searchText !== ''
                  }
                >
                  <List disablePadding dense divider>
                    {this.state.searchResult.map((coupon) => (
                      <CouponListItem
                        key={coupon.id}
                        onClick={() => this.props.goToCoupon(coupon.id)}
                        onEdit={this.props.goToEdit}
                        onDelete={this.props.setCouponToDelete}
                        coupon={coupon}
                        divider
                      />
                    ))}
                  </List>
                </Collapse>
              </Paper>
            </div>

            <CouponListComponent
              inactiveCoupons={this.props.inactiveCoupons}
              activeCoupons={this.props.activeCoupons}
              goToCoupon={this.props.goToCoupon}
              goToEdit={this.props.goToEdit}
              setCouponToDelete={this.props.setCouponToDelete}
            />
          </div>
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

const styles = (theme: Theme) => ({
  search: {
    marginBottom: theme.spacing(2),
  },
  addButtonContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
    boderBottom: '0px',
  },
});

export default compose(
  withTranslation(['coupon']),
  connect(
    (state) => ({
      allCoupons: getAllCoupons(state),
      inactiveCoupons: getInactiveCoupons(state),
      activeCoupons: getActiveCoupons(state),
      loading: state.coupon.coupon.loading,
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
