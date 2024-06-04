import React from 'react';
import { push, replace as replaceAction } from 'connected-react-router';
import { compose, withProps } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withRouter } from 'react-router-dom';

import themeSelectors from '#src/libs/theme/selectors';
import { getPaymentPack } from '#src/libs/payment-packs/selectors';
import { getPrivatePass } from '#src/libs/private-service/selectors/private-pass';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';
import { fetchPrivatePassBulk as fetchPrivatePassBulkAction } from '#src/libs/private-service/actions';
import { getPaymentCombo } from '#src/libs/payment-combo/selectors';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#src/libs/payment-combo/actions';
import { getMarketplaceContractList } from '#src/libs/subscription/selectors';
import { fetchMarketplaceContractList } from '#src/libs/subscription/actions';
import { snackbarWarning, snackbarSuccess } from '#src/libs/snackbar/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import MarketplaceContractList from '#src/libs/marketplace/components/@Subscription/MarketplaceContractList';
import { MarketplaceContractDetailModalPortal } from '#src/libs/marketplace/components/@Subscription/MarketplaceContractDetailModal';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

import {
  SearchItemData,
  BaseAdditionalData,
} from '#src/components/css-only/Search/Search.component';
import type { Contract } from '#src/libs/subscription/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import { getContractCheckoutUrl } from '#src/libs/marketplace/routing-utils';

import type { RootState } from '../../../reducers';
import MarketplaceContractFilters from './MarketplaceContractFilters';
import { marketplaceCssHoc } from '../../../hocs/marketplace-css.hoc';
// @ts-expect-error
import Analytics from '../../../components/analytics/Analytics.component';

import './styles.css';

type OwnProps = {
  companyId: number;
  onAddToCart?: (id: number) => void;
};

type OwnPropsWithStore = OwnProps & { store?: any };

type Props = OwnProps & RouterProps & ConnectedProps<typeof connector>;

type State = {
  selectedContract: Contract | null;
  isContractDetailsDialogOpen: boolean;
  contractSearchResult: {
    query: string;
    contractIds: number[] | null;
  };
};

type RouterProps = {
  location: {
    pathname: string;
    search: string;
  };
  replace: (url: string) => void;
};

