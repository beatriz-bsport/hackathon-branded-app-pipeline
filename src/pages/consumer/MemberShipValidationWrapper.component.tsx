import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fetchSignFormUpConfiguration } from '../../libs/sign-up-form/actions';
import {
  fetchMember as fetchMemberAction,
  fetchMyUserProfile,
} from '../../libs/member/actions';
import { requestMembershipValidation as requestMembershipValidationAction } from '../../libs/membership/actions';
import { fetchCurrentBasket as fetchCurrentBasketAction } from '../../libs/checkout/actions';
import {
  getMemberThroughMembership,
  getMemberDetailData,
} from '../../libs/member/selectors';
import { RootState } from '../../reducers';
import type { Membership } from '../../libs/membership/types';
import { getMembership } from '../../libs/membership/selectors';
import MemberShipValidationWrapperInnerComponent from './MemberShipValidationWrapperInner.component';

type OwnProps = {
  companyId: number;
  membership: Membership;
  authenticated: boolean;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

export class MemberShipValidationWrapper extends React.Component<Props> {
  componentDidMount() {
    if (this.props.companyId) {
      this.props.fetchSignFormUpConfiguration({
        membership: this.props.companyId,
      });
      if (this.props.authenticated) {
        this.props.requestMembershipValidation({
          company: this.props.companyId,
        });
      }
    }

    if (this.props.membership) {
      this.props.fetchMember(
        typeof this.props.membership === 'number'
          ? this.props.membership
          : this.props.membership.id,
      );
    } else {
      this.props.fetchMyUserProfile();
    }
  }

  fetchBasket = () => {
    if (this.props.authenticated && this.props.companyId) {
      this.props.fetchCurrentBasket(this.props.companyId);
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.authenticated && !prevProps.authenticated) {
      this.props.requestMembershipValidation({
        company: this.props.companyId,
      });
    }
    if (
      this.props.membership &&
      prevProps.membership !== this.props.membership
    ) {
      this.props.fetchMember(
        typeof this.props.membership === 'number'
          ? this.props.membership
          : this.props.membership.id,
      );
      this.fetchBasket();
    }
  }

  render() {
    if (!this.props.theme && !this.props.authenticated) {
      return this.props.children;
    }
    return <MemberShipValidationWrapperInnerComponent {...this.props} />;
  }
}

const mapStateToProps = (
  state: RootState,
  { companyId }: { companyId: number },
) => ({
  authenticated: state.auth.authenticated,
  member: getMemberThroughMembership(getMemberDetailData)(state, companyId),
  membership: getMembership(state, companyId),
});

const mapDispatchToProps = {
  fetchMember: fetchMemberAction,
  fetchSignFormUpConfiguration,
  fetchMyUserProfile,
  requestMembershipValidation: requestMembershipValidationAction,
  fetchCurrentBasket: fetchCurrentBasketAction,
};
export default compose<any, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
)(MemberShipValidationWrapper);
