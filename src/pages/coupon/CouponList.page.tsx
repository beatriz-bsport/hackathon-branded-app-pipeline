// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { compose, withState, withProps, withHandlers } from 'recompose';
import { Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import { List } from '@material-ui/core';
import Fuse, { FuseOptions } from 'fuse.js';
import FuzeSearch from '../../components/FuzeSearch.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import withTitle from '../../hocs/with-title.hoc';
import CouponListComponent from '#libs/coupon/components/CouponList.component';
import CouponListItem from '#libs/coupon/components/CouponListItem.component';
import CouponDeleteModal from '#libs/coupon/components/CouponDeleteModal.component';
import {
  fetchCouponPage,
  deleteCoupon,
  createCoupon,
  updateCoupon,
} from '#libs/coupon/actions';
import {
  getActiveCoupons,
  getInactiveCoupons,
  getAllCoupons,
} from '#libs/coupon/selectors';
import type { Coupon } from '#libs/coupon/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import CouponFormDrawer from '#libs/coupon/components/CouponFormDrawer.component';
import { fetchAllPaymentPacks } from '#libs/payment-packs/actions';
import { fetchShopItemAsManager as fetchAllShop } from '#libs/shop/actions/shopitem';
import { fetchPrivatePassList } from '#libs/private-service/actions';
import { fetchTags } from '#libs/tag/actions';
import { getEnabled as getPaymentPacks } from '#libs/payment-packs/selectors';
import { getShopItemsAvailable as getShopItems } from '#libs/shop/selectors';
import { getPrivatePassAvailable as getPrivatePass } from '#libs/private-service/selectors/private-pass';
import { getallTagsWithTagGroup } from '#libs/tag/selectors';
import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';

type OwnProps = {
  couponToDelete: (id: string) => void;
  setCouponToDelete: (id: number) => void;
  closeDeleteModal: () => void;
  deleteCoupon: (id: string) => void;
  classes: Object;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  ConnectedProps<typeof connector> &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  searchText: string;
  searchResult: Array<PaymentCombo>;
  couponFormState: { open: boolean; initial: Coupon | null };
};

export class CouponList extends React.PureComponent<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
    couponFormState: { open: false, initial: null },
  };

  componentDidMount() {
    this.props.fetchCouponPage(1);
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllShop();
    this.props.fetchPrivatePassList();
    this.props.fetchTags();
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

  createOrUpdateCoupon = (data: Coupon, options?: OptionCallback) => {
    if (this.state.couponFormState.initial?.id) {
      return this.props.updateCoupon(
        this.state.couponFormState.initial.id,
        data,
        {
          onSuccess: () => {
            this.setState({
              couponFormState: {
                open: false,
                initial: null,
              },
            });
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        },
      );
    }
    return this.props.createCoupon(data, {
      onSuccess: () => {
        this.setState({
          couponFormState: {
            open: false,
            initial: null,
          },
        });
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

  onCloseFormDrawer = () =>
    this.setState({ couponFormState: { open: false, initial: null } });

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
            onCreate={() =>
              this.setState({ couponFormState: { open: true, initial: null } })
            }
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
                  <List disablePadding dense>
                    {this.state.searchResult.map((coupon) => (
                      <CouponListItem
                        key={coupon.id}
                        onClick={() => this.props.goToCoupon(coupon.id)}
                        onEdit={(couponSelected: Coupon) =>
                          this.setState({
                            couponFormState: {
                              open: false,
                              initial: couponSelected,
                            },
                          })
                        }
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
              onEdit={(couponSelected: Coupon) =>
                this.setState({
                  couponFormState: {
                    open: true,
                    initial: couponSelected,
                  },
                })
              }
              setCouponToDelete={this.props.setCouponToDelete}
            />
          </div>
        )}
        <CouponFormDrawer
          open={this.state.couponFormState.open}
          initial={this.state.couponFormState.initial}
          processing={this.props.createOrUpdateLoading}
          onSubmit={this.createOrUpdateCoupon}
          onCancel={this.onCloseFormDrawer}
          onClose={this.onCloseFormDrawer}
          paymentPacks={this.props.paymentPacks}
          shopItems={this.props.shopItems}
          privatePasses={this.props.privatePasses}
          tagList={this.props.tagList}
          tagsLoading={this.props.tagsLoading}
        />
        <CouponDeleteModal
          open={!!this.props.couponToDelete}
          onClose={this.props.closeDeleteModal}
          onSubmit={this.props.deleteCoupon}
        />
        <div className={classes.addButtonContainer}>
          <Fab
            color="primary"
            variant="extended"
            onClick={() =>
              this.setState({
                couponFormState: { open: true, initial: null },
              })
            }
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

const connector = connect(
  (state: RootState) => ({
    allCoupons: getAllCoupons(state),
    inactiveCoupons: getInactiveCoupons(state),
    activeCoupons: getActiveCoupons(state),
    loading: state.coupon.coupon.loading,
    createOrUpdateLoading: state.coupon.coupon.createOrUpdate.loading,
    tagsLoading: state.tag.tag.loading || state.tag.group.loading,
    paymentPacks: getPaymentPacks(state),
    shopItems: getShopItems(state),
    privatePasses: getPrivatePass(state),
    tagList: getallTagsWithTagGroup(state),
  }),
  {
    fetchCouponPage,
    deleteCouponAction: deleteCoupon,
    goToCoupon: (id: string) => push(`/coupon/${id}/`),
    fetchAllPaymentPacks,
    fetchAllShop,
    fetchPrivatePassList,
    fetchTags,
    createCouponAction: createCoupon,
    updateCouponAction: updateCoupon,
  },
);

const mapWithHandlers = {
  createCoupon:
    (props: ConnectedProps<typeof connector>) =>
    (data: Coupon, options?: OptionCallback<Coupon>) => {
      props.createCouponAction(data, {
        onSuccess: (couponCreated: Coupon) => {
          if (options && options.onSuccess) options.onSuccess(couponCreated);
          props.goToCoupon(couponCreated.id?.toString());
        },
      });
    },
  updateCoupon:
    (props: ConnectedProps<typeof connector>) =>
    (id: number, data: any, options?: OptionCallback<Coupon>) =>
      props.updateCouponAction(id, data, {
        onSuccess: (couponUpdated: Coupon) => {
          if (options && options.onSuccess) options.onSuccess(couponUpdated);
          props.goToCoupon(id?.toString());
        },
      }),
};
export default compose(
  withTranslation(['coupon']),
  connector,
  withStyles(styles),
  withState('couponToDelete', 'setCouponToDelete', null),
  withProps(({ setCouponToDelete, couponToDelete, deleteCouponAction }) => ({
    closeDeleteModal: () => setCouponToDelete(null),
    deleteCoupon: () => {
      deleteCouponAction(couponToDelete);
      setCouponToDelete(null);
    },
  })),
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) => t('titles:coupon.couponList')),
)(CouponList);
