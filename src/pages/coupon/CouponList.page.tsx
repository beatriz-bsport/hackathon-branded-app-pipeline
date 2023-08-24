// @ts-nocheck
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
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
import { CouponKind } from '@bsport/common/lib/master-data/coupon';
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
  createUniqueCodeCoupon,
  updateUniqueCodeCoupon,
  retrieveCoupon,
} from '#libs/coupon/actions';
import {
  getActiveCoupons,
  getInactiveCoupons,
  getAllCoupons,
  withTags,
} from '#libs/coupon/selectors';
import type {
  Coupon,
  UniqueCodeCouponCreationPayload,
  UniqueCodeCouponUpdatePayload,
} from '#libs/coupon/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import CouponFormDrawer from '#libs/coupon/components/CouponFormDrawer.component';
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchPaymentPackBulk as fetchSelectedPaymentPacks,
  resetDisabledPaymentPack as resetDisabledPaymentPackAction,
} from '#libs/payment-packs/actions';
import {
  fetchBulk as fetchSelectedShopItems,
  fetchShopItemAsManager as fetchAllShop,
} from '#libs/shop/actions/shopitem';
import {
  fetchPrivateSlotBulk as fetchSelectedPrivatePasses,
  fetchPrivatePassList,
} from '#libs/private-service/actions';
import {
  fetchPaymentComboBulk as fetchSelectedPaymentCombos,
  fetchPaymentComboList,
} from '#libs/payment-combo/actions';
import { fetchTags } from '#libs/tag/actions';
import {
  getPaymentPackById,
  getEnabled as getPaymentPacks,
} from '#libs/payment-packs/selectors';
import {
  getAllShopItemData,
  getShopItemsAvailable as getShopItems,
} from '#libs/shop/selectors';
import {
  getPrivatePassById,
  getPrivatePassAvailable as getPrivatePass,
} from '#libs/private-service/selectors/private-pass';
import {
  getPaymenComboDataDict,
  getPaymentComboList,
} from '#libs/payment-combo/selectors';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import type {
  OptionCallback,
  OptionCallBackWithKeyedCallbacks,
} from '../../state/types';
import type { RootState } from '../../reducers';
import FabWithItems from '#components/button/FabWithItems';
import UniqueCodeCouponFormDrawer from '#libs/coupon/components/UniqueCodeCouponForm/UniqueCodeCouponForm.drawer';
import { CouponErrorCodes } from '#libs/coupon/constants';

type OwnProps = {
  couponToDelete: (id: string) => void;
  setCouponToDelete: (id: number) => void;
  closeDeleteModal: () => void;
  deleteCoupon: (id: string) => void;
  classes: Object;
  fetchSelectedPaymentCombos: (
    params: { company: Number; id__in?: Number[] },
    options?: OptionCallback<PaymentCombo[]>,
  ) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  ConnectedProps<typeof connector> &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  searchText: string;
  searchResult: Array<PaymentCombo>;
  couponFormState: { open: boolean; initial?: Coupon };
  uniqueCodeCouponFormState: { open: boolean; initial?: Coupon };
};

