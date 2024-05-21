import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AxiosResponse } from 'axios';

import { getBackofficeBillingPlanEnabledPaymentMethods } from '#libs/payment/utils';

import MarketplacePageContent from '#csscomponents/MarketplacePageContent';
import ConsumerSummaryCard from '#libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/ConsumerSummaryCard';
import TermsAndConditionsCard from '#libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/TermsAndConditionsCard';
import SavedPaymentMethodCard from '#libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileCards/SavedPaymentMethodCard';
import ConsumerProfileHeader from '#libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileHeader';
import { ConsumerProfileContext } from '#libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';
import CustomFormPortal from '#Fabrique/Temporary/CustomFormPortal';
import BarcodePortal from '#csscomponents/Portals/BarcodePortal';
import DetachPaymentPortal from '#csscomponents/Portals/DetachPaymentPortal';
import TermsAndConditions from '#csscomponents/Portals/TermsAndConditions';
import PaymentModal from '#libs/payment/components/PaymentModal.component';
import { AddPaymentMethod } from '#libs/payment/components/AddPaymentMethod.component';

import type {
  CustomForm,
  CustomFormFieldAnswer,
} from '#libs/custom-form/types';
import type { CompanyTheme } from '#libs/theme/types';
import type { Member } from '#libs/member/types';
import type { PaymentMethod } from '#libs/payment/types';
import type { OptionCallback } from '#src/state/types';

import './styles.css';

type Props = {
  companyCountry: string;
  companyTheme: CompanyTheme;
  companyThemeLoading: boolean;
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback,
  ) => void;
  detachPaymentMethodLoading: boolean;
  fetchMemberPaymentMethod: () => void;
  member: Member;
  memberCustomForm: CustomForm;
  memberLoading: boolean;
  membershipId: number;
  membershipCompany: number;
  paymentMethodLoading: boolean;
  paymentMethods: PaymentMethod[];
  requestSetupIntentSecret: () => Promise<
    AxiosResponse<{
      client_secret: string;
    }>
  >;
  spiviPrivacySettingsLoading: boolean;
  stripeRegion: string;
  submitCustomForm: (
    formdata: CustomFormFieldAnswer,
    options?: OptionCallback,
  ) => void;
  updateSpiviPrivacySettings: (
    memberId: number,
    settingsAccepted: boolean,
  ) => void;
};

const ConsumerProfilePageReworked: React.FC<Props> = ({
  companyTheme,
  companyThemeLoading,
  detachPaymentMethod,
  detachPaymentMethodLoading,
  fetchMemberPaymentMethod,
  member,
  memberCustomForm,
  memberLoading,
  membershipId,
  membershipCompany,
  paymentMethodLoading,
  paymentMethods,
  spiviPrivacySettingsLoading,
  companyCountry,
  stripeRegion,
  requestSetupIntentSecret,
  submitCustomForm,
  updateSpiviPrivacySettings,
}) => {
  const { t } = useTranslation(['consumerSpace', 'common']);

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
  } = useContext(ConsumerProfileContext);

  const { general_terms_of_use, waiver } = companyTheme ?? {};

  const isLoading =
    companyThemeLoading ||
    memberLoading ||
    paymentMethodLoading ||
    spiviPrivacySettingsLoading;

  const defaultPaymentMethod =
    companyTheme?.currency === 'eur' ? 'sepa_debit' : 'card';

  const [paymentMethodType, setpaymentMethodType] =
    useState<string>(defaultPaymentMethod);

  const changePaymentMethodType = useCallback((value: string) => {
    setpaymentMethodType(value);
  }, []);

  const handleSubmitCustomForm = useCallback(
    (formdata: CustomFormFieldAnswer) => {
      submitCustomForm(formdata, {
        onSuccess: () => {
          closeEditProfilePortal();
        },
        onError: () => {
          closeEditProfilePortal();
        },
      });
    },
    [closeEditProfilePortal, submitCustomForm],
  );

  const handleDetachPaymentMethod = useCallback(
    (paymentMethodId: string) => () => {
      detachPaymentMethod(paymentMethodId, {
        onSuccess: () => {
          closeDetachPaymentMethodPortal();
        },
        onError: () => {
          closeDetachPaymentMethodPortal();
        },
      });
    },
    [detachPaymentMethod, closeDetachPaymentMethodPortal],
  );

  if (!member) return null;

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
    general_terms_and_conditions_accepted,
    general_terms_and_conditions_date_accepted,
    general_terms_of_use_accepted,
    general_terms_of_use_date_accepted,
    id,
    lastname,
    name,
    membership_ID,
    official_document_id,
    photo,
    spivi_privacy_settings_accepted,
    total_unpaid_amount,
    phone_number,
  } = member;

  return (
    <MarketplacePageContent className="bs-consumer-profile-page__root">
      <ConsumerProfileHeader isLoading={isLoading} />
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
            showAccountBalance={companyTheme?.show_member_account_balance}
            showBarcodeButton={companyTheme?.show_barcode_button}
            showMembershipNumber={companyTheme?.show_membership_number}
            spiviPrivacySettingsAccepted={spivi_privacy_settings_accepted}
            spiviPrivacySettingsLoading={spiviPrivacySettingsLoading}
            totalUnpaidAmount={total_unpaid_amount}
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
        isOpen={isEditProfilePortalOpen}
        layouts={memberCustomForm?.layout}
        onCancel={closeEditProfilePortal}
        onClose={closeEditProfilePortal}
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

      <DetachPaymentPortal
        confirmLabel={t('common:delete')}
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
        // @ts-expect-error bad typing, it should be a string and not a boolean
        terms={general_terms_and_conditions_accepted}
        title={t('consumerSpace:reworked.myProfile.termsAndConditions.title')}
      />

      <TermsAndConditions
        isMobile={isMobile}
        isOpen={isTermsOfUsePortalOpen}
        onClose={toggleTermsOfUsePortal}
        terms={general_terms_of_use_accepted}
        title={t(
          'consumerSpace:reworked.myProfile.termsAndConditions.termOfuse',
        )}
      />

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
    </MarketplacePageContent>
  );
};

export default React.memo(ConsumerProfilePageReworked);
