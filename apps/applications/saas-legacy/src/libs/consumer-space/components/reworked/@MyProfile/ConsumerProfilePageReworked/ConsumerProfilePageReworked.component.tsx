import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { AxiosResponse } from 'axios';

import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#src/libs/payment/utils';
import ConsumerPageHeader from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader';

import ConsumerSummaryCard from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ConsumerSummaryCard';
import TermsAndConditionsCard from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/TermsAndConditionsCard';
import SavedPaymentMethodCard from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/SavedPaymentMethodCard';
import { ConsumerProfileContext } from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';
import CustomFormPortal from '#Fabrique/Temporary/CustomFormPortal';
import BarcodePortal from '#src/components/css-only/Portals/BarcodePortal';
import FranchiseMarketingPreferencesPortal from '#src/components/css-only/Portals/FranchiseMarketingPreferencesPortal';
import DetachPaymentPortal from '#src/components/css-only/Portals/DetachPaymentPortal';
import TermsAndConditions from '#src/components/css-only/Portals/TermsAndConditions';
import RegularizeDebtModal from '#src/components/css-only/Portals/RegularizeDebtPortal/RegularizeDebtModal.component';
import PaymentModal from '#src/libs/payment/components/PaymentModal.component';
import { AddPaymentMethod } from '#src/libs/payment/components/AddPaymentMethod.component';
import PageContentContainer from '#src/libs/consumer-space/components/reworked/@Layout/PageContentContainer';
import { Edit03 } from '#src/components/untitledui';
import ReferralCard from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ReferralCard';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';

import type {
  CustomForm,
  CustomFormFilledAPI,
} from '#src/libs/custom-form/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { Member } from '#src/libs/member/types';
import type { PaymentMethod } from '#src/libs/payment/types';
import type { OptionCallback } from '#src/state/types';
import type { MarketingPreferenceData } from '#src/libs/communication/types';
import { buildMemberReferralLink } from '@bsport/common/lib/referrals/utils.js';
import Config from '#src/config';
import type {
  ReferralMemberStatus,
  ReferralProgram,
} from '#src/libs/referral/types';

import './styles.css';

type Props = {
  companyCountry: string;
  companyTheme: CompanyTheme;
  companyThemeLoading: boolean;
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback<unknown, number>,
  ) => void;
  detachPaymentMethodLoading: boolean;

  fetchMemberPaymentMethod: () => void;
  isAuthenticated: boolean;
  member: Member;
  memberCustomForm: CustomForm;
  memberError: Error;
  memberLoading: boolean;
  membershipId: number;
  membershipCompany: number;
  membershipLoading: boolean;
  membershipError: Error;
  paymentMethodLoading: boolean;
  paymentMethods: PaymentMethod[];
  requestSetupIntentSecret: () => Promise<
    AxiosResponse<{
      client_secret: string;
    }>
  >;
  referralMemberStatus: ReferralMemberStatus;
  referralMemberStatusError: Error;
  referralMemberStatusLoading: boolean;
  referralProgram: ReferralProgram;
  referralProgramError: Error;
  referralProgramLoading: boolean;
  spiviPrivacySettingsLoading: boolean;
  stripeRegion: string;
  submitCustomForm: (
    formData: FormData,
    options?: OptionCallback<CustomFormFilledAPI>,
  ) => void;
  updateSpiviPrivacySettings: (
    memberId: number,
    settingsAccepted: boolean,
  ) => void;
};

