import React, { Component, useCallback } from 'react';

import { compose, withHandlers } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { withRouter } from 'react-router';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items.js';
import isEqual from 'lodash/isEqual';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import themeSelector from '#src/libs/theme/selectors';

// marketplace
// -----------------------------
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#src/libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import { fetchPaymentComboList } from '#src/libs/payment-combo/actions';
import MarketplacePaymentPackList from '#src/libs/marketplace/components/@PaymentPack/MarketplacePaymentPackList';
import MarketplacePrivatePassList from '#src/libs/marketplace/components/@PrivatePass/MarketplacePrivatePassList';

// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { getPaymentPackCategoriesWithPacks } from '#src/libs/payment-packs/selectors';
// checkout
// -----------------------------
import { addItemToBasket } from '#src/libs/checkout/actions';
import { getCurrentBasket } from '#src/libs/checkout/selectors';

// private-service
// -----------------------------
import {
  fetchPrivatePassAsConsumerList,
  fetchAllPrivatePassCategory,
  fetchMarketplacePrivateServices,
  fetchMarketplacePrivateSlots,
} from '#src/libs/private-service/actions';
import { getPrivatePassAsConsumer } from '#src/libs/private-service/selectors/private-pass';

// payment-combo
// -----------------------------
import { getPaymentComboListAvailableOnline } from '#src/libs/payment-combo/selectors';
import {
  fetchMarketplacePacks,
  fetchAllPaymentPackCategory,
} from '#src/libs/payment-packs/actions';
import withTitle from '#src/hocs/with-title.hoc';

import { fetchMemberTagList } from '#src/libs/tag/actions';
import { getMemberTagsIdsList } from '#src/libs/tag/selectors';
import { getPrivatePassByCategoryWithPasses } from '#src/libs/private-service/selectors/private-pass-category';
import { MARKETPLACE_BREAKPOINT } from '#src/libs/marketplace/constants';
import {
  type MarketplaceCategoryPassFilterOption,
  type MarketplacePassDialogStateKey,
  MarketplacePassPageDialogState,
  type MarketplacePassParams,
  type OptionalWidgetConfig,
  PassTypes,
} from '#src/libs/marketplace/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';

import type { PaymentCombo } from '#src/libs/payment-combo/types';

import Carousel from '#src/components/css-only/Carousel';

import MarketplacePaymentComboCard from '#src/libs/marketplace/components/@PaymentCombo/MarketplacePaymentComboCard';
import {
  BaseAdditionalData,
  SearchItemData,
} from '#src/components/css-only/Search/Search.component';
import MarketplacePaymentComboList from '#src/libs/marketplace/components/@PaymentCombo/MarketplacePaymentComboList';

import {
  getParsedPassRestrictedCategories,
  getPassFilterAvailableCategories,
} from '#src/libs/marketplace/utils';
import { getAllEstablishmentsDict } from '#src/libs/establishment/selectors';
import { getMetaActivityAbstractDict } from '#src/libs/meta-activity/selectors';
import { _getPrivateServicesById } from '#src/libs/private-service/selectors/private-service';
import { getAllPrivateSlotsDict } from '#src/libs/private-service/selectors/private-slot';
import { MarketplacePassDialogsPortal } from './MarketplacePassDialogs.component';
import MarketplacePassFilters from './MarketplacePassFilters';
import { RootState } from '../../../reducers';
import analyticsUtils from '#src/components/analytics/analytics';

import './styles.css';

