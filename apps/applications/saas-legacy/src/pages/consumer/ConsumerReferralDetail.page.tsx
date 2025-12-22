import React, { Component, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { compose } from 'recompose';

import { buildMemberReferralLink } from '@bsport/common/lib/referrals/utils.js';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import themeSelectors from '#src/libs/theme/selectors';

import {
  retrieveReferralProgramForCompany as retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAction,
} from '#src/libs/referral/actions';
import {
  getTheReferralProgram,
  getReferralMemberStatusWithMemberId,
  getReferralProgramsLoading,
  getReferralMemberStatusLoading,
  getReferralProgramsError,
  getReferralMemberStatusError,
} from '#src/libs/referral/selectors';

import { fetchMember as fetchMemberAction } from '#src/libs/member/actions';
import { getMemberDetail } from '#src/libs/member/selectors';

import type { Membership } from '#src/libs/membership/types';
import { getMembership } from '#src/libs/membership/selectors';

import ReferralLinkAndTerms from '#src/libs/referral/components/ReferralLinkAndTerms';

import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { fetchMembershipByCompany as fetchMembershipByCompanyAction } from '#src/libs/membership/actions';
import { RootState } from '../../reducers';
import Config from '../../config';

type OwnProps = {
  companyId: number;
  onLoginClick: () => void;
};

type Props = OwnProps &
  ConnectedProps<typeof authenticatedCallsConnector> &
  ConnectedProps<typeof pageDataConnector> &
  RouteComponentProps;

export class ConsumerReferralDetail extends Component<Props> {
  componentDidMount(): void {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.authenticated !== this.props.authenticated) {
      this.fetchData();
    }
  }

  fetchAuthenticatedData = () => {
    this.props.fetchMembershipByCompany(this.props.companyId, {
      onSuccess: (membership) => {
        this.props.fetchMember(membership.id);
        if (this.props.theme.is_referral_program_activated) {
          this.props.retrieveReferralMemberStatus(membership.id);
        }
      },
    });
  };

  fetchData = () => {
    // This page can be accessed while unauthenticated as a widget. It then has a different behavior, showing
    // the company's referral program and prompting the user to log in to use it
    if (!this.props.referralProgram) {
      this.props.retrieveReferralProgramForCompany(this.props.companyId, {
        onSuccess: () => {
          if (this.props.authenticated) {
            this.fetchAuthenticatedData();
          }
        },
      });
    }
    if (!this.props.member && this.props.authenticated) {
      this.fetchAuthenticatedData();
    }
  };

  render() {
    const referralLink = this.props.theme.is_referral_program_activated
      ? `${Config.PUBLIC_URL}${buildMemberReferralLink(
          this.props.membership?.company,
          this.props?.member?.referral_uuid,
        )}`
      : '';

    const hasUnknownError =
      !!this.props.referralProgramError ||
      !!this.props.memberError ||
      !!this.props.membershipError ||
      !!this.props.referralMemberStatusError;

    const isLoading =
      this.props.referralProgramLoading ||
      this.props.referralMemberStatusLoading ||
      this.props.membershipLoading ||
      this.props.memberLoading;

    return (
      <ReferralLinkAndTerms
        hasUnknownError={hasUnknownError}
        isAuthenticated={this.props.authenticated}
        isLoading={isLoading}
        nbRemainingReferralUses={
          this.props.referralMemberStatus?.nb_remaining_referral_uses
        }
        onLoginClick={this.props.onLoginClick}
        referralLink={referralLink}
        referralProgram={this.props.referralProgram}
      />
    );
  }
}

const pageDataConnector = connect(
  (state: RootState, { companyId }: { companyId: number }) => {
    return {
      authenticated: state.auth.authenticated,
      theme: themeSelectors.getTheme(state),
      membership: getMembership(state, companyId),
      membershipLoading: state.membership.retrieve.loading,
      membershipError: state.membership.retrieve.error,
    };
  },
  null,
);

const authenticatedCallsConnector = connect(
  (state: RootState, { membership }: { membership: Membership }) => ({
    referralProgram: getTheReferralProgram(state),
    referralProgramLoading: getReferralProgramsLoading(state),
    referralProgramError: getReferralProgramsError(state),
    member: getMemberDetail(state, membership?.id),
    memberLoading: state.member.loading,
    memberError: state.member.error,
    referralMemberStatus: getReferralMemberStatusWithMemberId(
      state,
      membership?.id,
    ),
    referralMemberStatusLoading: getReferralMemberStatusLoading(state),
    referralMemberStatusError: getReferralMemberStatusError(state),
  }),
  {
    fetchMember: fetchMemberAction,
    retrieveReferralProgramForCompany: retrieveReferralProgramForCompanyAction,
    retrieveReferralMemberStatus: retrieveReferralMemberStatusAction,
    fetchMembershipByCompany: fetchMembershipByCompanyAction,
  },
);

type PageProps = Props & RouteComponentProps;

const BasePage: React.FC<PageProps> = (props) => {
  const loginRedirectLink = props.companyId
    ? `/login/customer?membership=${props.companyId}`
    : '/login';
  const handleLoginClick = useCallback(() => {
    props.history.push(loginRedirectLink);
  }, [loginRedirectLink, props.history]);

  return <ConsumerReferralDetail {...props} onLoginClick={handleLoginClick} />;
};

export const ConsumerReferralDetailsPage = compose<Props, OwnProps>(
  withRouter,
  routerParamsToProps({ companyId: 'companyId:number' }),
  pageDataConnector,
  authenticatedCallsConnector,
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(BasePage);