const ConsumerProfilePageReworked: React.FC<Props> = ({
  companyCountry,
  companyTheme,
  companyThemeLoading,
  detachPaymentMethod,
  detachPaymentMethodLoading,
  fetchMemberPaymentMethod,
  isAuthenticated,
  member,
  memberCustomForm,
  memberError,
  memberLoading,
  membershipCompany,
  membershipError,
  membershipId,
  membershipLoading,
  paymentMethodLoading,
  paymentMethods,
  referralMemberStatus,
  referralMemberStatusError,
  referralMemberStatusLoading,
  referralProgram,
  referralProgramError,
  referralProgramLoading,
  requestSetupIntentSecret,
  spiviPrivacySettingsLoading,
  stripeRegion,
  submitCustomForm,
  updateSpiviPrivacySettings,
}) => {
  const { t } = useTranslation(['consumerSpace', 'common', 'snackbar']);

  const {
    isMobile,
    isEditProfilePortalOpen,
    closeEditProfilePortal,
    isBarcodePortalOpen,
    toggleBarcodeModal,
    isDetachPaymentPortalOpen,
    closeAddPaymentMethodPortal,
    isAddPaymentMethodPortalOpen,
    paymentMethodIdToDetach,
    isTermsAndConditionPortalOpen,
    isTermsOfUsePortalOpen,
    toggleTermsAndConditionPortal,
    toggleTermsOfUsePortal,
    closeDetachPaymentMethodPortal,
    openEditProfilePortal,
    openEditProfileMobilePortal,
    closeEditProfileMobilePortal,
    isEditProfileMobilePortalOpen,
    detachPaymentMethodErrorCode,
    setDetachPaymentMethodErrorCode,
    isRegularizeBalancePortalOpen,
    franchiseMarketingPreferences,
    franchiseMarketingPreferencesPortalOpen,
    toggleFranchiseMarketingPreferencesPortal,
    updateMyFranchiseMarketingPreferences,
    franchisorId,
  } = useContext(ConsumerProfileContext);

  const { general_terms_of_use, waiver, is_referral_program_activated } =
    companyTheme ?? {};

  const isLoading =
    companyThemeLoading ||
    memberLoading ||
    paymentMethodLoading ||
    spiviPrivacySettingsLoading ||
    referralProgramLoading ||
    referralMemberStatusLoading ||
    membershipLoading;

  const defaultPaymentMethod =
    companyTheme?.currency === 'eur' ? 'sepa_debit' : 'card';

  const [paymentMethodType, setpaymentMethodType] =
    useState<string>(defaultPaymentMethod);

  const changePaymentMethodType = useCallback((value: string) => {
    setpaymentMethodType(value);
  }, []);

  const handleSubmitCustomForm = useCallback(
    (formdata: FormData, options?: OptionCallback<CustomFormFilledAPI>) => {
      submitCustomForm(formdata, {
        onSuccess: () => {
          isMobile ? closeEditProfileMobilePortal() : closeEditProfilePortal();
          options?.onSuccess?.();
        },
        onError: () => {
          isMobile ? closeEditProfileMobilePortal() : closeEditProfilePortal();
          options?.onError?.();
        },
      });
    },
    [
      closeEditProfilePortal,
      closeEditProfileMobilePortal,
      isMobile,
      submitCustomForm,
    ],
  );

  const handleDetachPaymentMethod = useCallback(
    (paymentMethodId: string) => () => {
      const isWidget =
        WidgetUtils.getConsumerSpaceContext() ===
        ConsumerSpaceContextEnum.WIDGET;
      isWidget && setDetachPaymentMethodErrorCode(null);
      detachPaymentMethod(paymentMethodId, {
        onSuccess: () => {
          closeDetachPaymentMethodPortal();
        },
        onError: (errorCode: number) => {
          if (isWidget) {
            return setDetachPaymentMethodErrorCode(errorCode);
          }
          closeDetachPaymentMethodPortal();
        },
      });
    },
    [
      detachPaymentMethod,
      closeDetachPaymentMethodPortal,
      setDetachPaymentMethodErrorCode,
    ],
  );

  const handleUpdateMyFranchiseMarketingPreferences = React.useCallback(
    (values: MarketingPreferenceData[]) => {
      return (
        !!franchisorId &&
        updateMyFranchiseMarketingPreferences(
          {
            franchise_id: franchisorId,
            data: values,
          },
          { onSuccess: toggleFranchiseMarketingPreferencesPortal },
        )
      );
    },
    [
      updateMyFranchiseMarketingPreferences,
      toggleFranchiseMarketingPreferencesPortal,
      franchisorId,
    ],
  );
  const buttonsData = React.useMemo(
    () => [
      {
        label: t('reworked.myProfile.header.buttons.editProfile'),
        onClick: isMobile ? openEditProfileMobilePortal : openEditProfilePortal,
        leftIcon: <Edit03 stroke="currentColor" />,
      },
    ],
    [t, isMobile, openEditProfileMobilePortal, openEditProfilePortal],
  );
  if (!member) return null;

  const referralLink = is_referral_program_activated
    ? `${Config.PUBLIC_URL}${buildMemberReferralLink(
        membershipCompany,
        member?.referral_uuid,
      )}`
    : '';

  const referralCardHasUnknownError =
    !!referralProgramError ||
    !!memberError ||
    !!membershipError ||
    !!referralMemberStatusError;

  const {
    accept_email,
    accept_sms,
    address,
    barcode,
    birthday,
    credit_account_balance,
    date_joined,
    email,
    emergency_contact,
    firstname,
    gender,
    general_terms_and_conditions_date_accepted,
    general_terms_of_use_date_accepted,
    id,
    lastname,
    name,
    membership_ID,
    official_document_id,
    photo,
    spivi_privacy_settings_accepted,
    phone_number,
  } = member;

  return (
    <PageContentContainer
      contentClassName={clsx('bs-consumer-profile-page__root', {
        'bs-consumer-profile-page__root--fab':
          WidgetUtils.getConsumerSpaceContext() ===
          ConsumerSpaceContextEnum.FAB,
      })}
    >
      <ConsumerPageHeader
        isMobile={isMobile}
        TitleProps={{
          buttons: buttonsData,
          title: t('reworked.myProfile.header.title'),
        }}
      />
      <div
        className={
          isMobile
            ? 'bs-consumer-profile-page__body--mobile'
            : 'bs-consumer-profile-page__body'
        }
      >
        <div className="bs-consumer-profile-page__body__consumer-summary">
          <ConsumerSummaryCard
            acceptEmail={accept_email}
            acceptSms={accept_sms}
            address={address}
            birthday={birthday}
            companyId={membershipCompany}
            creditAccountBalance={credit_account_balance}
            email={email}
            emergencyContact={emergency_contact}
            firstName={firstname}
            gender={gender}
            isLoading={isLoading}
            lastName={lastname}
            memberId={id}
            membershipId={membership_ID}
            officialDocumentId={official_document_id}
            phoneNumber={phone_number}
            photo={photo}
            regularizeBalanceAllowed={companyTheme?.consumer_regularize_debt}
            showAccountBalance={companyTheme?.show_member_account_balance}
            showBarcodeButton={companyTheme?.show_barcode_button}
            showMembershipNumber={companyTheme?.show_membership_number}
            spiviPrivacySettingsAccepted={spivi_privacy_settings_accepted}
            spiviPrivacySettingsLoading={spiviPrivacySettingsLoading}
            updateSpiviPrivacySettings={updateSpiviPrivacySettings}
          />
        </div>
        <div className="bs-consumer-profile-page__body__consumer-settings">
          <SavedPaymentMethodCard
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            isLoading={isLoading}
            paymentMethodLoading={paymentMethodLoading}
            paymentMethods={paymentMethods}
          />

          <ReferralCard
            hasUnknownError={referralCardHasUnknownError}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            nbRemainingReferralUses={
              referralMemberStatus?.nb_remaining_referral_uses
            }
            referralLink={referralLink}
            referralProgram={referralProgram}
          />

          <TermsAndConditionsCard
            dateJoined={date_joined}
            generalTermsAndConditionsDateAccepted={
              general_terms_and_conditions_date_accepted
            }
            generalTermsOfUseDateAccepted={general_terms_of_use_date_accepted}
            isLoading={isLoading}
          />
        </div>
      </div>

      <CustomFormPortal
        isCssVariantActivated
        shouldWrapLayerInCssHoc
        confirmLabel={t('common:save')}
        generalTermsAndConditions={general_terms_of_use}
        initial={memberCustomForm}
        isMobile={isMobile}
        isOpen={
          isMobile ? isEditProfileMobilePortalOpen : isEditProfilePortalOpen
        }
        layouts={memberCustomForm?.layout}
        onCancel={
          isMobile ? closeEditProfileMobilePortal : closeEditProfilePortal
        }
        onClose={
          isMobile ? closeEditProfileMobilePortal : closeEditProfilePortal
        }
        // @ts-expect-error bad typing of the submitCustomForm action
        onSubmit={handleSubmitCustomForm}
        title={t('consumerSpace:reworked.myProfile.edition.title')}
        waiver={waiver}
      />

      <BarcodePortal
        barcode={barcode}
        isMobile={isMobile}
        isOpen={isBarcodePortalOpen}
        onClose={toggleBarcodeModal}
        subtitle={t('consumerSpace:reworked.myProfile.barCode.scanInfo')}
        title={t('consumerSpace:reworked.myProfile.barCode.scan')}
      />
      <FranchiseMarketingPreferencesPortal
        isMobile={isMobile}
        isOpen={franchiseMarketingPreferencesPortalOpen}
        onClose={toggleFranchiseMarketingPreferencesPortal}
        preferences={franchiseMarketingPreferences}
        subtitle={t(
          'consumerSpace:reworked.myProfile.notifications.portal.subtitle',
        )}
        title={t('consumerSpace:reworked.myProfile.notifications.portal.title')}
        updateMyFranchiseMarketingPreferences={
          handleUpdateMyFranchiseMarketingPreferences
        }
      />
      <DetachPaymentPortal
        confirmLabel={t('common:delete')}
        errorMessage={
          detachPaymentMethodErrorCode
            ? t(`snackbar:paymentMethod.errors.${detachPaymentMethodErrorCode}`)
            : null
        }
        isLoading={detachPaymentMethodLoading}
        isMobile={isMobile}
        isOpen={isDetachPaymentPortalOpen}
        onClose={closeDetachPaymentMethodPortal}
        onConfirm={handleDetachPaymentMethod(paymentMethodIdToDetach)}
        subtitle={t('consumerSpace:reworked.myProfile.detachPayment.subtitle')}
        title={t('consumerSpace:reworked.myProfile.detachPayment.title')}
      />

      <TermsAndConditions
        isMobile={isMobile}
        isOpen={isTermsAndConditionPortalOpen}
        onClose={toggleTermsAndConditionPortal}
        terms={companyTheme?.general_terms_and_conditions}
        title={t('consumerSpace:reworked.myProfile.termsAndConditions.title')}
      />

      <TermsAndConditions
        isMobile={isMobile}
        isOpen={isTermsOfUsePortalOpen}
        onClose={toggleTermsOfUsePortal}
        terms={companyTheme?.general_terms_of_use}
        title={t(
          'consumerSpace:reworked.myProfile.termsAndConditions.termOfuse',
        )}
      />

      {!!membershipId &&
        !!credit_account_balance &&
        isRegularizeBalancePortalOpen && (
          <RegularizeDebtModal
            defaultUserEmail={member?.email}
            defaultUserName={member?.name}
          />
        )}

      {membershipId && !!companyCountry && !!stripeRegion && (
        <PaymentModal isOpen={isAddPaymentMethodPortalOpen}>
          <AddPaymentMethod
            cardBillingDetailsMandatory={
              companyTheme?.force_billing_details_on_cards
            }
            companyId={membershipCompany}
            enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods(
              {
                currency: companyTheme?.currency,
                companyCountry,
                stripeRegion,
              },
            )}
            onCancel={closeAddPaymentMethodPortal}
            onChange={changePaymentMethodType}
            paymentMethodType={paymentMethodType}
            refreshSavedPaymentMethodList={fetchMemberPaymentMethod}
            requestSetupIntentSecret={requestSetupIntentSecret}
            sepaDefaultEmail={email ?? ''}
            sepaDefaultName={name ?? ''}
          />
        </PaymentModal>
      )}
    </PageContentContainer>
  );
};

export default React.memo(ConsumerProfilePageReworked);