type OwnProps = {
  authenticated: boolean;
  params?: MarketplacePassParams;
  store: any;
  memberTagList: number[];
  companyId: number;
  requestSignUp?: () => void;
  toggleCurrentBasketOpen?: (open: boolean) => void;
  addComboToCart?: (id: number) => void;
  addPaymentPackToCart?: (id: number) => void;
  addPrivatePassToCart?: (id: number) => void;
  widgetContext: OptionalWidgetConfig;
  redirectToPassExpressCheckout: ({
    passId,
    passType,
  }: {
    passId: string;
    passType: string;
  }) => void;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  WithTranslation &
  typeof mapDispatchToProps;

type State = {
  dialogSelectedItem: (PaymentPack | PrivatePass | PaymentCombo) | null;
  isPaymentPackDetailsDialogOpen: boolean;
  isPaymentPackCompatibilityDialogOpen: boolean;
  isPaymentPackRestrictionDialogOpen: boolean;
  isPaymentPackOffPeakRestrictionDialogOpen: boolean;
  isPrivatePassDetailsDialogOpen: boolean;
  isPrivatePassCompatibilityDialogOpen: boolean;
  isPaymentComboDetailsDialogOpen: boolean;
  restrictedCategories: {
    paymentPack: number[] | null;
    privatePass: number[] | null;
  };
  passSearchFilters: {
    type: string;
    selectedCategories: (number | null)[];
    allCategories: MarketplaceCategoryPassFilterOption[];
  };
  passSearchResult: {
    query: string;
    paymentPack: number[] | null;
    privatePass: number[] | null;
    paymentCombo: number[] | null;
  };
};

type CarouselItemProps = {
  paymentCombo: PaymentCombo;
  isExcludingTax: boolean;
  handleOpenDialog: (
    key: MarketplacePassDialogStateKey,
    selectedItem?: PaymentPack | PrivatePass | PaymentCombo,
  ) => void;
  addComboToCart: (comboId: number) => void;
};

const CarouselItem = (props: CarouselItemProps) => {
  const { paymentCombo, isExcludingTax, handleOpenDialog, addComboToCart } =
    props;
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );

  const handleOpenDetailDialog = useCallback(() => {
    handleOpenDialog('isPaymentComboDetailsDialogOpen', paymentCombo);
    analyticsUtils.viewBuyableItem(paymentCombo);
  }, [handleOpenDialog, paymentCombo]);

  const handleMobileClick = useCallback(() => {
    if (isMobile) {
      handleOpenDialog('isPaymentComboDetailsDialogOpen', paymentCombo);
      analyticsUtils.viewBuyableItem(paymentCombo);
    }
  }, [handleOpenDialog, isMobile, paymentCombo]);

  const handleAddToCart = useCallback(() => {
    addComboToCart(paymentCombo.id);
    analyticsUtils.addItemToCart(paymentCombo);
  }, [addComboToCart, paymentCombo]);

  return (
    <MarketplacePaymentComboCard
      addToCart={handleAddToCart}
      isExcludingTax={isExcludingTax}
      onClick={handleMobileClick}
      onOpenDetailDialog={handleOpenDetailDialog}
      paymentCombo={paymentCombo}
    />
  );
};

