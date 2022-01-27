// @flow
import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core';

import asyncComponent from '../../AsyncComponent';
import { getAuthToken } from '../../http';

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

import FranchiseDrawer from '../../components/navigation/FranchiseDrawer.component';

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

const ReportingGeneration = asyncComponent(
  () => import('../reporting/ReportingGeneration.page'),
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
    pushRouter,
  } = props;

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  const [displayLeftMenu, setDisplayLeftMenu] = useState(true);

  if (!isAuthenticated || !isFranchisor) {
    return <Redirect to="/login" />;
  }

  const token = getAuthToken();
  if (!getAuthToken() || token === 'null') {
    return <Redirect to="/login/signout" />;
  }

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
          tempPasswordState={tempPasswordState}
          generateTempPassword={generateTempPassword}
          fetchTempPassword={fetchTempPassword}
          cover={franchisor.cover}
          disconnect={disconnect}
          push={pushRouter}
        >
          <Switch>
            <Route
              path="/f/franchises/:companyId?"
              component={FranchiseCompanyList}
            />
            <Route path="/f/settings/theme" component={FranchiseTheme} />
            <Route path="/f/email-template" component={EmailTemplate} />
            <Route path="/f/settings/widget" component={WidgetGeneratorPage} />
            <Route exact path="/f/members" component={FranchiseMemberList} />
            <Route
              path="/f/members/:userId/member"
              component={FranchiseMemberDetails}
            />
            <Route
              exact
              path="/f/reporting/:reportId"
              component={ReportingGeneration}
            />
            <Route path="/f/reporting" component={FranchiseReportList} />
            <Route
              path="/f/payment-pack-template"
              component={FranchisePaymentPackTemplateRouter}
            />
            <Route
              path="/f/private-pass-template"
              component={FranchisePrivatePassTemplateRouter}
            />
            <Route
              path="/f/settings/notification-rule/:notificationId?"
              component={FranchiseNotificationRulesPage}
            />
            <Redirect to="/f/franchises" />
          </Switch>
        </FranchiseDrawer>
      </DrawerContext.Provider>
    </MuiThemeProvider>
  );
};

const EmailTemplate = () => {
  return (
    <Switch>
      <Route
        exact
        path="/f/email-template/:id/edit"
        component={FranchiseEmailEditor}
      />
      <Route
        exact
        path="/f/email-template/create"
        component={FranchiseEmailCreate}
      />
      <Route path="/f/email-template/:id?" component={FranchiseEmailList} />
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
    tempPasswordState: getTempPasswordState(state),
    storedToken: state.auth.token,
  }),
  {
    fetchFranchise: fetchFranchiseAction,
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
