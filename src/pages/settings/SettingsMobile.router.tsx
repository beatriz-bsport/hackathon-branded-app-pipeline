import React, { useCallback, useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import Immutable from 'seamless-immutable';
import { makeStyles, Theme } from '@material-ui/core';

import withPageHeightHOC, { WithPageHeight } from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';
import { fetchMarketplaceContractList as fetchMarketplaceContractListAction } from '#libs/subscription/actions';
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
import MobileAppPersonalisationForm from '#libs/settings/components/MobileAppPersonalisationForm.component';
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
import { updateCompanyTheme as updateCompanyThemeAction } from '#libs/theme/actions';
// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
// @ts-expect-error
import { getMarketplaceContractList as getContractList } from '#libs/subscription/selectors';

type Props = {
  tab: 'links' | 'popups' | 'customize';
} & ConnectedProps<typeof connector> &
  WithPageHeight &
  WithTranslation;

// TODO : UNCOMMENT WHEN FEATURE AVAILABLE ON MOBILE APP
// const tabsData = Immutable([
//   { label: 'tab.appSettings.links', value: 'links' },
//   { label: 'tab.appSettings.popups', value: 'popups' },
//   { label: 'tab.appSettings.customize', value: 'customize' },
// ]);

const SettingsMobileRouter: React.FC<Props> = ({
  companyTheme,
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
  updateCompanyTheme,
  tab,
  push,
  pageHeight,
}) => {
  const classes = useStyles();

  const tabsData = Immutable([
    { label: 'tab.appSettings.links', value: 'links' },
    { label: 'tab.appSettings.popups', value: 'popups' },
    { label: 'tab.appSettings.customize', value: 'customize' },
  ]);

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

  const onChange = useCallback(
    (newTab: string) => {
      push(`/settings/mobile-personalisation/${newTab}`);
    },
    [push],
  );

  return (
    <ContentWithAppBar
      onChange={onChange}
      pageHeight={pageHeight}
      tab={tab}
      tabsData={tabsData}
    >
      <div className={classes.container}>
        <Switch>
          <Route exact path="/settings/mobile-personalisation/links">
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
          </Route>
          <Route exact path="/settings/mobile-personalisation/popups">
            <CustomMobilePopupSettings
              createCustomMobilePopup={createCustomMobilePopup}
              deleteCustomMobilePopup={deleteCustomMobilePopup}
              loading={customMobilePopupsLoading}
              popups={customMobilePopupsList}
              updateCustomMobilePopup={updateCustomMobilePopup}
            />
          </Route>
          <Route exact path="/settings/mobile-personalisation/customize">
            <MobileAppPersonalisationForm
              onSubmit={updateCompanyTheme}
              theme={companyTheme}
            />
          </Route>
          <Redirect to="/settings/mobile-personalisation/links" />
        </Switch>
      </div>
    </ContentWithAppBar>
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
    companyTheme: state.theme.theme,
  }),
  {
    push: pushFunc,

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

    // For mobile app personalisation
    updateCompanyTheme: updateCompanyThemeAction,
  },
);

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab',
  }),
  withPageHeightHOC(),
)(SettingsMobileRouter);