export class MarketPlacePassPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dialogSelectedItem: null,
      isPaymentPackDetailsDialogOpen: false,
      isPaymentPackCompatibilityDialogOpen: false,
      isPaymentPackRestrictionDialogOpen: false,
      isPaymentPackOffPeakRestrictionDialogOpen: false,
      isPrivatePassDetailsDialogOpen: false,
      isPrivatePassCompatibilityDialogOpen: false,
      isPaymentComboDetailsDialogOpen: false,

      restrictedCategories: {
        paymentPack: null,
        privatePass: null,
      },

      passSearchFilters: {
        type: null,
        selectedCategories: [],
        allCategories: [],
      },

      passSearchResult: {
        query: '',
        paymentPack: null,
        privatePass: null,
        paymentCombo: null,
      },
    };
  }

  componentDidMount() {
    this.fetchData();

    const { paymentPackCategories, privatePassCategories } =
      getParsedPassRestrictedCategories(
        this.props.params.paymentPackCategories,
        this.props.params.privatePassCategories,
      );

    this.setState(
      {
        restrictedCategories: {
          paymentPack: paymentPackCategories,
          privatePass: privatePassCategories,
        },
      },
      () => this.setAvailableCategories(),
    );
  }

  fetchData = () => {
    this.props.fetchPaymentComboList({
      company: this.props.companyId,
      manager_only: false,
      include_expired: false,
      available: true,
    });
    this.props.fetchPaymentPacks({
      company: this.props.companyId,
      manager_only: false,
      disabled: false,
      as_consumer: true,
      page_size: 300,
      include_expired: false,
    });
    this.props.fetchPrivatePassAsConsumerList(this.props.companyId);
    this.props.fetchAllPaymentPackCategory(this.props.companyId);
    this.props.fetchAllPrivatePassCategory(this.props.companyId);
    this.props.fetchMarketplacePrivateServices(this.props.companyId);
    this.props.fetchMarketplacePrivateSlots(this.props.companyId);
    if (this.props.authenticated) {
      this.props.fetchMemberTagList(this.props.companyId);
    }
  };

  setAvailableCategories = () => {
    const availableCategories = getPassFilterAvailableCategories(
      this.props.paymentPackByCategory,
      this.props.privatePassByCategory,
      this.state.restrictedCategories,
      this.props.t,
    );

    this.setState((prevState) => {
      return {
        ...prevState,
        passSearchFilters: {
          ...prevState.passSearchFilters,
          allCategories: availableCategories,
        },
      };
    });
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.authenticated !== this.props.authenticated) {
      this.fetchData();
    }

    // get available categories for category filter
    if (
      this.props.privatePassByCategory?.length &&
      this.props.paymentPackByCategory?.length &&
      (!isEqual(
        prevProps.paymentPackByCategory,
        this.props.paymentPackByCategory,
      ) ||
        !isEqual(
          prevProps.privatePassByCategory,
          this.props.privatePassByCategory,
        ))
    ) {
      this.setAvailableCategories();
    }
  }

  addComboToCart = (comboId: number) => {
    if (this.props.addComboToCart) {
      this.props.addComboToCart(comboId);
      return;
    }

    if (!this.props.authenticated) {
      this.props.redirectToPassExpressCheckout({
        passId: comboId.toString(),
        passType: PassTypes.PAYMENTCOMBO,
      });
    } else if (this.props.currentBasket) {
      if (this.state.dialogSelectedItem) {
        analyticsUtils.addItemToCart(this.state.dialogSelectedItem);
      }
      this.handleCloseDialog(MarketplacePassPageDialogState.PaymentComboDetail);
      this.props.pushComboCheckout(comboId, this.props.currentBasket.id);
      this.props.toggleCurrentBasketOpen(true);
    }
  };

  addPaymentPackToCart = (packId: number) => {
    if (this.props.addPaymentPackToCart) {
      this.props.addPaymentPackToCart(packId);
      return;
    }

    if (!this.props.authenticated) {
      this.props.redirectToPassExpressCheckout({
        passId: packId.toString(),
        passType: PassTypes.PAYMENTPACK,
      });
    } else if (this.props.currentBasket) {
      if (this.state.dialogSelectedItem) {
        analyticsUtils.addItemToCart(this.state.dialogSelectedItem);
      }
      this.handleCloseDialog(MarketplacePassPageDialogState.PaymentPackDetail);
      this.props.pushPackCheckout(packId, this.props.currentBasket.id);
      this.props.toggleCurrentBasketOpen(true);
    }
  };

  addPrivatePassToCart = (packId: number) => {
    if (this.props.addPrivatePassToCart) {
      this.props.addPrivatePassToCart(packId);
      return;
    }

    if (!this.props.authenticated) {
      this.props.redirectToPassExpressCheckout({
        passId: packId.toString(),
        passType: PassTypes.PRIVATEPASS,
      });
    } else if (this.props.currentBasket) {
      if (this.state.dialogSelectedItem) {
        analyticsUtils.addItemToCart(this.state.dialogSelectedItem);
      }
      this.handleCloseDialog(MarketplacePassPageDialogState.PrivatePassDetail);
      this.props.pushPrivatePassCheckout(packId, this.props.currentBasket.id);
      this.props.toggleCurrentBasketOpen(true);
    }
  };

  handleSearchPressEnter = (
    searchResult: SearchItemData<BaseAdditionalData>[],
    searchText: string,
  ) => {
    const isPaymentComboHidden = this.props.params?.hidePaymentCombo === 'true';
    if (searchText.length && searchText !== this.state.passSearchResult.query) {
      this.setState({
        passSearchResult: {
          query: searchText,
          paymentPack:
            searchResult
              ?.filter(
                (searchItem: SearchItemData<BaseAdditionalData>) =>
                  searchItem.identifier === 'paymentPack',
              )
              .map((searchItem) => searchItem.id) ?? [],
          privatePass:
            searchResult
              ?.filter(
                (searchItem: SearchItemData<BaseAdditionalData>) =>
                  searchItem.identifier === 'privatePass',
              )
              .map((searchItem) => searchItem.id) ?? [],
          paymentCombo:
            searchResult
              ?.filter(
                (searchItem: SearchItemData<BaseAdditionalData>) =>
                  searchItem.identifier === 'paymentCombo',
              )
              .map((searchItem) => searchItem.id)
              .filter((searchItem) => !isPaymentComboHidden && searchItem) ??
            [],
        },
      });
    }
  };

  handleShowPaymentPackDetail = (id: number) => {
    let paymentPackList: PaymentPack[] = [];

    if (this.props.paymentPackByCategory.length) {
      paymentPackList = this.props.paymentPackByCategory
        .flatMap((category) => category.packs)
        .filter((pack) =>
          this.state.restrictedCategories.paymentPack?.length
            ? this.state.restrictedCategories.paymentPack.some(
                (category) => category === pack.category,
              )
            : pack,
        );
    }

    const paymentPack = paymentPackList.find(
      (pack: PaymentPack) => pack.id === id,
    );

    this.handleOpenDialog(
      MarketplacePassPageDialogState.PaymentPackDetail,
      paymentPack,
    );
  };

  handleShowPrivatePassDetail = (id: number) => {
    let privatePassList: PrivatePass[] = [];

    if (this.props.privatePassByCategory.length) {
      privatePassList = this.props.privatePassByCategory
        .flatMap((category) => category.passes)
        .filter((pass) =>
          this.state.restrictedCategories.privatePass
            ? this.state.restrictedCategories.privatePass.some(
                (category) => category === pass.category,
              )
            : pass,
        );
    }

    const privatePass = privatePassList.find((pass) => pass.id === id);

    this.handleOpenDialog(
      MarketplacePassPageDialogState.PrivatePassDetail,
      privatePass,
    );
  };

  handleShowPaymentComboDetail = (id: number) => {
    let paymentComboList: PaymentCombo[] = [];

    if (this.props.paymentComboList.length) {
      paymentComboList = this.props.paymentComboList;
    }

    const paymentCombo = paymentComboList.find(
      (combo: PaymentCombo) => combo.id === id,
    );

    this.handleOpenDialog(
      MarketplacePassPageDialogState.PaymentComboDetail,
      paymentCombo,
    );
  };

  handleClearSearchResult = () => {
    this.setState({
      passSearchResult: {
        query: '',
        paymentPack: null,
        privatePass: null,
        paymentCombo: null,
      },
    });
  };

  handlePassFilterChangeType = (option: string) => {
    this.setState((prevState: State) => {
      return {
        ...prevState,
        passSearchFilters: {
          ...prevState.passSearchFilters,
          type: option,
        },
      };
    });
  };

  handlePassFilterChangeCategory = (options: number[]) => {
    this.setState((prevState: State) => {
      return {
        ...prevState,
        passSearchFilters: {
          ...prevState.passSearchFilters,
          selectedCategories: options,
        },
      };
    });
  };

  handleOpenDialog = (
    key: MarketplacePassDialogStateKey,
    selectedItem?: PaymentPack | PrivatePass | PaymentCombo,
  ) => {
    if (selectedItem) {
      //      Analytics.selectPaymentPack(selectedItem);
      return this.setState((prevState) => {
        return {
          ...prevState,
          dialogSelectedItem: selectedItem,
          [key]: true,
        };
      });
    }
    return this.setState((prevState) => {
      return {
        ...prevState,
        [key]: true,
      };
    });
  };

  handleCloseDialog = (key: MarketplacePassDialogStateKey) => {
    return this.setState((prevState) => {
      return {
        ...prevState,
        [key]: false,
      };
    });
  };

  getCarouselRenderItem = (paymentCombo: PaymentCombo) => (
    <CarouselItem
      addComboToCart={this.addComboToCart}
      handleOpenDialog={this.handleOpenDialog}
      isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
      paymentCombo={paymentCombo}
    />
  );

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    const hidePaymentPack = this.props.params?.hidePaymentPack === 'true';
    const hidePrivatePass = this.props.params?.hidePrivatePass === 'true';
    const hidePaymentCombo = this.props.params?.hidePaymentCombo === 'true';
    const hideFilters = this.props.params?.hideFilters === 'true';

    return (
      <div className="bs-pass-page">
        {!hidePaymentCombo &&
          !this.state.passSearchResult.query &&
          !!this.props.paymentComboList.length && (
            <div className="bs-pass-page__carousel__container">
              <Carousel
                data={this.props.paymentComboList}
                renderItem={this.getCarouselRenderItem}
              />
            </div>
          )}

        <div className="bs-pass-page__list__filters__container">
          {!hideFilters && (
            <MarketplacePassFilters
              addComboToCart={this.addComboToCart}
              addPaymentPackToCart={this.addPaymentPackToCart}
              addPrivatePassToCart={this.addPrivatePassToCart}
              hidePaymentCombo={hidePaymentCombo}
              hidePaymentPack={hidePaymentPack}
              hidePrivatePass={hidePrivatePass}
              isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
              onChangeCategory={this.handlePassFilterChangeCategory}
              onChangeType={this.handlePassFilterChangeType}
              onClearSearchResult={this.handleClearSearchResult}
              onSearchPressEnter={this.handleSearchPressEnter}
              onShowPaymentComboDetail={this.handleShowPaymentComboDetail}
              onShowPaymentPackDetail={this.handleShowPaymentPackDetail}
              onShowPrivatePassDetail={this.handleShowPrivatePassDetail}
              paymentComboList={this.props.paymentComboList}
              paymentPackByCategory={this.props.paymentPackByCategory}
              privatePassByCategory={this.props.privatePassByCategory}
              restrictedPaymentPackCategories={
                this.state.restrictedCategories.paymentPack
              }
              restrictedPrivatePassCategories={
                this.state.restrictedCategories.privatePass
              }
              searchFiltersState={this.state.passSearchFilters}
              searchResultState={this.state.passSearchResult}
            />
          )}

          {!!this.state.passSearchResult.query &&
            !!this.state.passSearchResult.paymentCombo.length &&
            !hidePaymentCombo && (
              <div className="bs-pass-page__list">
                <MarketplacePaymentComboList
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                  onAddBasket={this.addComboToCart}
                  paymentComboList={this.props.paymentComboList}
                  searchedPaymentCombo={
                    this.state.passSearchResult.paymentCombo
                  }
                  setSelectedPass={this.handleShowPaymentComboDetail}
                />
              </div>
            )}

          {!hidePaymentPack &&
            this.state.passSearchFilters.type !== 'privatePass' && (
              <div className="bs-pass-page__list">
                <MarketplacePaymentPackList
                  hideCredits={this.props.theme.hide_credits_for_customers}
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                  paymentPackByCategory={this.props.paymentPackByCategory}
                  pushPackCheckout={this.addPaymentPackToCart}
                  restrictedPaymentPackCategories={
                    this.state.restrictedCategories.paymentPack
                  }
                  searchedPaymentPack={this.state.passSearchResult.paymentPack}
                  selectedCategories={
                    this.state.passSearchFilters.selectedCategories
                  }
                  setSelectedPass={this.handleShowPaymentPackDetail}
                />
              </div>
            )}

          {!hidePrivatePass &&
            this.state.passSearchFilters.type !== 'paymentPack' && (
              <div className="bs-pass-page__list">
                <MarketplacePrivatePassList
                  hideCredits={this.props.theme.hide_credits_for_customers}
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                  onAddBasket={this.addPrivatePassToCart}
                  privatePassByCategory={this.props.privatePassByCategory}
                  restrictedPrivatePassCategories={
                    this.state.restrictedCategories.privatePass
                  }
                  searchedPrivatePass={this.state.passSearchResult.privatePass}
                  selectedCategories={
                    this.state.passSearchFilters.selectedCategories
                  }
                  setSelectedPass={this.handleShowPrivatePassDetail}
                />
              </div>
            )}
        </div>

        <MarketplacePassDialogsPortal
          addComboToCart={this.addComboToCart}
          addPaymentPackToCart={this.addPaymentPackToCart}
          addPrivatePassToCart={this.addPrivatePassToCart}
          dialogSelectedItem={this.state.dialogSelectedItem}
          establishments={this.props.establishments}
          handleCloseDialog={this.handleCloseDialog}
          handleOpenDialog={this.handleOpenDialog}
          hideCredits={this.props.theme.hide_credits_for_customers}
          isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
          isPaymentComboDetailsDialogOpen={
            this.state.isPaymentComboDetailsDialogOpen
          }
          isPaymentPackCompatibilityDialogOpen={
            this.state.isPaymentPackCompatibilityDialogOpen
          }
          isPaymentPackDetailsDialogOpen={
            this.state.isPaymentPackDetailsDialogOpen
          }
          isPaymentPackOffPeakRestrictionDialogOpen={
            this.state.isPaymentPackOffPeakRestrictionDialogOpen
          }
          isPaymentPackRestrictionDialogOpen={
            this.state.isPaymentPackRestrictionDialogOpen
          }
          isPrivatePassCompatibilityDialogOpen={
            this.state.isPrivatePassCompatibilityDialogOpen
          }
          isPrivatePassDetailsDialogOpen={
            this.state.isPrivatePassDetailsDialogOpen
          }
          metaActivities={this.props.metaActivities}
          privateServices={this.props.privateServices}
          privateSlots={this.props.privateSlots}
          widgetContext={this.props.widgetContext}
        />
      </div>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  {
    memberTagList,
    authenticated,
  }: { memberTagList: number[]; authenticated: boolean },
) => {
  const resolvedMemberTagList = memberTagList ?? getMemberTagsIdsList(state);
  const resolvedAuthenticated = authenticated ?? state.auth.authenticated;

  return {
    currentBasket: getCurrentBasket(state),
    theme: themeSelector.getTheme(state),
    paymentComboList: getPaymentComboListAvailableOnline(state),
    loading: state.paymentPack.loading,
    establishmentLoading: state.establishment.bulkRetrieve.loading,
    activityLoading: state.metaActivity.loading,
    paymentPackByCategory: getPaymentPackCategoriesWithPacks(
      state,
      resolvedAuthenticated,
      resolvedMemberTagList,
    ),
    memberTagList: resolvedMemberTagList,
    authenticated: resolvedAuthenticated,
    privatePassByCategory: getPrivatePassByCategoryWithPasses(
      getPrivatePassAsConsumer,
    )(state),
    establishments: getAllEstablishmentsDict(state),
    metaActivities: getMetaActivityAbstractDict(state),
    privateServices: _getPrivateServicesById(state),
    privateSlots: getAllPrivateSlotsDict(state),
  };
};

