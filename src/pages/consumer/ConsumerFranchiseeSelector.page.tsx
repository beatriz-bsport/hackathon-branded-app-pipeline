// @flow

import React, { Component } from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import type { Theme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import { parseQueryString } from '../../http';
import { disconnect } from '../../actions/auth.actions';
import { fetchCompanyTheme } from '#libs/theme/actions';
// import Analytics from '#components/analytics/Analytics.component';
import LoginBackground from '#libs/login/components/LoginBackground.component';

import type { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import WidgetUtils from '#libs/widget/WidgetUtils';
import FranchiseCompanyLogin from '#libs/franchise/components/FranchiseCompanyLogin.component';

import { fetchFranchiseTheme } from '#libs/franchise/actions';
import {
  getFranchiseThemeLoading,
  getFranchisor,
} from '#libs/franchise/selectors';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';

type OwnProps = {
  location: {
    hash: string;
    key: string;
    pathname: string;
    search: string;
    state: string;
  };
  franchisorId: number;
  next: string;
  companies: Array<number>;
  context: string;

  selectedFranchisee: number;
  setSelectedFranchisee: (id: number) => void;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnProps &
  ConnectedProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithHandlerType<typeof mapWithHandlers>;

export class ConsumerFranchiseeSelectorPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchFranchiseTheme(this.props.franchisorId);
  }

  render() {
    const {
      authenticated,
      classes,
      franchiseTheme,
      paymentPackTemplateCompanies,
      context,
    } = this.props;

    if (!authenticated) {
      return <Redirect to={`/login?franchisor=${this.props.franchisorId}`} />;
    }

    if (!this.props.franchiseTheme) {
      return null;
    }

    let companiesSelectable = this.props.franchiseTheme.companies;
    if (paymentPackTemplateCompanies?.length) {
      companiesSelectable = companiesSelectable?.filter((comp) =>
        paymentPackTemplateCompanies.includes(comp?.id),
      );
    }
    return (
      <>
        <Hidden xsDown>
          <LoginBackground franchise />
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
            context={context}
            companies={companiesSelectable}
            authenticated={authenticated}
            disconnect={this.props.disconnect}
            selectedFranchisee={this.props.selectedFranchisee}
            setSelectedFranchisee={this.props.setSelectedFranchisee}
            goToCompanyMemberProfilePage={this.props.goToNextPage}
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
  pushRouter: push,
  goToCompanyMemberProfilePage: (companyId: number) => push(`/c/${companyId}`),
};

const mapStateToProps = (state: RootState) => ({
  authenticated: state.auth.authenticated,
  franchiseTheme: getFranchisor(state),
  franchiseThemeLoading: getFranchiseThemeLoading(state),
});

const styles = (theme: Theme): any => ({
  logo: {
    position: 'absolute',
    left: '6%',
    top: '6%',
    height: 50,
    zIndex: 9,
  },
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

const mapWithHandlers = {
  goToNextPage: (props: OwnProps & ConnectedProps) => (companyId: number) => {
    if (props.next) {
      props.pushRouter(`/checkout/${companyId}/${props.next}`);
    } else {
      props.pushRouter(`/c/${companyId}`);
    }
  },
};

export default compose(
  withRouter,
  withStyles(styles),
  withState('selectedFranchisee', 'setSelectedFranchisee', null),
  routerParamsToProps({ franchisorId: 'franchisorId:number' }),
  withProps(({ location }) => {
    const search = location?.search || '';
    const { paymentPackTemplateCompanies, context, next } =
      parseQueryString(search);
    return {
      paymentPackTemplateCompanies: paymentPackTemplateCompanies
        ?.split(',')
        ?.map((company) => parseInt(company)),
      context,
      next,
    };
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(ConsumerFranchiseeSelectorPage);
