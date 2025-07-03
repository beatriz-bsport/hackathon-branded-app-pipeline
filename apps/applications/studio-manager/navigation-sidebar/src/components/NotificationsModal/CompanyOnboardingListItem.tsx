import type { FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";
import {
  COMPANY_ONBOARDING_TYPES,
  type CompanyOnboardingAlertData,
  type CompanyOnboardingType,
  PAYMENT_ENGINE_PAYPAL,
  PAYPAL_PENDING_ACTION_TYPES,
  type PayPalPendingActionType,
} from "@bsport/store-staff-management-alerting";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export type CompanyOnboardingListItemProps = {
  id: string;
  type: CompanyOnboardingType | PayPalPendingActionType;
  date?: string;
  paymentEngineIdentifier: CompanyOnboardingAlertData["payment_engine_identifier"];
};

/**
 * CompanyOnboardingListItem displays company onboarding notification information.
 *
 * This component renders different types of company onboarding alerts including
 * business verification, payment setup, banking details, and PayPal-specific issues.
 * It displays appropriate titles and descriptions based on the alert type and
 * payment engine identifier.
 *
 * @param {CompanyOnboardingListItemProps} props - The component props
 * @param {string} props.id - Unique identifier for the alert
 * @param {string} props.type - Type of company onboarding alert
 * @param {string} props.level - Alert level (optional)
 * @param {string} props.date - Alert date (optional)
 * @param {number} props.count - Alert count (optional)
 * @param {number} props.paymentEngineIdentifier - Payment engine ID (optional)
 *
 * @returns {JSX.Element} A styled list item component for company onboarding notifications
 */
const CompanyOnboardingListItem: FC<CompanyOnboardingListItemProps> = ({
  id,
  type,
  date,
  paymentEngineIdentifier,
}) => {
  const { t } = useTranslation("default");

  // Determine title and description based on alert type
  const getContentData = () => {
    if (paymentEngineIdentifier === PAYMENT_ENGINE_PAYPAL) {
      // Map PayPal API types to translations
      const paypalTranslations: Record<string, string> = {
        [PAYPAL_PENDING_ACTION_TYPES.PRIMARY_EMAIL_CONFIRMATION]: t(
          "notifications.companyOnboarding.paypal.primaryEmailConfirmation",
        ),
        [PAYPAL_PENDING_ACTION_TYPES.REQUIRES_MORE_INFORMATION]: t(
          "notifications.companyOnboarding.paypal.requiresMoreInformation",
        ),
        [PAYPAL_PENDING_ACTION_TYPES.ISSUE_CHECK_ACCOUNT]: t(
          "notifications.companyOnboarding.paypal.issueCheckAccount",
        ),
        [PAYPAL_PENDING_ACTION_TYPES.ISSUE_REPEAT_ONBOARDING]: t(
          "notifications.companyOnboarding.paypal.issueRepeatOnboarding",
        ),
      };

      const description =
        paypalTranslations[type] ||
        t("notifications.companyOnboarding.paypal.issueCheckAccount");

      return {
        title: t("notifications.companyOnboarding.paypal.title"),
        description,
        url: LEGACY_URLS.settings_company,
      };
    }

    switch (type) {
      case COMPANY_ONBOARDING_TYPES.VERIFICATION:
        return {
          title: t("notifications.companyOnboarding.verification.title"),
          description: date
            ? t("notifications.companyOnboarding.verification.content", {
                date,
              })
            : t("notifications.companyOnboarding.verification.contentGeneric"),
          url: LEGACY_URLS.settings_companyOnboarding,
        };
      case COMPANY_ONBOARDING_TYPES.CREATION:
        return {
          title: t("notifications.companyOnboarding.creation.title"),
          description: t("notifications.companyOnboarding.creation.content"),
          url: LEGACY_URLS.settings_companyOnboarding,
        };
      case COMPANY_ONBOARDING_TYPES.PAYOUT:
        return {
          title: t("notifications.companyOnboarding.payout.title"),
          description: t("notifications.companyOnboarding.payout.content"),
          url: LEGACY_URLS.settings_company,
        };
      default:
        return {
          title: t("notifications.companyOnboarding.generic.title"),
          description: t("notifications.companyOnboarding.generic.content"),
          url: LEGACY_URLS.settings_company,
        };
    }
  };

  const { title, description, url } = getContentData();

  return (
    <a
      id={id}
      href={url}
      className="relative flex min-h-2xl py-xs px-md gap-xs border-b-stroke-thin border-b-stroke-divider hover:bg-surface-action-default-weak-hovered active:bg-surface-action-default-weak-pressed"
      tabIndex={0}
    >
      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] w-full gap-xs items-center">
        <div className="flex items-center gap-xs">
          <div className="flex-1 min-w-0">
            <Body
              htmlVariant="span"
              size="lg"
              className="block truncate break-word"
            >
              {title}
            </Body>
            <Body
              htmlVariant="span"
              size="md"
              color="weak"
              className="block truncate break-word"
            >
              {description}
            </Body>
          </div>
        </div>
      </div>
    </a>
  );
};

export default CompanyOnboardingListItem;
