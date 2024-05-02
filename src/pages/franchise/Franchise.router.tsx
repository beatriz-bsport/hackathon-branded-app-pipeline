import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core';

import { BsportRequestFromHeaderValue } from '../../constants';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';
import { getAuthToken } from '../../http';

// @ts-expect-error
import { getFranchiseTheme } from '../../theme';
import { fetchFranchise as fetchFranchiseAction } from '../../libs/franchise/actions';
import {
  generateTempPassword as generateTempPasswordAction,
  fetchTempPassword as fetchTempPasswordAction,
} from '../../libs/login/actions';
import { getTempPasswordState } from '../../libs/login/selectors';
import { getFranchiseId, getFranchisor } from '../../libs/franchise/selectors';
import { RootState } from '../../reducers';
import { DrawerContext } from '../../context';
import useSaasRouterTracker from '../../hooks/useSaasRouterTracker';

import FranchiseDrawer from '../../components/navigation/FranchiseDrawer.component';

import FranchiseStaffRoleRouter from './staff/FranchiseStaffRole.router';
import { fetchFranchiseRoles as fetchFranchiseRolesAction } from '#libs/role/actions';
import { getFranchisePermissions } from '#libs/role/selectors';
import GenericDialog from '#components/genericDialog/GenericDialog';

const FranchiseUserSearch = asyncComponent(
  () => import('./FranchiseUserSearch.page'),
);

const FranchiseMemberDetails = asyncComponent(
  () => import('./FranchiseMemberDetails.page'),
);
const FranchiseMemberList = asyncComponent(
  () => import('./FranchiseMemberList.page'),
);
const FranchiseCompanyList = asyncComponent(
  () => import('./FranchiseCompanyList.page'),
);
const FranchiseTheme = asyncComponent(() => import('./FranchiseTheme.page'));
const FranchiseEmailCreate = asyncComponent(
  () => import('./FranchiseEmailCreate.page'),
);
const FranchiseEmailEditor = asyncComponent(
  () => import('./FranchiseEmailEditor.page'),
);
const FranchiseEmailList = asyncComponent(
  () => import('./FranchiseEmailList.page'),
);
const FranchiseNotificationRulesPage = asyncComponent(
  () => import('./FranchiseNotificationRules.page'),
);

const FranchiseReportDetail = asyncComponent(
  () => import('./FranchiseReportDetail.page'),
);

const FranchiseReportList = asyncComponent(
  () => import('./FranchiseReportList.page'),
);
const FranchisePaymentPackTemplateRouter = asyncComponent(
  () => import('./payment-pack-template/FranchisePaymentPackTemplate.router'),
);
const FranchisePrivatePassTemplateRouter = asyncComponent(
  () => import('./private-pass-template/FranchisePrivatePassTemplate.router'),
);
const FranchiseCouponTemplateRouter = asyncComponent(
  () => import('./coupon-template/FranchiseCouponTemplate.router'),
);
const FranchiseGiftcardTemplateRouter = asyncComponent(
  () => import('./giftcard-template/FranchiseGiftcardTemplate.router'),
);
const FranchiseMarketingRouter = asyncComponent(
  () => import('./marketing/FranchiseMarketing.router'),
);
const WidgetGeneratorPage = asyncComponent(
  () => import('../settings/WidgetGenerator.page'),
);

const LoadingBackoffice = asyncComponent(
  () => import('../../components/navigation/LoadingBackoffice.component'),
);

