import React, { useCallback, useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import Immutable from 'seamless-immutable';
import { makeStyles, Theme } from '@material-ui/core';

import withPageHeightHOC, {
  WithPageHeight,
} from '#src/hocs/with-page-height.hoc';
import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import { fetchMarketplaceContractList as fetchMarketplaceContractListAction } from '#src/libs/subscription/actions';
import { getGiftcardListActive } from '#src/libs/giftcard/selectors';
import { fetchGiftcardList as fetchGiftcardListAction } from '#src/libs/giftcard/actions';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#src/libs/payment-combo/actions';
import { getPaymentComboListAvailableOnline } from '#src/libs/payment-combo/selectors';
import {
  fetchMarketplacePacks as fetchMarketplacePacksAction,
  fetchPaymentPackList as fetchPaymentPackListAction,
} from '#src/libs/payment-packs/actions';
import { getEnabled as getPaymentPackAvailable } from '#src/libs/payment-packs/selectors';
import { getSubShopsByCompany } from '#src/libs/shop/selectors';
import { fetchVideoList as fetchVideoListAction } from '#src/libs/video/actions';
import { getVideoList } from '#src/libs/video/selectors';
import { fetchAllSubShop as fetchAllSubShopAction } from '#src/libs/shop/actions/subshop';
import MobileCustomShopRedirectionSettings from '#src/libs/settings/components/MobileCustomShopRedirectionSettings.component';
import CustomMobilePopupSettings from '#src/libs/settings/components/CustomMobilePopupSettings.component';
import MobileAppPersonalisationForm from '#src/libs/settings/components/MobileAppPersonalisationForm.component';
import {
  fetchCustomShopRedirections as fetchCustomShopRedirectionsAction,
  createCustomShopRedirection as createCustomShopRedirectionAction,
  updateCustomShopRedirection as updateCustomShopRedirectionAction,
  deleteCustomShopRedirection as deleteCustomShopRedirectionAction,
  fetchCustomMobilePopups as fetchCustomMobilePopupsAction,
  createCustomMobilePopup as createCustomMobilePopupAction,
  updateCustomMobilePopup as updateCustomMobilePopupAction,
  deleteCustomMobilePopup as deleteCustomMobilePopupAction,
} from '#src/libs/settings/actions';
import {
  getCustomMobilePopupsLoading,
  getCustomShopRedirectionsLoading,
  getCustomMobilePopupsList,
  getCustomMobileRedirectionsList,
} from '#src/libs/settings/selectors';
import { updateCompanyTheme as updateCompanyThemeAction } from '#src/libs/theme/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
// @ts-expect-error
import { getMarketplaceContractList as getContractList } from '#src/libs/subscription/selectors';
import { RootState } from '../../reducers';

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
    tab: 'tab:string',
  }),
  withPageHeightHOC(),
)(SettingsMobileRouter);
