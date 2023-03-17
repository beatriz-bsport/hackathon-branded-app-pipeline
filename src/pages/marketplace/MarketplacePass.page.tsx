import React, { Component, useCallback } from 'react';

import { compose, withProps } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
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
import themeSelector from '#libs/theme/selectors';

// marketplace
// -----------------------------
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import { fetchPaymentComboList } from '#libs/payment-combo/actions';
import MarketplacePaymentPackList from '#libs/marketplace/components/MarketplacePaymentPackList.component';
import MarketplacePrivatePassList from '#libs/marketplace/components/MarketplacePrivatePassList.component';

import withQueryParams from '#hocs/with-query-params.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import {
  getMarketplacePaymentPacks,
  excludeUnaccessiblePacks,
  groupByCategory,
  withMetaActivities,
  withEstablishments,
} from '#libs/payment-packs/selectors';
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
import {
  getPrivatePassAsConsumer,
  withServices,
} from '#libs/private-service/selectors/private-pass';

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
import type { Tag } from '#libs/tag/types';
import { getPrivatePassByCategoryWithPasses } from '#libs/private-service/selectors/private-pass-category';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import {
  MarketplaceCategoryPassFilterOption,
  MarketplacePassDialogStateKey,
  MarketplacePassPageDialogState,
  MarketplacePassPagePrivatePass,
} from '#libs/marketplace/types';
import {
  PaymentPack,
  PaymentPackCategoryWithPacks,
} from '#libs/payment-packs/types';
import { PrivatePassCategoryWithPasses } from '#libs/private-service/types';
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

