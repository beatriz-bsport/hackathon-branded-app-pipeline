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
  retrieveReferralProgramForCompany as retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAction,
} from '#src/libs/referral/actions';

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
import type { CustomFormFilledAPI } from '#src/libs/custom-form/types';
import type { OptionCallback } from '#src/state/types';
import {
  getReferralMemberStatusError,
  getReferralMemberStatusLoading,
  getReferralMemberStatusWithMemberId,
  getReferralProgramsError,
  getReferralProgramsLoading,
  getTheReferralProgram,
} from '#src/libs/referral/selectors';
import type { CompanyTheme } from '#src/libs/theme/types';

type OwnProps = {
  membership: Membership;
  /**
   * In the widget case, the membership is not available right away.
   * For that reason we pass companyId
   */
  companyId?: number;
  closeEditProfilePortalOnMobile: () => void;
  isEditProfileMobilePortalOpen: boolean;
  /** Company theme for widget case */
  theme?: CompanyTheme;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

class ConsumerProfileReworked extends React.Component<Props> {
  componentDidMount() {
    if (!!this.props.membership?.id || !!this.props.companyId) {
      this.props.membership?.id &&
        this.props.fetchMember(this.props.membership.id, {}, { me: true });
      this.fetchMemberPaymentMethod();
      this.props.fetchCompanyCustomMemberForm(
        this.props.companyId ?? this.props.membership?.company,
      );
      this.props.fetchMyUserProfile();
      this.fetchReferralData();
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
    formData: FormData,
    options?: OptionCallback<CustomFormFilledAPI>,
  ) => {
    this.props.submitCustomForm(
      {
        form_filled: formData,
        companyId: this.props.companyId ?? this.props.membership?.company,
      },
      {
        onSuccess: () => {
          this.props.fetchMember(this.props.membership.id, {}, { me: true });
          this.props.fetchMyUserProfile();
          options?.onSuccess?.();
        },
        onError: options?.onError,
      },
    );
  };

  requestSetupIntentSecret = () => {
    return requestSetupIntentSecretAPI(this.props.membership?.id, null);
  };

  fetchReferralData = () => {
    if (!this.props.referralProgram) {
      this.props.retrieveReferralProgramForCompany(
        this.props.companyId ?? this.props.membership.company,
        {
          onSuccess: () => {
            if (
              this.props.authenticated &&
              (this.props.theme?.is_referral_program_activated ||
                this.props.companyTheme?.is_referral_program_activated)
            ) {
              this.props.retrieveReferralMemberStatus(this.props.membership.id);
            }
          },
        },
      );
    }
  };

  render() {
    const {
      authenticated,
      closeEditProfilePortalOnMobile,
      companyTheme,
      companyThemeLoading,
      detachPaymentMethodLoading,
      isEditProfileMobilePortalOpen,
      member,
      memberCustomForm,
      memberError,
      memberLoading,
      membership,
      membershipError,
      membershipLoading,
      paymentMethodLoading,
      paymentMethods,
      referralMemberStatus,
      referralMemberStatusError,
      referralMemberStatusLoading,
      referralProgram,
      referralProgramError,
      referralProgramLoading,
      spiviPrivacySettingsLoading,
      updateSpiviPrivacySettings,
    } = this.props;

    const companyCountry = getCompanyCountry();
    const stripeRegion = getStripeRegion();

    return (
      <ConsumerProfileContextProvider>
        <ConsumerProfilePageReworked
          closeEditProfilePortalOnMobile={closeEditProfilePortalOnMobile}
          companyCountry={companyCountry}
          companyTheme={this.props.theme ?? companyTheme}
          companyThemeLoading={companyThemeLoading}
          detachPaymentMethod={this.detachPaymentMethod}
          detachPaymentMethodLoading={detachPaymentMethodLoading}
          fetchMemberPaymentMethod={this.fetchMemberPaymentMethod}
          isAuthenticated={authenticated}
          isEditProfileMobilePortalOpen={isEditProfileMobilePortalOpen}
          member={member}
          memberCustomForm={memberCustomForm}
          memberError={memberError}
          memberLoading={memberLoading}
          membershipCompany={this.props.companyId ?? membership.company}
          membershipError={membershipError}
          membershipId={membership.id}
          membershipLoading={membershipLoading}
          paymentMethodLoading={paymentMethodLoading}
          paymentMethods={paymentMethods}
          referralMemberStatus={referralMemberStatus}
          referralMemberStatusError={referralMemberStatusError}
          referralMemberStatusLoading={referralMemberStatusLoading}
          referralProgram={referralProgram}
          referralProgramError={referralProgramError}
          referralProgramLoading={referralProgramLoading}
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
  authenticated: state.auth.authenticated,
  companyThemeLoading: state.theme.loading,
  memberLoading: state.member.loading,
  member: getMemberDetail(state, membership?.id),
  memberError: state.member.error,
  companyTheme: getTheme(state),
  paymentMethods: state.paymentBackend.paymentMethod.items,
  paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  memberCustomForm: getConsumerProfileCustomForm(state, membership?.id),
  spiviPrivacySettingsLoading: state.member.spivi_privacy_settings.loading,
  referralProgram: getTheReferralProgram(state),
  referralProgramLoading: getReferralProgramsLoading(state),
  referralProgramError: getReferralProgramsError(state),
  referralMemberStatus: getReferralMemberStatusWithMemberId(
    state,
    membership?.id,
  ),
  referralMemberStatusLoading: getReferralMemberStatusLoading(state),
  referralMemberStatusError: getReferralMemberStatusError(state),
  membershipLoading: state.membership.retrieve.loading,
  membershipError: state.membership.retrieve.error,
});

const mapDispatchToProps = {
  fetchMember: fetchMemberAction,
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  detachPaymentMethod: detachPaymentMethodAction,
  fetchCompanyCustomMemberForm: fetchCompanyCustomMemberFormAction,
  submitCustomForm: submitCustomFormAction,
  fetchMyUserProfile: fetchMyUserProfileAction,
  updateSpiviPrivacySettings: updateSpiviPrivacySettingsAction,
  retrieveReferralProgramForCompany: retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus: retrieveReferralMemberStatusAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const UnconnectedConsumerProfile = compose(
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerProfileReworked);

export default connector(UnconnectedConsumerProfile);
