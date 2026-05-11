import type { CommunicationVariable } from "@bsport/api-cdp/notification-rule";
import type { AutocompleteProps } from "@bsport/kaizen-primitive-core";

import { i18nInstance } from "#src/utils/i18n";

export const communicationVariableTags: Record<string, string[]> = {
  Offer: [
    "activity",
    "coach",
    "date",
    "establishment",
    "establishment_practical_info",
    "address",
  ],
  User: [
    "firstname",
    "lastname",
    "unsubscribe_link",
    "reset_password_url",
    "email_confirmation_url",
    "marketing_email_double_opt_in_url",
  ],
  Booking: [
    "activity",
    "coach",
    "date",
    "establishment",
    "establishment_practical_info",
    "address",
    "ics_calendar_link",
    "spot",
    "canceled_grouped_session",
  ],
  ConsumerPaymentPack: [
    "pass_price",
    "pass_name",
    "pass_starting_date",
    "pass_expiration",
    "pass_credit_left",
  ],
  BillingPlan: [
    "subscription_name",
    "subscription_recurrent_price",
    "subscription_nb_months",
    "subscription_nb_bills",
    "subscription_duration",
    "subscription_flat_fee",
    "subscription_payment_method",
    "subscription_nb_days_pause",
    "subscription_next_invoice_date",
    "subscription_contract_terms_link",
    "days_until_payment_method_expiration",
  ],
  BookingOption: [
    "activity",
    "coach",
    "date",
    "establishment",
    "establishment_practical_info",
    "address",
    "option_payment_url",
    "option_expiration_date",
    "waiting_list_position",
    "waiting_list_size",
  ],
  PrivateBooking: [
    "activity",
    "coach",
    "date",
    "establishment",
    "establishment_practical_info",
    "address",
    "ics_calendar_link",
  ],
  PrivateConsumerPass: [
    "pass_price",
    "pass_name",
    "pass_starting_date",
    "pass_expiration",
    "pass_credit_left",
  ],
  Company: [
    "company_websiteURL",
    "company_info",
    "android_app_URL",
    "android_app_url",
    "ios_app_URL",
    "ios_app_url",
    "company_facebookURL",
    "company_instagramURL",
    "company_scheduleURL",
    "login_url",
    "company",
    "company_primary_color",
    "company_name",
    "company_logo",
    "currency",
  ],
  GuestInvitation: [
    "firstname_guest",
    "lastname_guest",
    "firstname_host",
    "lastname_host",
  ],
  RecurrentRule: [
    "activity",
    "coach",
    "date",
    "establishment",
    "establishment_practical_info",
    "address",
    "recurring_booking_fail_reason",
  ],
  Birthday: [],
  ReplacementRequest: ["sub_teacher", "closing_date"],
  Invoice: [
    "id",
    "invoice_price",
    "invoice_sum_up",
    "invoice_date",
    "invoice_download_link",
    "days_until_payment_method_expiration_planned_payment_event",
  ],
  GiftCard: [
    "giftcard_message",
    "activate_giftcard_url",
    "message_is_from",
    "message_is_for",
    "giftcard_value",
    "giftcard_name",
    "activation_datetime",
    "pdf_link",
    "printable_code",
  ],
  EmailChange: [
    "new_email",
    "old_email",
    "manage_changing_email_link",
    "login_link",
  ],
  SpiviPerformance: [
    "total_distance",
    "calories_kJ",
    "calories",
    "max_watts",
    "maximum_speed",
    "max_RPM",
    "max_HR",
    "average_watts",
    "average_speed",
    "average_RPM",
    "average_HR",
    "SEP",
  ],
  ReferralProgram: [
    "reduction_purchase_referred",
    "referring_reward",
    "minimum_purchase_referral",
    "deadline_use_referral",
    "referring_firstname",
    "referring_lastname",
    "referred_firstname",
    "referred_lastname",
    "referral_link",
    "registration_date",
  ],
};

export type CommunicationVariableCategory =
  keyof typeof communicationVariableTags;

export function isValidCommunicationVariableCategory(
  str: string,
): str is CommunicationVariableCategory {
  return Object.prototype.hasOwnProperty.call(communicationVariableTags, str);
}

export type CommunicationVariableTag = string;

export function isValidCommunicationVariableTag(
  category: string,
  tag: string,
): tag is CommunicationVariableTag {
  const tags = (communicationVariableTags as Record<string, unknown>)[category];
  return Array.isArray(tags) ? tags.includes(tag) : false;
}

export function useFormatCommunicationVariableItems({
  communicationVariables,
}: {
  communicationVariables: CommunicationVariable;
}) {
  const getCategoryLabel = (category: string): string => {
    if (!isValidCommunicationVariableCategory(category)) {
      return category;
    }

    return i18nInstance.t(`communicationVariable.${category}.name`, {
      ns: "sm-smartlists_communicationVariables",
      defaultValue: category,
    });
  };

  const getTagLabel = (category: string, tag: string): string => {
    if (
      !isValidCommunicationVariableCategory(category) ||
      !isValidCommunicationVariableTag(category, tag)
    ) {
      return tag;
    }

    return (
      i18nInstance.t(`communicationVariable.${category}.tags.${tag}`, {
        ns: "sm-smartlists_communicationVariables",
      }) || tag
    );
  };

  const formatCommunicationVariablesListItems = ({
    communicationVariables,
  }: {
    communicationVariables: CommunicationVariable;
  }): AutocompleteProps["items"] => {
    if (
      !communicationVariables ||
      Object.keys(communicationVariables).length === 0
    ) {
      return [];
    }

    return Object.entries(communicationVariables).map(
      ([tagCategory, tagList]) => ({
        title: getCategoryLabel(tagCategory),
        options: tagList.map((tag) => ({
          id: `${tagCategory}-${tag}`,
          label: getTagLabel(tagCategory, tag),
        })),
      }),
    );
  };

  const formattedItems = formatCommunicationVariablesListItems({
    communicationVariables,
  });

  return {
    formattedItems,
  };
}
