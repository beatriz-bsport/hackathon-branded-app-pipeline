import React, { Component } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers } from 'recompose';
import { push as pushRouter } from 'connected-react-router';
import { Redirect } from 'react-router-dom';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  CHANGE_EMAIL_REQUEST_LINK_ACCOUNT_KIND,
  CHANGE_EMAIL_REQUEST_SIMPLE_EMAIL_CONFIRMATION_KIND,
  CHANGE_MEMBER_EMAIL_PENDING_STATUS,
} from '@bsport/common/lib/master-data/change-email-request';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import ConsumerAppBar from '../checkout/ConsumerAppBar.container';
import {
  getMembership,
  _getConsumerMembershipIds,
  getConsumerMembershipList,
} from '#libs/membership/selectors';
import {
  fetchMembershipByCompany,
  fetchMembershipListAsConsumer,
} from '#libs/membership/actions';
import { fetchCompanyBulk } from '#libs/company/actions';
import { RootState } from '../../reducers';
import {
  retrieveChangeEmailRequest,
  answerChangeEmailRequest,
} from '#libs/member/actions';
import { fetchCompanyTheme } from '#libs/theme/actions';
import themeSelectors from '#libs/theme/selectors';
import { getCurrentChangeEmailRequest } from '#libs/member/selectors';
import ChangeEmailSubmitDialog from '#libs/member/components/change_email/ChangeEmailSubmitDialog.component';
import { WithHandlerType } from '../../utils/types';
import {
  SimpleEmailChangeContent,
  SimpleEmailChangeContentMultipleCompanies,
  LinkAccountVetoContent,
  LinkAccountAcceptContent,
  ErrorContent,
  UnAuthorizedContent,
} from '#libs/member/components/change_email/consumer-space/content';

type StateHandlerInit = {
  submitStatus: {
    success: boolean;
    accepted: boolean;
    denied: boolean;
  };
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {
  title: string;
};
type RouterParamsToPropsProps = {
  uuid: string;
  companyId: number;
};
type OwnAndConnectedProps = RouterParamsToPropsProps &
  ConnectedProps<typeof connector> &
  StateHandlerType;
type Props = OwnProps &
  OwnAndConnectedProps &
  WithStyles<typeof styles> &
  WithTranslation;

export class ConsumerChangeEmailRequestPage extends Component<Props> {
  componentDidMount() {
    this.props.retrieveChangeEmailRequest(this.props.uuid);
    this.props.fetchCompanyTheme(this.props.companyId);
    if (this.props.authenticated) {
      this.props.fetchMembershipByCompany(this.props.companyId);
      this.props.fetchMembershipListAsConsumer({ page_size: 10 });
      this.props.fetchCompanyBulk(this.props.membershipListIdList);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.activeMemberShip &&
      (!prevProps.activeMemberShip ||
        prevProps.activeMemberShip.company !==
          this.props.activeMemberShip.company)
    ) {
      this.props.retrieveChangeEmailRequest(this.props.uuid);
      this.props.fetchCompanyTheme(this.props.companyId);
      this.props.fetchCompanyBulk(this.props.membershipListIdList);
    }
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchMembershipByCompany(this.props.companyId);
      this.props.fetchMembershipListAsConsumer({ page_size: 10 });
      this.props.fetchCompanyBulk(this.props.membershipListIdList);
    }
  }

  getLoginUrl = () => {
    const { pathname } = this.props.location;
    return `/login/customer?next=${encodeURIComponent(
      `${pathname}${
        window.location.search ? window.location.search : '?'
      }&membership=${this.props.companyId}`,
    )}&membership=${this.props.companyId}`;
  };

  goToUserSpace = () => this.props.pushRouter(`/c/${this.props.companyId}`);

  denied = () => {
    this.props.answerChangeEmailRequest(
      this.props.uuid,
      {
        accepted: false,
        denied: true,
        company: this.props.companyId,
      },
      {
        onSuccess: () => this.props.setDeniedSuccess(),
        onError: () => this.props.setSubmitError(),
      },
    );
  };

  confirm = () => {
    this.props.answerChangeEmailRequest(
      this.props.uuid,
      {
        accepted: true,
        denied: false,
        company: this.props.companyId,
      },
      {
        onSuccess: () => this.props.setAcceptedSuccess(),
        onError: () => this.props.setSubmitError(),
      },
    );
  };

  renderContent = () => {
    const { changeEmailRequest, loading } = this.props;
    if (loading || !changeEmailRequest) {
      return null;
    }
    const contentProps = {
      request: changeEmailRequest,
      companyTheme: this.props.theme,
      membership: this.props.activeMemberShip,
      membershipList: this.props.membershipList,
      onConfirm: this.confirm,
      onDenied: this.denied,
    };
    if (changeEmailRequest.status !== CHANGE_MEMBER_EMAIL_PENDING_STATUS) {
      return <ErrorContent {...contentProps} />;
    }
    if (
      changeEmailRequest.kind ===
        CHANGE_EMAIL_REQUEST_SIMPLE_EMAIL_CONFIRMATION_KIND &&
      this.props.membershipListIdList?.length === 1
    ) {
      return <SimpleEmailChangeContent {...contentProps} />;
    }
    if (
      changeEmailRequest.kind ===
        CHANGE_EMAIL_REQUEST_SIMPLE_EMAIL_CONFIRMATION_KIND &&
      this.props.membershipListIdList?.length !== 1
    ) {
      return <SimpleEmailChangeContentMultipleCompanies {...contentProps} />;
    }
    if (
      changeEmailRequest.kind === CHANGE_EMAIL_REQUEST_LINK_ACCOUNT_KIND &&
      this.props.membershipListIdList?.includes(
        this.props.activeMemberShip?.company,
      )
    ) {
      return <LinkAccountVetoContent {...contentProps} />;
    }
    if (
      changeEmailRequest.kind === CHANGE_EMAIL_REQUEST_LINK_ACCOUNT_KIND &&
      changeEmailRequest.dst_other_companies_members.filter((id) =>
        this.props.membershipListIdList?.includes(id),
      )
    ) {
      return <LinkAccountAcceptContent {...contentProps} />;
    }
    return null;
  };

  render() {
    const { classes, changeEmailRequest, authenticated } = this.props;
    if (!authenticated) {
      return <Redirect to={this.getLoginUrl()} />;
    }
    if (authenticated && this.props.error?.response.status === 403) {
      return (
        <ConsumerAppBar backgroundColor="white">
          <div className={classes.container}>
            <UnAuthorizedContent companyTheme={this.props.theme} />
          </div>
        </ConsumerAppBar>
      );
    }
    return (
      <ConsumerAppBar backgroundColor="white">
        <div className={classes.container}>{this.renderContent()}</div>
        {changeEmailRequest && (
          <ChangeEmailSubmitDialog
            open={this.props.submitStatus.success}
            goToUserSpace={this.goToUserSpace}
            request={changeEmailRequest}
            accepted={this.props.submitStatus.accepted}
            denied={this.props.submitStatus.denied}
            old_email={this.props.changeEmailRequest.old_email}
            new_email={this.props.changeEmailRequest.new_email}
            member_id={this.props.activeMemberShip?.id}
            companyTheme={this.props.theme}
          />
        )}
      </ConsumerAppBar>
    );
  }
}