export class CouponList extends React.PureComponent<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
    couponFormState: { open: false, initial: null as Coupon },
    uniqueCodeCouponFormState: { open: false, initial: null as Coupon },
  };

  componentDidMount() {
    this.props.fetchCouponPage(1);
    this.props.fetchPaymentPackList({ disabled: false, page_size: 70000 });
    this.props.fetchAllShop();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
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
            const id = this.state.couponFormState.initial?.id;
            this.setState({
              couponFormState: {
                open: false,
                initial: null,
              },
            });
            this.props.fetchCouponPage(1);
            if (options && options.onSuccess) options.onSuccess(id);
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

  createOrUpdateUniqueCodeCoupon = (
    data: UniqueCodeCouponCreationPayload,
    options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => {
    if (this.state.uniqueCodeCouponFormState.initial?.id) {
      return this.props.updateUniqueCodeCoupon(
        this.state.uniqueCodeCouponFormState.initial.id,
        data,
        {
          onSuccess: (couponUpdated) => {
            this.setState({
              uniqueCodeCouponFormState: {
                open: false,
                initial: null,
              },
            });
            if (options && options.onSuccess) options.onSuccess(couponUpdated);
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
          [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT]:
            () => {
              if (
                options &&
                options[
                  CouponErrorCodes
                    .UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT
                ]
              )
                options[
                  CouponErrorCodes
                    .UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT
                ]();
            },
          [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT]:
            () => {
              if (
                options &&
                options[
                  CouponErrorCodes
                    .UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT
                ]
              )
                options[
                  CouponErrorCodes
                    .UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT
                ]();
            },
        },
      );
    }
    return this.props.createUniqueCodeCoupon(data, {
      onSuccess: () => {
        this.setState({
          uniqueCodeCouponFormState: {
            open: false,
            initial: null,
          },
        });
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
      [CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS]: () => {
        if (
          options &&
          options[CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS]
        )
          options[
            CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS
          ]();
      },
    });
  };

  onCloseFormDrawer = () =>
    this.setState({ couponFormState: { open: false, initial: null } });

  onOpenFormDrawer = () =>
    this.setState({
      couponFormState: { open: true, initial: null },
    });

  onOpenUniqueCodeCouponFormDrawer = () => {
    this.setState({
      uniqueCodeCouponFormState: { open: true, initial: null },
    });
  };

  onCloseUniqueCodeCouponFormDrawer = () => {
    this.setState({
      uniqueCodeCouponFormState: { open: false, initial: null },
    });
  };

  onEditCouponListItem = (couponSelected: Coupon) => {
    if (
      couponSelected.coupon_type === CouponKind.COUPON_VIA_UNIQUE_CODE_PER_USAGE
    ) {
      this.setState({
        uniqueCodeCouponFormState: {
          open: true,
          initial: couponSelected,
        },
      });
    } else {
      this.setState({
        couponFormState: {
          open: true,
          initial: couponSelected,
        },
      });
    }
  };

  onEditCouponListComponent = (couponSelected: Coupon) => {
    if (
      couponSelected.coupon_type === CouponKind.COUPON_VIA_UNIQUE_CODE_PER_USAGE
    ) {
      this.setState({
        uniqueCodeCouponFormState: {
          open: true,
          initial: couponSelected,
        },
      });
    } else {
      this.setState(
        {
          couponFormState: {
            open: true,
            initial: couponSelected,
          },
        },
        () => this.props.fetchPaymentPackList({ page_size: 70000 }),
      );
    }
  };

  componentWillUnmount() {
    this.props.resetDisabledPaymentPack();
  }

  fabItems = [
    {
      label: this.props.t('fabLabels.voucherCodes'),
      onClick: this.onOpenUniqueCodeCouponFormDrawer,
    },
    {
      label: this.props.t('fabLabels.discountCode'),
      onClick: this.onOpenFormDrawer,
    },
  ];

  render() {
    const { classes, t } = this.props;

    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        {this.props.inactiveCoupons.length === 0 &&
        this.props.activeCoupons.length === 0 &&
        !this.props.loading ? (
          <IsEmptyList
            button={this.props.t('createCoupon')}
            onCreate={() =>
              this.setState({ couponFormState: { open: true, initial: null } })
            }
            text={this.props.t('list.isEmpty')}
          />
        ) : (
          <div>
            <div className={classes.search}>
              <FuzeSearch
                changeSearch={this.changeSearch}
                clearSearch={this.clearSearch}
                items={this.props.allCoupons}
                placeholder={t('search')}
                searchFields={['name']}
                searchResult={this.state.searchResult}
                searchText={this.state.searchText}
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
                  <List dense disablePadding>
                    {this.state.searchResult.map((coupon) => (
                      <CouponListItem
                        key={coupon.id}
                        divider
                        coupon={coupon}
                        onClick={() => this.props.goToCoupon(coupon.id)}
                        onDelete={this.props.setCouponToDelete}
                        onEdit={this.onEditCouponListItem}
                      />
                    ))}
                  </List>
                </Collapse>
              </Paper>
            </div>

            <CouponListComponent
              activeCoupons={this.props.activeCoupons}
              goToCoupon={this.props.goToCoupon}
              inactiveCoupons={this.props.inactiveCoupons}
              onEdit={this.onEditCouponListComponent}
              setCouponToDelete={this.props.setCouponToDelete}
            />
          </div>
        )}
        <CouponFormDrawer
          allPaymentCombosById={this.props.allPaymentCombosById}
          allPaymentPacksById={this.props.allPaymentPacksById}
          allPrivatePassesById={this.props.allPrivatePassesById}
          allShopItemsById={this.props.allShopItemsById}
          fetchSelectedPaymentCombos={this.props.fetchSelectedPaymentCombos}
          fetchSelectedPaymentPacks={this.props.fetchSelectedPaymentPacks}
          fetchSelectedPrivatePasses={this.props.fetchSelectedPrivatePasses}
          fetchSelectedShopItems={this.props.fetchSelectedShopItems}
          initial={this.state.couponFormState.initial}
          onCancel={this.onCloseFormDrawer}
          onClose={this.onCloseFormDrawer}
          onSubmit={this.createOrUpdateCoupon}
          open={this.state.couponFormState.open}
          paymentCombos={this.props.paymentCombos}
          paymentPacks={this.props.paymentPacks}
          privatePasses={this.props.privatePasses}
          processing={this.props.createOrUpdateLoading}
          shopItems={this.props.shopItems}
          tagList={this.props.tagList}
          tagsLoading={this.props.tagsLoading}
        />
        <UniqueCodeCouponFormDrawer
          isLoading={this.props.loading}
          isProcessing={this.props.createOrUpdateLoading}
          onCancel={this.onCloseUniqueCodeCouponFormDrawer}
          onSubmit={this.createOrUpdateUniqueCodeCoupon}
          open={this.state.uniqueCodeCouponFormState.open}
          paymentCombos={this.props.paymentCombos}
          paymentCombosById={this.props.allPaymentCombosById}
          paymentPacks={this.props.paymentPacks}
          paymentPacksById={this.props.allPaymentPacksById}
          privatePasses={this.props.privatePasses}
          privatePassesById={this.props.allPrivatePassesById}
          shopItems={this.props.shopItems}
          shopItemsById={this.props.allShopItemsById}
          uniqueCodeCoupon={this.state.uniqueCodeCouponFormState.initial}
        />

        <CouponDeleteModal
          onClose={this.props.closeDeleteModal}
          onSubmit={this.props.deleteCoupon}
          open={!!this.props.couponToDelete}
        />
        {(!!this.props.inactiveCoupons?.length ||
          !!this.props.activeCoupons?.length) && (
          <div className={classes.addButtonContainer}>
            <FabWithItems items={this.fabItems} label={t('createCoupon')} />
          </div>
        )}
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
    allCoupons: withTags(getAllCoupons)(state),
    inactiveCoupons: getInactiveCoupons(state),
    activeCoupons: withTags(getActiveCoupons)(state),
    loading: state.coupon.coupon.loading,
    createOrUpdateLoading: state.coupon.coupon.createOrUpdate.loading,
    tagsLoading: state.tag.tag.loading || state.tag.group.loading,
    paymentPacks: getPaymentPacks(state),
    allPaymentPacksById: getPaymentPackById(state),
    shopItems: getShopItems(state),
    allShopItemsById: getAllShopItemData(state),
    paymentCombos: getPaymentComboList(state),
    allPaymentCombosById: getPaymenComboDataDict(state),
    privatePasses: getPrivatePass(state),
    allPrivatePassesById: getPrivatePassById(state),
    tagList: getAllTagsWithTagGroup(state),
  }),
  {
    fetchCouponPage,
    deleteCouponAction: deleteCoupon,
    goToCoupon: (id: string) => push(`/coupon/${id}/`),
    fetchPaymentPackList: fetchPaymentPackListAction,
    fetchSelectedPaymentPacks,
    fetchAllShop,
    fetchSelectedShopItems,
    fetchPrivatePassList,
    fetchSelectedPrivatePasses,
    fetchPaymentComboList,
    fetchSelectedPaymentCombos,
    fetchTags,
    createCouponAction: createCoupon,
    updateCouponAction: updateCoupon,
    createUniqueCodeCouponAction: createUniqueCodeCoupon,
    updateUniqueCodeCouponAction: updateUniqueCodeCoupon,
    resetDisabledPaymentPack: resetDisabledPaymentPackAction,
    retrieveCoupon,
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
  createUniqueCodeCoupon:
    (props: ConnectedProps<typeof connector>) =>
    (
      data: UniqueCodeCouponCreationPayload,
      options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
    ) => {
      props.createUniqueCodeCouponAction(data, {
        onSuccess: (couponCreated: Coupon) => {
          if (options && options.onSuccess) options.onSuccess(couponCreated);
          props.goToCoupon(couponCreated.id?.toString());
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
        [CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS]: () => {
          if (
            options &&
            options[
              CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS
            ]
          )
            options[
              CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS
            ]();
        },
      });
    },
  updateUniqueCodeCoupon:
    (props: ConnectedProps<typeof connector>) =>
    (
      id: number,
      data: UniqueCodeCouponUpdatePayload,
      options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
    ) => {
      props.updateUniqueCodeCouponAction(id, data, {
        onSuccess: (couponUpdated: Coupon) => {
          if (options && options.onSuccess) options.onSuccess(couponUpdated);
          props.goToCoupon(couponUpdated.id?.toString());
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
        [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT]:
          () => {
            if (
              options &&
              options[
                CouponErrorCodes
                  .UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT
              ]
            )
              options[
                CouponErrorCodes
                  .UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT
              ]();
          },
        [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT]:
          () => {
            if (
              options &&
              options[
                CouponErrorCodes
                  .UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT
              ]
            )
              options[
                CouponErrorCodes
                  .UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT
              ]();
          },
      });
    },
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
