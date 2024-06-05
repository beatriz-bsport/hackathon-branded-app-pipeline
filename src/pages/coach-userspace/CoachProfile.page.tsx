import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';

import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import { Redirect, Route } from 'react-router';
import { push } from 'connected-react-router';
import { retrieveMyAssociatedCoachProfile as retrieveMyAssociatedCoachProfileAction } from '#libs/associated-coach/actions';
// @ts-expect-error

import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';
import LoginBackgroundComponent from '#libs/login/components/LoginBackground.component';
import ConsumerCoachSpaceSelector from '#libs/associated-coach/components/ConsumerCoachSpaceSelector.component';
import withThemeProvider from '#hocs/company-themifier.hoc';
// @ts-expect-error
import withQueryParams from '#hocs/with-query-params.hoc';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import asyncComponent from '../../AsyncComponent';
import themeSelectors from '../../libs/theme/selectors';

const ConsumerHome = asyncComponent(
  // @ts-expect-error
  () => import('../consumer/Consumer.router'),
);

type RouterProps = {
  companyId: number;
};

type Props = RouterProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  has_answered_customer_space: boolean;
  has_answered_coach_space: boolean;
};
export class CoachProfile extends Component<Props, State> {
  state = {
    has_answered_customer_space: false,
    has_answered_coach_space: false,
  };

  componentDidMount() {
    const companyId = this.props.theme?.company;
    this.props.retrieveMyAssociatedCoachProfile({ companyId });
  }

  handleGoToConsumerSpace = () => {
    this.setState({ has_answered_customer_space: true });
  };

  handleGoToCoachSpace = () => {
    this.setState({ has_answered_coach_space: true });
  };

  render() {
    const { classes, meAsAssociatedCoach, meAsAssociatedCoachLoading } =
      this.props;

    if (
      (!meAsAssociatedCoach?.has_access_to_coach_space &&
        !meAsAssociatedCoachLoading) ||
      this.state.has_answered_customer_space
    ) {
      return <Route component={ConsumerHome} path="/" />;
    }
    if (this.state.has_answered_coach_space) {
      return <Redirect to={`/co/${this.props.companyId}`} />;
    }
    if (meAsAssociatedCoach?.has_access_to_coach_space)
      return (
        <div className={classes.container}>
          {this.props.theme?.display_bubble_background && (
            <LoginBackgroundComponent company />
          )}
          <ConsumerCoachSpaceSelector
            disconnect={this.props.disconnect}
            goToCoachSpace={this.handleGoToCoachSpace}
            goToConsumerSpace={this.handleGoToConsumerSpace}
          />
        </div>
      );

    return this.props.theme?.display_bubble_background ? (
      <LoginBackgroundComponent />
    ) : null;
  }
}

const connector = connect(
  (state: RootState) => ({
    theme: themeSelectors.getTheme(state),
    meAsAssociatedCoach: getMyAssociatedCoachProfile(state),
    meAsAssociatedCoachLoading: state.coach.myAssociatedCoachProfile.loading,
  }),
  {
    retrieveMyAssociatedCoachProfile: retrieveMyAssociatedCoachProfileAction,
    signout: (companyId: number) =>
      push(`/login/signout${companyId ? `?membership=${companyId}` : ''}`),
  },
);

const mapWithHandlers = {
  disconnect:
    ({ signout, theme }: ConnectedProps<typeof connector>) =>
    () => {
      signout(theme.company);
    },
};
const styles = () =>
  createStyles({
    container: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default compose<any, Props>(
  withQueryParams([['membership'], 'queryParams']),
  withProps(({ queryParams }) => ({
    companyId: parseInt(queryParams?.membership),
  })),
  connector,
  withHandlers(mapWithHandlers),
  withThemeProvider,
  marketplaceCssHoc(),
  withStyles(styles),
)(CoachProfile);
