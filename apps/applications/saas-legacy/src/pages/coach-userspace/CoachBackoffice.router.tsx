import React, { useEffect, useState, useMemo } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import { withTranslation } from 'react-i18next';
import withThemeProvider from '#src/hocs/company-themifier.hoc';
import { retrieveMyAssociatedCoachProfile as retrieveMyAssociatedCoachProfileAction } from '#src/libs/associated-coach/actions';
import { getMyAssociatedCoachProfile } from '#src/libs/associated-coach/selectors';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import { getTheme } from '#src/libs/theme/selectors';
import LoadingBackoffice from '#src/components/navigation/LoadingBackoffice.component';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';
import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';

import { getFranchiseId } from '../../libs/franchise/selectors';
import { RootState } from '../../reducers';
import { DrawerContext } from '../../context';
import namespaces from '../../i18n/namespaces.json';

import CoachDrawer from './CoachDrawer.component';
import withRudderStackHistoryTracker from '../../components/analytics/rudderstack/with-rudderstack-history-tracking';

type RouterProps = { companyId: number };
type OwnProps = {
  disconnect: () => void;
  pushRouter: (path: string) => void;
};

type Props = OwnProps & ConnectedProps<typeof connector> & RouterProps;
const CoachProfileCalendar = asyncComponent(
  () => import('./CoachProfileCalendar.page'),
);
const CoachProfilePerformance = asyncComponent(
  () => import('./CoachProfilePerformance.page'),
);
const CoachReplacementRouter = asyncComponent(
  () => import('./CoachReplacement'),
);

const CoachBackoffice = (props: Props) => {
  const {
    isAuthenticated,
    companyId,
    isCoach,
    meAsAssociatedCoach,
    coachProfileLoading,
    theme,
    retrieveMyAssociatedCoachProfile,
    disconnect,
    pushRouter,
    fetchCompanyTheme,
    themeLoading,
  } = props;

  useEffect(() => {
    retrieveMyAssociatedCoachProfile({ companyId });
  }, [retrieveMyAssociatedCoachProfile, companyId]);

  useEffect(() => {
    fetchCompanyTheme(companyId);
  }, [fetchCompanyTheme, companyId]);

  // eslint-disable-next-line consistent-return
  const firstAvailableNavigableItem = useMemo(() => {
    if (theme.has_coach_access_to_calendar) return `/co/${companyId}/calendar/`;
    if (theme.has_coach_access_to_compensation)
      return `/co/${companyId}/payroll/`;
    if (theme.has_coach_access_to_replacement_request)
      return `/co/${companyId}/replacement/calendar/`;
  }, [theme, companyId]);

  const [displayLeftMenu, setDisplayLeftMenu] = useState(true);

  if (!isAuthenticated || !isCoach) {
    return <Redirect to="/login" />;
  }

  if (coachProfileLoading || !meAsAssociatedCoach || themeLoading) {
    return <LoadingBackoffice />;
  }

  const {
    has_coach_access_to_calendar,
    has_coach_access_to_compensation,
    has_coach_access_to_replacement_request,
  } = theme;

  return (
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
      <CoachDrawer
        // @ts-expect-error
        coachProfileLoading={props.coachProfileLoading}
        companyId={companyId}
        cover={theme?.cover}
        disconnect={disconnect}
        has_coach_access_to_calendar={has_coach_access_to_calendar}
        has_coach_access_to_compensation={has_coach_access_to_compensation}
        has_coach_access_to_replacement_request={
          has_coach_access_to_replacement_request
        }
        meAsAssociatedCoach={meAsAssociatedCoach}
        push={pushRouter}
      >
        <Switch>
          <Route
            component={CoachProfileCalendar}
            path="/co/:companyId/calendar/"
          />
          <Route
            component={CoachProfilePerformance}
            path="/co/:companyId/payroll/"
          />
          <Route
            component={CoachReplacementRouter}
            path="/co/:companyId/replacement/:tab/"
          />
          <Route
            component={CoachReplacementRouter}
            path="/co/:companyId/replacement/"
          />
          <Redirect to={firstAvailableNavigableItem} />
        </Switch>
      </CoachDrawer>
    </DrawerContext.Provider>
  );
};

const connector = connect(
  (state: RootState) => ({
    franchiseId: getFranchiseId(state),
    isAuthenticated: state.auth.authenticated,
    isCoach: state.auth.is_coach,
    username: state.auth.username,
    theme: getTheme(state),
    themeLoading: state.theme.loading,
    meAsAssociatedCoach: getMyAssociatedCoachProfile(state),
    coachProfileLoading: state.coach.myAssociatedCoachProfile.loading,
  }),
  {
    pushRouter: push,
    signout: (companyId: number) =>
      push(`/login/signout${companyId ? `?membership=${companyId}` : ''}`),
    retrieveMyAssociatedCoachProfile: retrieveMyAssociatedCoachProfileAction,
    fetchCompanyTheme: fetchCompanyThemeAction,
  },
);

export default compose<any, OwnProps>(
  mapRouterParamsToProps({ companyId: 'companyId:number' }),
  connector,
  withTranslation(namespaces),
  withHandlers({
    disconnect:
      ({ signout, companyId }) =>
      () => {
        signout(companyId);
      },
  }),
  withThemeProvider,
  withRudderStackHistoryTracker,
)(CoachBackoffice);
