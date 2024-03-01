import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Store } from 'redux';
import { compose } from 'recompose';

import { withStyles } from 'bsport-saas/node_modules/@material-ui/core/styles';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import ConsumerReferralDetail from 'bsport-saas/src/pages/consumer/ConsumerReferralDetail.page';
import type { Theme } from 'bsport-saas/src/libs/theme/types';

import type { RootState } from '../reducers';
import {
  bridgeRequestAuthenticationStatus as bridgeRequestAuthenticationStatusAction,
  createAuthenticatedBridgeAction,
  createFreeBridgeAction,
} from '../libs/bridge/actions';
import {
  closeUserInteractionPortal as closeUserInteractionPortalAction,
  genericShowLogin as genericShowLoginAction,
} from '../libs/modal/actions';
import {
  getCompanyReferralProgram,
  getMemberUsingCompanyId,
  getMembershipByCompanyId,
  getReferralMemberStatusUsingCompanyId,
} from '../libs/bridge/selectors';

const ReferralWidgetStyled = themify(ConsumerReferralDetail);

type OwnProps = {
  companyId: number,
  store: Store,
  theme: Theme,
  authenticated: boolean,
  dialogMode: 0 | 1 | 2,
  parentElement: string,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToWidgetProps> &
  typeof mapDispatchToWidgetProps;
class ReferralWidget extends Component<Props> {
  componentDidMount() {
    this.props.bridgeRequestAuthenticationStatus();
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.closeUserInteractionPortal();
      this.props.bridgeRequestAuthenticationStatus();
    }
  }

  showLogin = () => {
    this.props.showLogin({
      dialogMode: this.props.dialogMode,
      widgetType: 'referral',
      parentElementId: this.props.parentElement,
    });
  };

  render() {
    return (
      <ReferralWidgetStyled
        {...this.props}
        companyId={this.props.companyId}
        onLoginClick={this.showLogin}
        retrieveReferralProgramForCompany={
          this.props.bridgeRetrieveReferralProgramForCompany
        }
        retrieveReferralMemberStatus={
          this.props.bridgeretrieveReferralMemberStatus
        }
        fetchMember={this.props.fetchMember}
        fetchMembershipByCompany={this.props.fetchMembershipByCompany}
        member={this.props.member}
      />
    );
  }
}

const styles = () => ({
  container: {
    width: '100%',
  },
});

const mapStateToWidgetProps = (
  state: RootState,
  { companyId }: { companyId: number },
) => {
  return {
    authenticated: state.bridge.authentication.authenticated,

    referralProgram: getCompanyReferralProgram(state, companyId),
    referralProgramLoading: state.bridge.referralProgram.loading,
    referralProgramError: state.bridge.referralProgram.error,

    referralMemberStatus: getReferralMemberStatusUsingCompanyId(
      state,
      companyId,
    ),
    referralMemberStatusLoading: state.bridge.referralMemberStatus.loading,
    referralMemberStatusError: state.bridge.referralMemberStatus.error,

    membership: getMembershipByCompanyId(state, companyId),
    membershipLoading: state.bridge.membership.loading,
    membershipError: state.bridge.membership.error,

    member: getMemberUsingCompanyId(state, companyId),
    memberLoading: state.bridge.member.loading,
    memberError: state.bridge.member.error,
  };
};

const mapDispatchToWidgetProps = {
  bridgeRequestAuthenticationStatus: bridgeRequestAuthenticationStatusAction,
  showLogin: genericShowLoginAction,
  closeUserInteractionPortal: closeUserInteractionPortalAction,
  bridgeRetrieveReferralProgramForCompany: createFreeBridgeAction(
    'FETCH_REFERRAL_PROGRAM_BY_COMPANY',
  ),
  bridgeretrieveReferralMemberStatus: createAuthenticatedBridgeAction(
    'FETCH_REFERRAL_PROGRAM_MEMBER_STATUS',
  ),
  fetchMember: createAuthenticatedBridgeAction('FETCH_MEMBER_BY_ID'),
  fetchMembershipByCompany: createAuthenticatedBridgeAction(
    'MEMBERSHIP_BY_COMPANY',
  ),
};

export default compose<Props, OwnProps>(
  withStyles(styles),
  connect(mapStateToWidgetProps, mapDispatchToWidgetProps),
)(ReferralWidget);