const mapDispatchToProps = {
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchPaymentPacks: fetchMarketplacePacks,
  fetchAllPaymentPackCategory,
  fetchPrivatePassAsConsumerList,
  fetchAllPrivatePassCategory,
  fetchMarketplacePrivateServices,
  fetchMarketplacePrivateSlots,
  pushPrivatePassCheckout: (packId: number, basketId: string) =>
    addItemToBasket(basketId, {
      buyable_item_identifier: BUYABLE_ITEM_PRIVATE_PASS,
      quantity: 1,
      buyable_item_id: packId,
      extra_data: {},
    }),
  pushPackCheckout: (packId: number, basketId: string) =>
    addItemToBasket(basketId, {
      buyable_item_identifier: BUYABLE_ITEM_PASS,
      quantity: 1,
      buyable_item_id: packId,
      extra_data: {},
    }),
  pushComboCheckout: (comboId: number, basketId: string) =>
    addItemToBasket(basketId, {
      buyable_item_identifier: BUYABLE_ITEM_COMBO_ITEM,
      quantity: 1,
      buyable_item_id: comboId,
      extra_data: {},
    }),
  fetchPaymentComboList,
  fetchMemberTagList,
};

export const MarketplacePassBase = compose<any, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    fetchPaymentPacks:
      ({ fetchPaymentPacks, fetchEstablishmentBulk, fetchMetaActivityBulk }) =>
      (params: any) =>
        fetchPaymentPacks(params, {
          onSuccess: (packList: Array<any>) => {
            fetchEstablishmentBulk(
              [...packList.map((pp) => pp.establishments)].flat(2),
            );
            fetchMetaActivityBulk(
              packList.map((pp) => pp.metaActivities).flat(2),
            );
          },
        }),
  }),
  withTranslation(),
  marketplaceCssHoc(),
)(MarketPlacePassPage);

export default compose<any, OwnProps>(
  withRouter,
  routerParamsToProps({ companyId: 'companyId:number' }),
  withQueryParams([
    [
      'hideFilters',
      'hidePaymentPack',
      'hidePrivatePass',
      'hidePaymentCombo',
      'paymentPackCategories',
      'privatePassCategories',
    ],
    'params',
  ]),
  withTranslation(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplacePass'),
  ),
  marketplaceCssHoc(),
)(MarketplacePassBase);
