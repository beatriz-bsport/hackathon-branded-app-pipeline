import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fetchSignFormUpConfiguration } from '../../libs/sign-up-form/actions';
import {
  fetchMember as fetchMemberAction,
  fetchMyUserProfile,
} from '../../libs/member/actions';
import {
  fetchMembershipByCompany,
  requestMembershipValidation as requestMembershipValidationAction,
} from '../../libs/membership/actions';
import {
  requestMemberCustomFormNotification,
  fetchMissingCustomFormBulk,
  fetchBlockingCustomFormDisplayRuleBulk,
  fetchCompanyCustomMemberForm,
} from '../../libs/custom-form/actions';
import { fetchCurrentBasket as fetchCurrentBasketAction } from '../../libs/checkout/actions';
import {
  getMemberThroughMembership,
  getMemberDetailData,
} from '../../libs/member/selectors';
import { RootState } from '../../reducers';
import type { Membership } from '../../libs/membership/types';
import {
  getMembership,
  getCustomFormMissingList,
  getCustomFormBlockingDisplayRuleIdsList,
} from '../../libs/membership/selectors';
import MemberShipValidationWrapperInnerComponent from './MemberShipValidationWrapperInner.component';

type OwnProps = {
  companyId: number;
  membership: Membership;
  authenticated: boolean;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
const urlRegex = new RegExp('/m/[^/]+/[0-9]+/form/.*');
export class MemberShipValidationWrapper extends React.Component<Props> {
  componentDidMount() {
    if (this.props.companyId) {
      this.props.fetchMembershipByCompany(this.props.companyId);
      this.props.fetchCompanyCustomMemberForm({
        company: this.props.companyId,
      });
      if (this.props.authenticated) {
        this.props.requestMembershipValidation({
          company: this.props.companyId,
        });
        this.props.requestMemberCustomFormNotification(
          {
            company_id: this.props.companyId,
          },
          {
            onSuccess: (payload) => {
              this.props.fetchMissingCustomFormBulk({
                id__in: payload.missing_custom_form_informations.map(
                  (info: {
                    custom_form_id: number;
                    custom_form_display_rule: number;
                  }) => info.custom_form_id,
                ),
              });
              this.props.fetchBlockingCustomFormDisplayRuleBulk({
                id__in: payload.missing_custom_form_informations.map(
                  (info: {
                    custom_form_id: number;
                    custom_form_display_rule_id: number;
                  }) => info.custom_form_display_rule_id,
                ),
              });
            },
          },
        );
      }
    }

    if (this.props.membership) {
      this.props.fetchMember(
        typeof this.props.membership === 'number'
          ? this.props.membership
          : this.props.membership.id,
      );
      this.props.fetchMyUserProfile();
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
    if (this.props.companyId !== prevProps.companyId && this.props.companyId) {
      this.props.fetchMembershipByCompany(this.props.companyId);
      this.props.fetchCompanyCustomMemberForm({
        company: this.props.companyId,
      });
    }
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

  checkForFormUrlLocation = () => urlRegex.test(window.location.href);

  render() {
    if (!this.props.theme && !this.props.authenticated) {
      return this.props.children;
    }
    return (
      <MemberShipValidationWrapperInnerComponent
        {...this.props}
        isFormUrl={this.checkForFormUrlLocation()}
      />
    );
  }
}

const mapStateToProps = (
  state: RootState,
  { companyId }: { companyId: number },
) => ({
  authenticated: state.auth.authenticated,
  member: getMemberThroughMembership(getMemberDetailData)(state, companyId),
  membership: getMembership(state, companyId),
  customFormIdsList: getCustomFormMissingList(state),
  customFormDisplayRuleList: getCustomFormBlockingDisplayRuleIdsList(state),
});

const mapDispatchToProps = {
  fetchMember: fetchMemberAction,
  fetchMembershipByCompany,
  fetchSignFormUpConfiguration,
  fetchMyUserProfile,
  requestMembershipValidation: requestMembershipValidationAction,
  fetchCurrentBasket: fetchCurrentBasketAction,
  requestMemberCustomFormNotification,
  fetchMissingCustomFormBulk,
  fetchBlockingCustomFormDisplayRuleBulk,
  fetchCompanyCustomMemberForm,
};
export default compose<any, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
)(MemberShipValidationWrapper);
