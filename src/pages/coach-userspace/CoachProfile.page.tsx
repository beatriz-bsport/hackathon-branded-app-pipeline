import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';

import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import { Redirect, Route } from 'react-router';
import { push } from 'connected-react-router';
import themeSelectors from '../../libs/theme/selectors';
import { retrieveMyAssociatedCoachProfile as retrieveMyAssociatedCoachProfileAction } from '#libs/associated-coach/actions';
import asyncComponent from '../../AsyncComponent';
import { RootState } from '../../reducers';

import { WithHandlerType } from '../../utils/types';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';
import LoginBackgroundComponent from '#libs/login/components/LoginBackground.component';
import ConsumerCoachSpaceSelector from '#libs/associated-coach/components/ConsumerCoachSpaceSelector.component';
import withThemeProvider from '#hocs/company-themifier.hoc';
import withQueryParams from '#hocs/with-query-params.hoc';

const ConsumerHome = asyncComponent(
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

  render() {
    const { classes, meAsAssociatedCoach, meAsAssociatedCoachLoading } =
      this.props;

    if (
      (!meAsAssociatedCoach?.has_access_to_coach_space &&
        !meAsAssociatedCoachLoading) ||
      this.state.has_answered_customer_space
    ) {
      return <Route path="/" component={ConsumerHome} />;
    }
    if (this.state.has_answered_coach_space) {
      return <Redirect to={`/co/${this.props.companyId}`} />;
    }
    if (meAsAssociatedCoach?.has_access_to_coach_space)
      return (
        <LoginBackgroundComponent company>
          <div className={classes.container}>
            <div className={classes.top}>
              <ConsumerCoachSpaceSelector
                disconnect={this.props.disconnect}
                goToConsumerSpace={() => {
                  this.setState({ has_answered_customer_space: true });
                }}
                goToCoachSpace={() => {
                  this.setState({ has_answered_coach_space: true });
                }}
              />
            </div>
          </div>
        </LoginBackgroundComponent>
      );

    return <LoginBackgroundComponent />;
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
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    top: { position: 'relative', bottom: '10%' },
  });

export default compose<any, Props>(
  withQueryParams([['membership'], 'queryParams']),
  withProps(({ queryParams }) => ({
    companyId: parseInt(queryParams?.membership),
  })),
  connector,
  withHandlers(mapWithHandlers),
  withThemeProvider,
  withStyles(styles),
)(CoachProfile);
