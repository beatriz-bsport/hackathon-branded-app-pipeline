// @flow

import React, { Component } from 'react';
import { compose, withState } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import type { Theme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import { disconnect } from '../../actions/auth.actions';
import { fetchCompanyTheme } from '#libs/theme/actions';
// import Analytics from '#components/analytics/Analytics.component';
import LoginBackground from '#libs/login/components/LoginBackground.component';

import type { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';
import WidgetUtils from '#libs/widget/WidgetUtils';
import FranchiseCompanyLogin from '#libs/franchise/components/FranchiseCompanyLogin.component';
import { FranchiseDetails } from '#libs/franchise/types';
import { fetchFranchiseTheme } from '#libs/franchise/actions';
import {
  getFranchiseTheme,
  getFranchiseThemeLoading,
  getFranchisor,
} from '#libs/franchise/selectors';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';

type OwnProps = {
  franchisorId: number;
  franchiseTheme: FranchiseDetails;
  selectedFranchisee: number;
  setSelectedFranchisee: (id: number) => void;
  goToCompanyMemberProfilePage: (id: number) => void;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  ConnectedProps &
  MaterialStyleType<ReturnType<typeof styles>>;

export class ConsumerFranchiseeSelectorPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchFranchiseTheme(this.props.franchisorId);
  }

  render() {
    const { authenticated, classes, franchiseTheme } = this.props;

    if (!authenticated) {
      return <Redirect to={`/login?franchisor=${this.props.franchisorId}`} />;
    }

    if (!this.props.franchiseTheme) {
      return null;
    }

    return (
      <>
        <Hidden xsDown>
          <LoginBackground
            franchise
            theme={getFranchiseTheme(franchiseTheme)}
          />
          <Fade in>
            <div>
              <img
                src={franchiseTheme.cover}
                className={classes.logo}
                alt={`${franchiseTheme.name} - logo`}
              />
            </div>
          </Fade>
        </Hidden>
        <div className={classes.container}>
          <FranchiseCompanyLogin
            companies={franchiseTheme.companies}
            authenticated={authenticated}
            disconnect={this.props.disconnect}
            selectedFranchisee={this.props.selectedFranchisee}
            setSelectedFranchisee={this.props.setSelectedFranchisee}
            goToCompanyMemberProfilePage={
              this.props.goToCompanyMemberProfilePage
            }
          />

          {/* {!!theme && <Analytics username="" theme={theme} />} */}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = {
  fetchCompanyTheme,
  fetchFranchiseTheme,
  disconnect,
  goToCompanyMemberProfilePage: (companyId: number) => push(`/c/${companyId}`),
};

const mapStateToProps = (state: RootState) => ({
  authenticated: state.auth.authenticated,
  franchiseTheme: getFranchisor(state),
  franchiseThemeLoading: getFranchiseThemeLoading(state),
});

const styles = (theme: Theme): any => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(1),
    width: '100%',
    overflow: 'auto',
    height: WidgetUtils.isWidget() ? '100%' : '92vh',
    marginTop: WidgetUtils.isWidget() ? 0 : '8vh',
    [theme.breakpoints.down('xs')]: {
      marginTop: 0,
    },
  },
});

export default compose(
  withRouter,
  withStyles(styles),
  withState('selectedFranchisee', 'setSelectedFranchisee', null),
  routerParamsToProps({ franchisorId: 'franchisorId:number' }),
  connect(mapStateToProps, mapDispatchToProps),
)(ConsumerFranchiseeSelectorPage);