export class MarketplaceContract extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedContract: null,
      isContractDetailsDialogOpen: false,

      contractSearchResult: {
        query: '',
        contractIds: null,
      },
    };
  }

  componentDidMount() {
    this.props.fetchContracts(this.props.companyId);
  }

  componentDidUpdate(prevProps: Props) {
    /**
     * Retrieve the value associated to parameter called 'selected' from the URL
     * constant selectedContractId @returns {number}
     */
    const params: string[] = this.props.location?.search?.slice(1).split('&');
    const selectedContractId = parseInt(
      params?.find((param) => param.includes('selected='))?.split('=')[1],
      10,
    );
    if (
      prevProps.contractList?.length !== this.props.contractList?.length &&
      selectedContractId &&
      this.props.contractList?.length
    ) {
      this.handleShowContractDetail(selectedContractId);
    }
  }

  addContractToCart = (contract: Contract) => {
    if (this.props.onAddToCart) {
      this.props.onAddToCart(contract.id);
      return;
    }
    Analytics.contractShowPayment(contract);
    this.props.push(getContractCheckoutUrl(this.props.companyId, contract.id));
  };

  setSelectedContract = (contract: Contract) => {
    /**
     * Takes all parameters into an array and rebuild a new URL using
     * all of the parameters with 'selected' added to the new contract id
     */
    if (!WidgetUtils.isWidget()) {
      const params: string[] = this.props.location?.search?.slice(1).split('&');
      const filtered_params = params?.filter(
        (param) => !param.includes('selected='),
      );
      const pathname = `${this.props.location?.pathname}?${filtered_params.join(
        '&',
      )}&selected=${contract?.id}`;
      this.props.replace(pathname);
    }

    this.setState({
      selectedContract: contract,
      isContractDetailsDialogOpen: true,
    });
  };

  handleOpenContractDialog = (contract: Contract) => {
    if (contract?.payment_pack) {
      this.props.fetchPaymentPackBulk([contract.payment_pack]);
    }
    if (contract?.private_pass) {
      this.props.fetchPrivatePassBulk([contract.private_pass]);
    }
    if (contract?.payment_combo) {
      this.props.fetchPaymentComboList({
        id__in: [contract.payment_combo],
        company: this.props.companyId,
        ignore_new_member_only: true,
      });
    }
    if (contract) {
      this.setSelectedContract(contract);
    }
  };

  handleShowContractDetail = (id: number) => {
    const contract = this.props.contractList?.find(
      (contractItem: Contract) => contractItem.id === id,
    );
    this.handleOpenContractDialog(contract);
  };

  handleClearSearchResult = () => {
    this.setState({
      contractSearchResult: {
        query: '',
        contractIds: null,
      },
    });
  };

  handleOnPressSearchEnter = (
    searchResult: SearchItemData<BaseAdditionalData>[],
    searchText: string,
  ) => {
    if (
      searchText.length &&
      searchText !== this.state.contractSearchResult.query
    ) {
      const filteredContract =
        searchResult
          ?.filter(
            (searchItem: SearchItemData<BaseAdditionalData>) =>
              searchItem.identifier === 'contract',
          )
          .map((searchItem) => searchItem.id) ?? [];

      this.setState({
        contractSearchResult: {
          query: searchText,
          contractIds: filteredContract,
        },
      });
    }
  };

  handleCloseContractDetail = () =>
    this.setState((state) => ({
      ...state,
      isContractDetailsDialogOpen: false,
    }));

  render() {
    const { contractList } = this.props;

    if (this.props.contractLoading) {
      return <LinearProgress />;
    }

    return (
      <div className="bs-contract-page">
        <MarketplaceContractDetailModalPortal
          contract={this.state.selectedContract}
          getPaymentComboSelected={this.props.getPaymentComboSelected}
          getPaymentPackSelected={this.props.getPaymentPackSelected}
          getPrivatePassSelected={this.props.getPrivatePassSelected}
          isExcludingTax={
            this.props.companyTheme.is_tax_excluded_in_marketplace
          }
          isOpen={this.state.isContractDetailsDialogOpen}
          onAddToCart={this.addContractToCart}
          onDialogClose={this.handleCloseContractDetail}
        />

        <MarketplaceContractFilters
          addContractToCart={this.addContractToCart}
          contractList={contractList}
          isExcludingTax={
            this.props.companyTheme.is_tax_excluded_in_marketplace
          }
          onClearSearchResult={this.handleClearSearchResult}
          onSearchPressEnter={this.handleOnPressSearchEnter}
          onShowContractDetail={this.handleShowContractDetail}
          searchResultState={this.state.contractSearchResult}
        />

        <MarketplaceContractList
          contractList={this.props.contractList}
          isExcludingTax={
            this.props.companyTheme.is_tax_excluded_in_marketplace
          }
          onAddToCart={this.addContractToCart}
          onOpenDetailDialog={this.handleOpenContractDialog}
          searchedContractIds={this.state.contractSearchResult.contractIds}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  getPaymentPackSelected: (id: number) => {
    return getPaymentPack(state, id) as PaymentPack;
  },
  getPrivatePassSelected: (id: number) => {
    return getPrivatePass(state, id);
  },
  getPaymentComboSelected: (id: number) => {
    return getPaymentCombo(state, id);
  },
  // @ts-expect-error
  contractList: getMarketplaceContractList(state),
  contractLoading: state.subscription.contract.byMarketplace.loading,
  companyTheme: themeSelectors.getTheme(state),
});

const mapDispatchToProps = {
  fetchMarketplaceContractList,
  replace: replaceAction,
  fetchContracts: fetchMarketplaceContractList,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchPrivatePassBulk: fetchPrivatePassBulkAction,
  fetchPaymentComboList: fetchPaymentComboListAction,
  snackbarErrorMsg: snackbarWarning,
  snackbarSuccessMsg: snackbarSuccess,
  push,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const DataHOC = compose(
  connector,
  withProps(({ fetchContracts }) => ({
    fetchContracts: (company: number) => fetchContracts(company),
  })),
);

export const MarketplaceContractBase = compose<Props, OwnPropsWithStore>(
  marketplaceCssHoc(),
  DataHOC,
)(MarketplaceContract);

export default compose<any, OwnProps>(
  withRouter,
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName:string',
  }),
  DataHOC,
  marketplaceCssHoc(),
)(MarketplaceContractBase);