type OwnProps = {
  disconnect: () => void;
  pushRouter: (path: string) => void;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const FranchiseRouter = (props: Props) => {
  const {
    isAuthenticated,
    isFranchisor,
    franchiseId,
    franchisor,
    generateTempPassword,
    fetchTempPassword,
    tempPasswordState,
    disconnect,
    fetchFranchise,
    fetchFranchiseRoles,
    pushRouter,
    franchisePermissions,
  } = props;

  useSaasRouterTracker(BsportRequestFromHeaderValue.SAAS_FRANCHISE_BACKOFFICE);

  useEffect(() => {
    fetchFranchise();
    fetchFranchiseRoles();
  }, [fetchFranchise, fetchFranchiseRoles]);

  const [displayLeftMenu, setDisplayLeftMenu] = useState(true);

  if (!isAuthenticated || !isFranchisor) {
    return <Redirect to="/login" />;
  }

  const token = getAuthToken();
  if (!getAuthToken() || token === 'null') {
    return <Redirect to="/login/signout" />;
  }

  const getDefaultFranchiseMemberDetailUrl = (baseUrl: string) => {
    if (baseUrl.endsWith('/')) {
      return `${baseUrl}info`;
    }
    return `${baseUrl}/info`;
  };

  if (!franchiseId) {
    return <LoadingBackoffice />;
  }

  return (
    <MuiThemeProvider
      theme={getFranchiseTheme({
        cover: franchisor.cover,
        primaryRGB: franchisor.primaryRGB,
        secondaryRGB: franchisor.secondaryRGB,
      })}
    >
      <DrawerContext.Provider
        value={{
          displayLeftMenu,
          hideLeftMenuAction: () => {
            setDisplayLeftMenu(false);
          },
          showLeftMenuAction: () => {
            setDisplayLeftMenu(true);
          },
        }}
      >
        <FranchiseDrawer
          cover={franchisor.cover}
          disconnect={disconnect}
          fetchTempPassword={fetchTempPassword}
          franchisePermissions={franchisePermissions}
          generateTempPassword={generateTempPassword}
          // @ts-expect-error
          push={pushRouter}
          syncMembersAcrossCompanies={franchisor.sync_members_across_companies}
          tempPasswordState={tempPasswordState}
        >
          <Switch>
            <Route
              component={FranchiseCompanyList}
              path="/f/franchises/:companyId?"
            />
            <Route component={FranchiseTheme} path="/f/settings/theme" />
            <Route component={EmailTemplate} path="/f/email-template" />
            <Route component={FranchiseMarketingRouter} path="/f/marketing" />
            <Route component={WidgetGeneratorPage} path="/f/settings/widget" />
            <Route component={FranchiseUserSearch} path="/f/search" />
            <Route
              exact
              component={FranchiseStaffRoleRouter}
              path="/f/staffrole/:tab"
            />

            <Route exact component={FranchiseMemberList} path="/f/members" />
            <Route
              component={FranchiseMemberDetails}
              path="/f/members/:userId/member/:tab"
            />
            <Route
              exact
              path="/f/members/:userId/member/"
              render={() => (
                <Redirect
                  to={getDefaultFranchiseMemberDetailUrl(
                    window.location.pathname,
                  )}
                />
              )}
            />
            <Route
              exact
              component={FranchiseReportDetail}
              path="/f/reporting/:reportId"
            />
            <Route component={FranchiseReportList} path="/f/reporting" />
            <Route
              component={FranchisePaymentPackTemplateRouter}
              path="/f/payment-pack-template"
            />
            <Route
              component={FranchisePrivatePassTemplateRouter}
              path="/f/private-pass-template"
            />
            <Route
              component={FranchiseCouponTemplateRouter}
              path="/f/coupon-template"
            />
            {franchisor.sync_members_across_companies && (
              <Route
                component={FranchiseGiftcardTemplateRouter}
                path="/f/giftcard-template"
              />
            )}
            <Route
              component={FranchiseNotificationRulesPage}
              path="/f/settings/notification-rule/:notificationId?"
            />
            <Redirect to="/f/franchises" />
          </Switch>
        </FranchiseDrawer>
        <GenericDialog />
      </DrawerContext.Provider>
    </MuiThemeProvider>
  );
};

const EmailTemplate = () => {
  return (
    <Switch>
      <Route
        exact
        component={FranchiseEmailEditor}
        path="/f/email-template/:id/edit"
      />
      <Route
        exact
        component={FranchiseEmailCreate}
        path="/f/email-template/create"
      />
      <Route component={FranchiseEmailList} path="/f/email-template/:id?" />
      <Redirect to="/f/email-template" />
    </Switch>
  );
};

const connector = connect(
  (state: RootState) => ({
    franchiseId: getFranchiseId(state),
    isAuthenticated: state.auth.authenticated,
    isFranchisor: state.auth.is_franchisor,
    username: state.auth.username,
    franchisor: getFranchisor(state),
    // @ts-expect-error
    tempPasswordState: getTempPasswordState(state),
    storedToken: state.auth.token,
    franchisePermissions: getFranchisePermissions(state),
  }),
  {
    fetchFranchise: fetchFranchiseAction,
    fetchFranchiseRoles: fetchFranchiseRolesAction,
    generateTempPassword: generateTempPasswordAction,
    fetchTempPassword: fetchTempPasswordAction,
    pushRouter: push,
    signout: () => push(`/login/signout`),
  },
);

export default compose<any, OwnProps>(
  // withOpenEvent('backoffice'),
  connector,
  withHandlers({
    disconnect:
      ({ signout, theme }) =>
      () => {
        signout(theme?.company);
      },
  }),
)(FranchiseRouter);