const connector = connect(
  (state: RootState, props: RouterParamsToPropsProps) => ({
    theme: themeSelectors.getTheme(state),
    activeMemberShip: getMembership(state, props.companyId),
    membershipListIdList: _getConsumerMembershipIds(state),
    membershipList: getConsumerMembershipList(state),
    authenticated: state.auth.authenticated,
    changeEmailRequest: getCurrentChangeEmailRequest(state),
    error: state.member.change_email_request.error,
    loading: state.member.change_email_request.loading,
  }),
  {
    retrieveChangeEmailRequest,
    fetchMembershipByCompany,
    fetchCompanyTheme,
    answerChangeEmailRequest,
    pushRouter,
    fetchMembershipListAsConsumer,
    fetchCompanyBulk,
  },
);

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      width: '800px',
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: theme.spacing(3),
    },
    title: {
      paddingLeft: theme.spacing(2),
    },
    emailDetail: {
      display: 'flex',
      paddingLeft: theme.spacing(1),
      '&::before': {
        content: '"\u2022"',
        paddingRight: theme.spacing(1),
      },
    },
    emailDetailContainer: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    spacedTextContainer: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    paperContainer: {
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(6),
      },
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
      },
    },
    gridContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
  });

const withStateHandlersInit: StateHandlerInit = {
  submitStatus: {
    success: false,
    accepted: false,
    denied: false,
  },
};
const withStateHandlersSetter = {
  setAcceptedSuccess: () => () => {
    return {
      submitStatus: {
        success: true,
        accepted: true,
        denied: false,
      },
    };
  },
  setDeniedSuccess: () => () => {
    return {
      submitStatus: {
        success: true,
        accepted: false,
        denied: true,
      },
    };
  },
  setSubmitError: () => () => {
    return {
      submitStatus: {
        success: false,
        accepted: false,
        denied: false,
      },
    };
  },
};
export default compose(
  withStyles(styles),
  routerParamsToProps({
    companyId: 'companyId',
    uuid: 'uuid',
  }),
  withTranslation('member'),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connector,
)(ConsumerChangeEmailRequestPage);
