import { compose, withProps } from 'recompose';
import React, { useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
// @ts-expect-error
import asyncComponent from '../AsyncComponent';
import { getAuthToken } from '../http';
import { RootState } from '../reducers';

// @ts-expect-error
import { disconnect as disconnectAction } from '../actions/auth.actions';
// @ts-expect-error
import withQueryParams from '../hocs/with-query-params.hoc';

import namespaces from '../i18n/namespaces.json';
import { identifyAnalyticsB2BWithTheme } from '#src/components/analytics/mixpanel';
import { requestOptInTrackingB2B as requestOptInTrackingB2BAction } from '#src/components/analytics/actions';
// @ts-expect-error Javascript file
import { fetchAccessLevelWithoutConnect as fetchAccessLevelWithoutConnectAction } from '#src/actions/auth.actions';

import { useRouteToHomepage } from '#src/revamp';

// @ts-expect-error
const ConsumerHome = asyncComponent(() => import('./consumer/Consumer.router'));
const CoachHome = asyncComponent(
  () => import('./coach-userspace/CoachProfile.page'),
);
// @ts-expect-error
const Backoffice = asyncComponent(() => import('./Backoffice.component'));
const FranchiseHome = asyncComponent(
  () => import('./franchise/Franchise.router'),
);

type RouterProps = { companyId: number };
type Props = ConnectedProps<typeof connector> & RouterProps;

export const UserspaceSwitcher = (props: Props) => {
  const {
    authenticated,
    isCoach,
    isManager,
    isConsumer,
    isFranchisor,
    storedToken,
    disconnect,
    companyId,
    role,
    has_completed_account_configuration_on_boarding,
    hasEnabledRevampedBO,
    theme,
    fetchAccessLevelWithoutConnect,
  } = props;
  useTranslation(namespaces);
  useEffect(() => {
    const updateToken = () => {
      if (getAuthToken() === 'null') {
        disconnect();
      }
    };

    // Do notes that storage event are only dispatch when other tab write on
    // the localstorage. Modify the localstorage on this tab will not trigger
    // the event for this application
    window.addEventListener('storage', updateToken);

    return () => {
      window.removeEventListener('storage', updateToken);
    };
  }, [storedToken, disconnect]);

  useEffect(() => {
    if (!authenticated) return;

    if (
      isFranchisor ||
      isManager ||
      (isCoach && companyId && !WidgetUtils.isWidget())
    ) {
      // Activate tracking for B2B and deactivate tracking for B2C
      props.requestOptInTrackingB2B();

      // After configuring the instance, we can setup additional properties
      if (theme) {
        identifyAnalyticsB2BWithTheme({
          companyId: theme.company,
          companyName: theme.company_name,
          franchisorId: theme.franchisor,
        });
      }
    }
  }, [authenticated, isFranchisor, isManager, isCoach, companyId, theme]);

  const { navigateToHomepage, shouldNavigateToHomepage } = useRouteToHomepage({
    role,
    revampedBoEnabledForUser: hasEnabledRevampedBO,
    revampedBoEnabledInTheme: !!theme?.revamped_backoffice_enabled,
  });

  useEffect(() => {
    // Use the same storage as in the revamp backoffice
    const localOrSessionStorage = getAuthToken();
    if (isManager && shouldNavigateToHomepage && localOrSessionStorage) {
      // Refresh Redux store with Access Level information
      fetchAccessLevelWithoutConnect(localOrSessionStorage, 'previous', {
        onSuccess: (data: { has_enabled_revamped_backoffice: boolean }) => {
          // Trigger redirection only if the user setting is still active
          if (data.has_enabled_revamped_backoffice) {
            navigateToHomepage();
          }
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManager, shouldNavigateToHomepage]);

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  if (isFranchisor) {
    return <Route component={FranchiseHome} path="/" />;
  }

  if (isManager) {
    if (!has_completed_account_configuration_on_boarding) {
      return <Redirect to="/login/accountConfiguration/" />;
    }
    return <Route component={Backoffice} path="/" />;
  }
  if (isCoach && companyId && !WidgetUtils.isWidget()) {
    return <Route component={CoachHome} path="/" />;
  }

  if (isConsumer) {
    return <Route component={ConsumerHome} path="/" />;
  }

  return <Redirect to="/login" />;
};

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    isCoach: state.auth.is_coach,
    isConsumer: state.auth.is_consumer,
    isManager: state.auth.is_manager,
    isFranchisor: state.auth.is_franchisor,
    storedToken: state.auth.token,
    role: state.auth.role,
    has_completed_account_configuration_on_boarding:
      state.auth.has_completed_account_configuration_on_boarding,
    email_confirmed: state.auth.email_confirmed,
    theme: state.theme.theme,
    hasEnabledRevampedBO: state.auth.has_enabled_revamped_backoffice,
  }),
  {
    disconnect: disconnectAction,
    requestOptInTrackingB2B: requestOptInTrackingB2BAction,
    fetchAccessLevelWithoutConnect: fetchAccessLevelWithoutConnectAction,
  },
);

export default compose(
  withQueryParams([['membership'], 'queryParams']),
  withProps(({ queryParams }) => ({
    companyId: parseInt(queryParams?.membership),
  })),
  connector,
  // @ts-expect-error
)(UserspaceSwitcher);
