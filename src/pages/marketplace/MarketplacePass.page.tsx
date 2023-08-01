import React, { Component, useCallback } from 'react';

import { compose, withHandlers } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Theme, useMediaQuery, useTheme } from '@material-ui/core';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { withRouter } from 'react-router';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import isEqual from 'lodash/isEqual';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import themeSelector from '#libs/theme/selectors';

// marketplace
// -----------------------------
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import { fetchPaymentComboList } from '#libs/payment-combo/actions';
import MarketplacePaymentPackList from '#libs/marketplace/components/MarketplacePaymentPackList.component';
import MarketplacePrivatePassList from '#libs/marketplace/components/MarketplacePrivatePassList.component';

// @ts-ignore
import withQueryParams from '#hocs/with-query-params.hoc';
// @ts-ignore
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { getPaymentPackCategoriesWithPacks } from '#libs/payment-packs/selectors';
// checkout
// -----------------------------
import { addItemToBasket } from '#libs/checkout/actions';
import { getCurrentBasket } from '#libs/checkout/selectors';

// private-service
// -----------------------------
import {
  fetchPrivatePassAsConsumerList,
  fetchAllPrivatePassCategory,
  fetchMarketplacePrivateServices,
  fetchMarketplacePrivateSlots,
} from '#libs/private-service/actions';
import { getPrivatePassAsConsumer } from '#libs/private-service/selectors/private-pass';

// payment-combo
// -----------------------------
import { getPaymentComboListAvailableOnline } from '#libs/payment-combo/selectors';
import {
  fetchMarketplacePacks,
  fetchAllPaymentPackCategory,
} from '#libs/payment-packs/actions';
import withTitle from '#hocs/with-title.hoc';
import { RootState } from '../../reducers';

import { fetchMemberTagList } from '#libs/tag/actions';
import { getMemberTagsIdsList } from '#libs/tag/selectors';
import { getPrivatePassByCategoryWithPasses } from '#libs/private-service/selectors/private-pass-category';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import {
  MarketplaceCategoryPassFilterOption,
  MarketplacePassDialogStateKey,
  MarketplacePassPageDialogState,
} from '#libs/marketplace/types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import Carousel from '#components/css-only/Carousel';
import { PaymentCombo } from '#libs/payment-combo/types';
import MarketplacePaymentComboCard from '#libs/marketplace/components/MarketplacePaymentComboCard';
import {
  BaseAdditionalData,
  SearchItemData,
} from '#components/css-only/Search/Search.component';
import MarketplacePaymentComboList from '#libs/marketplace/components/MarketplacePaymentComboList.component';
import MarketplacePassFilters from './MarketplacePassFilters.component';
import {
  getParsedPassRestrictedCategories,
  getPassFilterAvailableCategories,
} from '#libs/marketplace/utils';
import MarketplacePassDialogs from './MarketplacePassDialogs.component';
import { MaterialStyleType } from '../../utils/types';
import { getAllEstablishmentsDict } from '#libs/establishment/selectors';
import { getMetaActivityAbstractDict } from '#libs/meta-activity/selectors';
import { _getPrivateServicesById } from '#libs/private-service/selectors/private-service';
import { getAllPrivateSlotsDict } from '#libs/private-service/selectors/private-slot';

type OwnProps = {
  authenticated: boolean;
  params?: {
    hideFilters?: string;
    hidePaymentPack?: string;
    hidePrivatePass?: string;
    hidePaymentCombo?: string;
    paymentPackCategories?: any;
    privatePassCategories?: any;
  };
  companyId: number;
  requestSignUp: () => void;
  toggleCurrentBasketOpen: (open: boolean) => void;
  addComboToCart?: (id: number) => void;
  addPaymentPackToCart?: (id: number) => void;
  addPrivatePassToCart?: (id: number) => void;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  MaterialStyleType<ReturnType<typeof styles>> &
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
  }, [handleOpenDialog, paymentCombo]);

  const handleMobileClick = useCallback(() => {
    if (isMobile) {
      handleOpenDialog('isPaymentComboDetailsDialogOpen', paymentCombo);
    }
  }, [handleOpenDialog, isMobile, paymentCombo]);

  const handleAddToCart = useCallback(() => {
    addComboToCart(paymentCombo.id);
  }, [addComboToCart, paymentCombo.id]);

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
    this.props.fetchMemberTagList(this.props.companyId);
    this.props.fetchMarketplacePrivateServices(this.props.companyId);
    this.props.fetchMarketplacePrivateSlots(this.props.companyId);
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
      this.props.requestSignUp();
    } else if (this.props.currentBasket) {
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
      this.props.requestSignUp();
    } else if (this.props.currentBasket) {
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
      this.props.requestSignUp();
    } else if (this.props.currentBasket) {
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
      <>
        {!hidePaymentCombo &&
          !this.state.passSearchResult.query &&
          !!this.props.paymentComboList.length && (
            <Grid
              container
              className={this.props.classes.carouselContainer}
              direction="row"
            >
              <Carousel
                data={this.props.paymentComboList}
                renderItem={this.getCarouselRenderItem}
              />
            </Grid>
          )}

        <Grid
          container
          className={this.props.classes.container}
          direction="row"
        >
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
              <div className={this.props.classes.marketplaceList}>
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
              <div className={this.props.classes.marketplaceList}>
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
              <div className={this.props.classes.marketplaceList}>
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
        </Grid>

        <MarketplacePassDialogs
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
        />
      </>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    marketplaceList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
      padding: theme.spacing(6),
      paddingTop: theme.spacing(4),
      maxWidth: '1652px',
      margin: '0 auto',
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(2),
      },
    },
    carouselContainer: {
      padding: theme.spacing(6),
      paddingTop: theme.spacing(2),
      paddingBottom: 0,
      maxWidth: '1652px',
      margin: '0 auto',
      [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.MD)]: {
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
      },
    },
  });

const mapMemberInfoStateToProps = (
  // Have to do this separation here for widget purpose

  state: RootState,
  {
    memberTagList,
    authenticated,
  }: { memberTagList: number[]; authenticated: boolean },
) => ({
  memberTagList: memberTagList || getMemberTagsIdsList(state),
  authenticated: authenticated || state.auth.authenticated,
});
const mapStateToProps = (
  state: RootState,
  {
    memberTagList,
    authenticated,
  }: { memberTagList: number[]; authenticated: boolean },
) => ({
  currentBasket: getCurrentBasket(state),
  theme: themeSelector.getTheme(state),
  paymentComboList: getPaymentComboListAvailableOnline(state),
  loading: state.paymentPack.loading,
  establishmentLoading: state.establishment.bulkRetrieve.loading,
  activityLoading: state.metaActivity.loading,
  paymentPackByCategory: getPaymentPackCategoriesWithPacks(
    state,
    authenticated,
    memberTagList,
  ),
  privatePassByCategory: getPrivatePassByCategoryWithPasses(
    getPrivatePassAsConsumer,
  )(state),
  establishments: getAllEstablishmentsDict(state),
  metaActivities: getMetaActivityAbstractDict(state),
  privateServices: _getPrivateServicesById(state),
  privateSlots: getAllPrivateSlotsDict(state),
});

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
  withStyles(styles),
  connect(mapMemberInfoStateToProps),
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
  withStyles(styles),
  marketplaceCssHoc(),
)(MarketplacePassBase);
