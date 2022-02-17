// @flow
import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import asyncComponent from '../../AsyncComponent';
import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';

import { getFranchiseId } from '../../libs/franchise/selectors';
import { RootState } from '../../reducers';
import { DrawerContext } from '../../context';
import withThemeProvider from '#hocs/company-themifier.hoc';

import { retrieveMyAssociatedCoachProfile as retrieveMyAssociatedCoachProfileAction } from '#libs/associated-coach/actions';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';
import CoachDrawer from './CoachDrawer.component';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import { getTheme } from '#libs/theme/selectors';
import LoadingBackoffice from '#components/navigation/LoadingBackoffice.component';

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
  } = props;

  useEffect(() => {
    retrieveMyAssociatedCoachProfile({ companyId });
  }, [retrieveMyAssociatedCoachProfile, companyId]);

  useEffect(() => {
    fetchCompanyTheme(companyId);
  }, [fetchCompanyTheme, companyId]);

  const [displayLeftMenu, setDisplayLeftMenu] = useState(true);

  if (!isAuthenticated || !isCoach) {
    return <Redirect to="/login" />;
  }

  if (coachProfileLoading || !meAsAssociatedCoach) {
    return <LoadingBackoffice />;
  }
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
        cover={theme?.cover}
        disconnect={disconnect}
        push={pushRouter}
        companyId={companyId}
        meAsAssociatedCoach={meAsAssociatedCoach}
        coachProfileLoading={props.coachProfileLoading}
      >
        <Switch>
          <Route
            path="/co/:companyId/calendar/"
            component={CoachProfileCalendar}
          />
          <Route
            path="/co/:companyId/payroll/"
            component={CoachProfilePerformance}
          />
          <Redirect to={`/co/${companyId}/calendar/`} />
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
  withHandlers({
    disconnect:
      ({ signout, companyId }) =>
      () => {
        signout(companyId);
      },
  }),
  withThemeProvider,
)(CoachBackoffice);