type OwnProps = {
  authenticated: boolean;
  params?: {
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
  dialogSelectedItem:
    | (PaymentPack | MarketplacePassPagePrivatePass | PaymentCombo)
    | null;
  isPaymentPackDetailsDialogOpen: boolean;
  isPaymentPackCompatibilityDialogOpen: boolean;
  isPaymentPackRestrictionDialogOpen: boolean;
  isPrivatePassDetailsDialogOpen: boolean;
  isPrivatePassCompatibilityDialogOpen: boolean;
  isPaymentComboDetailsDialogOpen: boolean;
  restrictedCategories: {
    paymentPack: number[] | null;
    privatePass: number[] | null;
  };
  passSearchFilters: {
    type: MarketplaceCategoryPassFilterOption;
    selectedCategories: MarketplaceCategoryPassFilterOption[];
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
    selectedItem?: PaymentPack | MarketplacePassPagePrivatePass | PaymentCombo,
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
      paymentCombo={paymentCombo}
      addToCart={handleAddToCart}
      onOpenDetailDialog={handleOpenDetailDialog}
      isExcludingTax={isExcludingTax}
      onClick={handleMobileClick}
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

    this.setState({
      restrictedCategories: {
        paymentPack: paymentPackCategories,
        privatePass: privatePassCategories,
      },
    });
  }

  fetchData = () => {
    this.props.fetchPaymentComboList({
      company: this.props.companyId,
      manager_only: false,
    });
    this.props.fetchPaymentPacks({
      company: this.props.companyId,
      manager_only: false,
      disabled: false,
      as_consumer: true,
      page_size: 300,
    });
    this.props.fetchPrivatePassAsConsumerList(this.props.companyId);
    this.props.fetchAllPaymentPackCategory(this.props.companyId);
    this.props.fetchAllPrivatePassCategory(this.props.companyId);
    this.props.fetchMemberTagList(this.props.companyId);
    this.props.fetchMarketplacePrivateServices(this.props.companyId);
    this.props.fetchMarketplacePrivateSlots(this.props.companyId);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.authenticated !== this.props.authenticated) {
      this.fetchData();
    }

    // get available categories for category filter
    if (
      this.props.privatePassByCategory?.length &&
      this.props.paymentPackByCategory?.length &&
      (prevProps.paymentPackByCategory !== this.props.paymentPackByCategory ||
        prevProps.privatePassByCategory !== this.props.privatePassByCategory)
    ) {
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
    }
  }

  addComboToCart = (comboId: number) => {
    if (this.props.addComboToCart) {
      this.props.addComboToCart(comboId);
      return;
    }

    if (!this.props.authenticated) {
      this.props.requestSignUp();
    } else {
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
    } else {
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
    } else {
      this.handleCloseDialog(MarketplacePassPageDialogState.PrivatePassDetail);
      this.props.pushPrivatePassCheckout(packId, this.props.currentBasket.id);
      this.props.toggleCurrentBasketOpen(true);
    }
  };

  handleSearchPressEnter = (
    searchResult: SearchItemData<BaseAdditionalData>[],
    searchText: string,
  ) => {
    if (searchText !== this.state.passSearchResult.query) {
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
              .map((searchItem) => searchItem.id) ?? [],
        },
      });
    }
  };

  handleShowPaymentPackDetail = (id: number) => {
    let paymentPackList: PaymentPack[] = [];

    if (this.props.paymentPackByCategory.length) {
      paymentPackList = this.props.paymentPackByCategory
        .map((category: PaymentPackCategoryWithPacks) => category.packs)
        .flat()
        .filter((pack: PaymentPack) =>
          this.state.restrictedCategories.paymentPack
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
    let privatePassList: MarketplacePassPagePrivatePass[] = [];

    if (this.props.privatePassByCategory.length) {
      privatePassList = this.props.privatePassByCategory
        .map((category: PrivatePassCategoryWithPasses) => category.passes)
        .flat()
        .filter((pass: MarketplacePassPagePrivatePass) =>
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

  handlePassFilterChangeType = (
    option: MarketplaceCategoryPassFilterOption,
  ) => {
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

  handlePassFilterChangeCategory = (
    options: MarketplaceCategoryPassFilterOption[],
  ) => {
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
    selectedItem?: PaymentPack | MarketplacePassPagePrivatePass | PaymentCombo,
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

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    const hidePaymentPack = this.props.params?.hidePaymentPack === 'true';
    const hidePrivatePass = this.props.params?.hidePrivatePass === 'true';
    const hidePaymentCombo = this.props.params?.hidePaymentCombo === 'true';

    return (
      <>
        {!hidePaymentCombo &&
          !this.state.passSearchResult.query &&
          !!this.props.paymentComboList.length && (
            <Grid
              container
              direction="row"
              className={this.props.classes.carouselContainer}
            >
              <Carousel
                data={this.props.paymentComboList}
                renderItem={(paymentCombo: PaymentCombo) => (
                  <CarouselItem
                    paymentCombo={paymentCombo}
                    isExcludingTax={
                      this.props.theme.is_tax_excluded_in_marketplace
                    }
                    handleOpenDialog={this.handleOpenDialog}
                    addComboToCart={this.addComboToCart}
                  />
                )}
              />
            </Grid>
          )}

        <Grid
          container
          direction="row"
          className={this.props.classes.container}
        >
          <MarketplacePassFilters
            searchFiltersState={this.state.passSearchFilters}
            searchResultState={this.state.passSearchResult}
            paymentComboList={this.props.paymentComboList}
            hidePaymentPack={hidePaymentPack}
            hidePrivatePass={hidePrivatePass}
            paymentPackByCategory={this.props.paymentPackByCategory}
            restrictedPaymentPackCategories={
              this.state.restrictedCategories.paymentPack
            }
            privatePassByCategory={this.props.privatePassByCategory}
            restrictedPrivatePassCategories={
              this.state.restrictedCategories.privatePass
            }
            isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
            onSearchPressEnter={this.handleSearchPressEnter}
            addPaymentPackToCart={this.addPaymentPackToCart}
            addPrivatePassToCart={this.addPrivatePassToCart}
            addComboToCart={this.addComboToCart}
            onShowPaymentPackDetail={this.handleShowPaymentPackDetail}
            onShowPrivatePassDetail={this.handleShowPrivatePassDetail}
            onShowPaymentComboDetail={this.handleShowPaymentComboDetail}
            onClearSearchResult={this.handleClearSearchResult}
            onChangeType={this.handlePassFilterChangeType}
            onChangeCategory={this.handlePassFilterChangeCategory}
          />

          {!!this.state.passSearchResult.query &&
            !!this.state.passSearchResult.paymentCombo.length && (
              <div className={this.props.classes.marketplaceList}>
                <MarketplacePaymentComboList
                  setSelectedPass={this.handleShowPaymentComboDetail}
                  paymentComboList={this.props.paymentComboList}
                  searchedPaymentCombo={
                    this.state.passSearchResult.paymentCombo
                  }
                  onAddBasket={this.addComboToCart}
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                />
              </div>
            )}

          {!hidePaymentPack &&
            this.state.passSearchFilters.type?.value !== 'privatePass' && (
              <div className={this.props.classes.marketplaceList}>
                <MarketplacePaymentPackList
                  setSelectedPass={this.handleShowPaymentPackDetail}
                  selectedCategories={
                    this.state.passSearchFilters.selectedCategories
                  }
                  searchedPaymentPack={this.state.passSearchResult.paymentPack}
                  pushPackCheckout={this.addPaymentPackToCart}
                  paymentPackByCategory={this.props.paymentPackByCategory}
                  restrictedPaymentPackCategories={
                    this.state.restrictedCategories.paymentPack
                  }
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                />
              </div>
            )}

          {!hidePrivatePass &&
            this.state.passSearchFilters.type?.value !== 'paymentPack' && (
              <div className={this.props.classes.marketplaceList}>
                <MarketplacePrivatePassList
                  setSelectedPass={this.handleShowPrivatePassDetail}
                  selectedCategories={
                    this.state.passSearchFilters.selectedCategories
                  }
                  searchedPrivatePass={this.state.passSearchResult.privatePass}
                  privatePassByCategory={this.props.privatePassByCategory}
                  onAddBasket={this.addPrivatePassToCart}
                  restrictedPrivatePassCategories={
                    this.state.restrictedCategories.privatePass
                  }
                  isExcludingTax={
                    this.props.theme.is_tax_excluded_in_marketplace
                  }
                />
              </div>
            )}
        </Grid>

        <MarketplacePassDialogs
          dialogSelectedItem={this.state.dialogSelectedItem}
          isPaymentPackDetailsDialogOpen={
            this.state.isPaymentPackDetailsDialogOpen
          }
          isPaymentPackCompatibilityDialogOpen={
            this.state.isPaymentPackCompatibilityDialogOpen
          }
          isPaymentPackRestrictionDialogOpen={
            this.state.isPaymentPackRestrictionDialogOpen
          }
          isPrivatePassDetailsDialogOpen={
            this.state.isPrivatePassDetailsDialogOpen
          }
          isPrivatePassCompatibilityDialogOpen={
            this.state.isPrivatePassCompatibilityDialogOpen
          }
          isPaymentComboDetailsDialogOpen={
            this.state.isPaymentComboDetailsDialogOpen
          }
          isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
          addPaymentPackToCart={this.addPaymentPackToCart}
          addPrivatePassToCart={this.addPrivatePassToCart}
          addComboToCart={this.addComboToCart}
          handleCloseDialog={this.handleCloseDialog}
          handleOpenDialog={this.handleOpenDialog}
        />
      </>
    );
  }
}

const styles = (theme: Theme) => ({
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
  }: { memberTagList: Array<Tag>; authenticated: boolean },
) => ({
  memberTagList: memberTagList || getMemberTagsIdsList(state),
  authenticated: authenticated || state.auth.authenticated,
});
const mapStateToProps = (
  state: RootState,
  {
    memberTagList,
    authenticated,
  }: { memberTagList: Array<Tag>; authenticated: boolean },
) => ({
  currentBasket: getCurrentBasket(state),
  theme: themeSelector.getTheme(state),
  paymentComboList: getPaymentComboListAvailableOnline(state),
  loading: state.paymentPack.loading,
  establishmentLoading: state.establishment.bulkRetrieve.loading,
  activityLoading: state.metaActivity.loading,
  paymentPackByCategory: groupByCategory(
    withEstablishments(
      withMetaActivities(excludeUnaccessiblePacks(getMarketplacePaymentPacks)),
    ),
  )(state, { memberTagList, authenticated }),
  privatePassByCategory: getPrivatePassByCategoryWithPasses(
    withServices(getPrivatePassAsConsumer),
  )(state),
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
  // @ts-ignore
  withStyles(styles),
  connect(mapMemberInfoStateToProps),
  connect(mapStateToProps, mapDispatchToProps),
  withProps(
    ({ fetchPaymentPacks, fetchEstablishmentBulk, fetchMetaActivityBulk }) => ({
      fetchPaymentPacks: (params: any) =>
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
  ),
  withTranslation(),
)(MarketPlacePassPage);

export default compose<any, OwnProps>(
  withRouter,
  routerParamsToProps({ companyId: 'companyId:number' }),
  withQueryParams([
    [
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
)(MarketplacePassBase);
