import React from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import {
  fetchMember as fetchMemberAction,
  fetchMyUserProfile as fetchMyUserProfileAction,
  updateSpiviPrivacySettings as updateSpiviPrivacySettingsAction,
} from '#src/libs/member/actions';
import {
  detachPaymentMethod as detachPaymentMethodAction,
  fetchPaymentMethodList as fetchPaymentMethodListAction,
} from '#src/libs/payment/actions';
import {
  fetchCompanyCustomMemberForm as fetchCompanyCustomMemberFormAction,
  submitCustomForm as submitCustomFormAction,
} from '#src/libs/custom-form/actions';

import {
  getCompanyCountry,
  getStripeRegion,
  getTheme,
} from '#src/libs/theme/selectors';
import { getConsumerProfileCustomForm } from '#src/libs/custom-form/selectors';
import { getMemberDetail } from '#src/libs/member/selectors';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';

import ConsumerProfilePageReworked from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfilePageReworked';
import ConsumerProfileContextProvider from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';

import type { RootState } from '#src/reducers';
import type { Membership } from '#src/libs/membership/types';
import type { CustomFormFieldAnswer } from '#src/libs/custom-form/types';
import type { OptionCallback } from '#src/state/types';

type OwnProps = {
  membership: Membership;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

class ConsumerProfileReworked extends React.Component<Props> {
  componentDidMount() {
    if (this.props.membership) {
      this.props.fetchMember(this.props.membership.id);
      this.fetchMemberPaymentMethod();
      this.props.fetchCompanyCustomMemberForm({
        company: this.props.membership.company,
      });
      this.props.fetchMyUserProfile();
    }
  }

  detachPaymentMethod = (paymentMethodId: string, options?: OptionCallback) => {
    this.props.detachPaymentMethod(
      {
        member: this.props.membership.id,
        payment_method_id: paymentMethodId,
      },
      {
        onSuccess: () => {
          this.props.fetchPaymentMethodList({
            member: this.props.membership.id,
          });
          options?.onSuccess?.();
        },
        onError: () => {
          options?.onError?.();
        },
      },
    );
  };

  fetchMemberPaymentMethod = () => {
    this.props.fetchPaymentMethodList({ member: this.props.membership.id });
  };

  submitCustomForm = (
    formData: CustomFormFieldAnswer,
    options?: OptionCallback,
  ) => {
    this.props.submitCustomForm(formData, this.props.membership.company, {
      onSuccess: () => {
        this.props.fetchMember(this.props.membership.id);
        this.props.fetchMyUserProfile();
        options?.onSuccess?.();
      },
      onError: options?.onError,
    });
  };

  requestSetupIntentSecret = () => {
    return requestSetupIntentSecretAPI(this.props.membership.id, null);
  };

  render() {
    const {
      companyTheme,
      companyThemeLoading,
      detachPaymentMethodLoading,
      member,
      memberCustomForm,
      memberLoading,
      membership,
      paymentMethodLoading,
      paymentMethods,
      spiviPrivacySettingsLoading,
      updateSpiviPrivacySettings,
    } = this.props;

    const companyCountry = getCompanyCountry();
    const stripeRegion = getStripeRegion();

    return (
      <ConsumerProfileContextProvider>
        <ConsumerProfilePageReworked
          companyCountry={companyCountry}
          companyTheme={companyTheme}
          companyThemeLoading={companyThemeLoading}
          detachPaymentMethod={this.detachPaymentMethod}
          detachPaymentMethodLoading={detachPaymentMethodLoading}
          fetchMemberPaymentMethod={this.fetchMemberPaymentMethod}
          member={member}
          memberCustomForm={memberCustomForm}
          memberLoading={memberLoading}
          membershipCompany={membership.company}
          membershipId={membership.id}
          paymentMethodLoading={paymentMethodLoading}
          paymentMethods={paymentMethods}
          requestSetupIntentSecret={this.requestSetupIntentSecret}
          spiviPrivacySettingsLoading={spiviPrivacySettingsLoading}
          stripeRegion={stripeRegion}
          submitCustomForm={this.submitCustomForm}
          updateSpiviPrivacySettings={updateSpiviPrivacySettings}
        />
      </ConsumerProfileContextProvider>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  { membership }: { membership: Membership },
) => ({
  companyThemeLoading: state.theme.loading,
  memberLoading: state.member.loading,
  member: getMemberDetail(state, membership && membership.id),
  companyTheme: getTheme(state),
  paymentMethods: state.paymentBackend.paymentMethod.items,
  paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  memberCustomForm: getConsumerProfileCustomForm(state, membership?.id),
  spiviPrivacySettingsLoading: state.member.spivi_privacy_settings.loading,
});

const mapDispatchToProps = {
  fetchMember: fetchMemberAction,
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  detachPaymentMethod: detachPaymentMethodAction,
  fetchCompanyCustomMemberForm: fetchCompanyCustomMemberFormAction,
  submitCustomForm: submitCustomFormAction,
  fetchMyUserProfile: fetchMyUserProfileAction,
  updateSpiviPrivacySettings: updateSpiviPrivacySettingsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const UnconnectedConsumerProfile = compose(
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerProfileReworked);

export default connector(UnconnectedConsumerProfile);
