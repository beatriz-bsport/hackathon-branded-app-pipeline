// @ts-nocheck
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { makeStyles, Theme } from '@material-ui/core';

import withTitle from '../../hocs/with-title.hoc';
import { fetchMarketplaceContractList as fetchMarketplaceContractListAction } from '#libs/subscription/actions';
import { getMarketplaceContractList as getContractList } from '#libs/subscription/selectors';
import { getGiftcardListActive } from '#libs/giftcard/selectors';
import { fetchGiftcardList as fetchGiftcardListAction } from '#libs/giftcard/actions';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#libs/payment-combo/actions';
import { getPaymentComboListAvailableOnline } from '#libs/payment-combo/selectors';
import {
  fetchMarketplacePacks as fetchMarketplacePacksAction,
  fetchPaymentPackList as fetchPaymentPackListAction,
} from '#libs/payment-packs/actions';
import { getEnabled as getPaymentPackAvailable } from '#libs/payment-packs/selectors';
import { getSubShopsByCompany } from '#libs/shop/selectors';
import { fetchVideoList as fetchVideoListAction } from '#libs/video/actions';
import { getVideoList } from '#libs/video/selectors';
import { fetchAllSubShop as fetchAllSubShopAction } from '#libs/shop/actions/subshop';
import MobileCustomShopRedirectionSettings from '#libs/settings/components/MobileCustomShopRedirectionSettings.component';
import CustomMobilePopupSettings from '#libs/settings/components/CustomMobilePopupSettings.component';
import {
  fetchCustomShopRedirections as fetchCustomShopRedirectionsAction,
  createCustomShopRedirection as createCustomShopRedirectionAction,
  updateCustomShopRedirection as updateCustomShopRedirectionAction,
  deleteCustomShopRedirection as deleteCustomShopRedirectionAction,
  fetchCustomMobilePopups as fetchCustomMobilePopupsAction,
  createCustomMobilePopup as createCustomMobilePopupAction,
  updateCustomMobilePopup as updateCustomMobilePopupAction,
  deleteCustomMobilePopup as deleteCustomMobilePopupAction,
} from '#libs/settings/actions';
import {
  getCustomMobilePopupsLoading,
  getCustomShopRedirectionsLoading,
  getCustomMobilePopupsList,
  getCustomMobileRedirectionsList,
} from '#libs/settings/selectors';
import { RootState } from '../../reducers';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const MobilePersonalization: React.FC<Props> = ({
  customMobilePopupsLoading,
  customShopRedirectionsLoading,
  customMobilePopupsList,
  customMobileRedirectionsList,
  companyId,
  paymentComboList,
  paymentPackList,
  contractList,
  vodList,
  giftcards,
  subshopList,
  fetchCustomShopRedirections,
  createCustomShopRedirection,
  updateCustomShopRedirection,
  deleteCustomShopRedirection,
  fetchCustomMobilePopups,
  createCustomMobilePopup,
  updateCustomMobilePopup,
  deleteCustomMobilePopup,
  fetchAllSubShop,
  fetchMarketplaceContractList,
  fetchMarketplacePacks,
  fetchPaymentComboList,
  fetchPaymentPackList,
  fetchVideoList,
  fetchGiftcardList,
}) => {
  const classes = useStyles();

  useEffect(() => {
    fetchCustomShopRedirections();
    fetchCustomMobilePopups();

    // For Mobile preview
    fetchAllSubShop(companyId);
    fetchMarketplaceContractList(companyId);
    fetchMarketplacePacks({});
    fetchPaymentComboList({
      as_consumer: true,
      company: companyId,
    });
    fetchPaymentPackList();
    fetchVideoList({
      company: companyId,
      is_marketplace: true,
    });
    fetchGiftcardList();
  }, [
    companyId,
    fetchCustomShopRedirections,
    fetchCustomMobilePopups,
    fetchAllSubShop,
    fetchMarketplaceContractList,
    fetchMarketplacePacks,
    fetchPaymentComboList,
    fetchPaymentPackList,
    fetchVideoList,
    fetchGiftcardList,
  ]);

  return (
    <div className={classes.container}>
      <MobileCustomShopRedirectionSettings
        contractListCount={contractList?.length}
        createCustomShopRedirection={createCustomShopRedirection}
        deleteCustomShopRedirection={deleteCustomShopRedirection}
        giftcardsCount={giftcards?.length}
        loading={customShopRedirectionsLoading}
        paymentComboListCount={paymentComboList?.length}
        paymentPackListCount={paymentPackList?.length}
        shopRedirections={customMobileRedirectionsList}
        subshopList={subshopList}
        updateCustomShopRedirection={updateCustomShopRedirection}
        vodListCount={vodList?.length}
      />
      <div className={classes.mobileSettings}>
        <CustomMobilePopupSettings
          createCustomMobilePopup={createCustomMobilePopup}
          deleteCustomMobilePopup={deleteCustomMobilePopup}
          loading={customMobilePopupsLoading}
          popups={customMobilePopupsList}
          updateCustomMobilePopup={updateCustomMobilePopup}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  mobileSettings: {
    marginTop: theme.spacing(4),
  },
}));

const connector = connect(
  (state: RootState) => ({
    customMobilePopupsLoading: getCustomMobilePopupsLoading(state),
    customShopRedirectionsLoading: getCustomShopRedirectionsLoading(state),
    customMobilePopupsList: getCustomMobilePopupsList(state),
    customMobileRedirectionsList: getCustomMobileRedirectionsList(state),

    paymentComboList: getPaymentComboListAvailableOnline(state),
    paymentPackList: getPaymentPackAvailable(state),
    contractList: getContractList(state),
    vodList: getVideoList(state),
    giftcards: getGiftcardListActive(state),
    subshopList: getSubShopsByCompany(state, state.theme.theme.company, true),
    companyId: state.theme.theme.company,
  }),
  {
    fetchCustomShopRedirections: fetchCustomShopRedirectionsAction,
    createCustomShopRedirection: createCustomShopRedirectionAction,
    updateCustomShopRedirection: updateCustomShopRedirectionAction,
    deleteCustomShopRedirection: deleteCustomShopRedirectionAction,
    fetchCustomMobilePopups: fetchCustomMobilePopupsAction,
    createCustomMobilePopup: createCustomMobilePopupAction,
    updateCustomMobilePopup: updateCustomMobilePopupAction,
    deleteCustomMobilePopup: deleteCustomMobilePopupAction,

    // For mobile preview
    fetchAllSubShop: fetchAllSubShopAction,
    fetchMarketplaceContractList: fetchMarketplaceContractListAction,
    fetchMarketplacePacks: fetchMarketplacePacksAction,
    fetchPaymentComboList: fetchPaymentComboListAction,
    fetchPaymentPackList: fetchPaymentPackListAction,
    fetchVideoList: fetchVideoListAction,
    fetchGiftcardList: fetchGiftcardListAction,
  },
);

export default compose(
  withTranslation('settings'),
  withTitle(({ t }: { t: TFunction }) => t('mobilePersonalization.title')),
  connector,
)(MobilePersonalization);
