import type { AutocompleteProps } from "@bsport/kaizen-primitive-core";
import type { CommunicationVariable } from "@bsport/store-cdp-notification-rule";

import { i18nInstance } from "#src/utils/i18n";

/**
 * Available communication variable tags that have translations.
 * These correspond to the tag keys within each category in the communicationVariable translation namespace.
 */
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

/**
 * Available communication variable tags that have translations.
 * These correspond to the tag keys within each category in the communicationVariable translation namespace.
 */
export type CommunicationVariableCategory =
  keyof typeof communicationVariableTags;

/**
 * Type guard to check if a string is a valid communication variable category.
 * This ensures type safety when using dynamic translation keys.
 *
 * @param str - The string to check
 * @returns True if the string is a valid communication variable category
 *
 * @example
 * ```tsx
 * if (isValidCommunicationVariableCategory(categoryName)) {
 *   // TypeScript knows categoryName is CommunicationVariableCategory
 *   const translatedName = t(`communicationVariable.${categoryName}.name`);
 * }
 * ```
 */
export function isValidCommunicationVariableCategory(
  str: string,
): str is CommunicationVariableCategory {
  return Object.prototype.hasOwnProperty.call(communicationVariableTags, str);
}

/**
 * Type representing valid communication variable tags.
 */
export type CommunicationVariableTag = string;

/**
 * Type guard to check if a string is a valid communication variable tag.
 * This ensures type safety when using dynamic translation keys for tags.
 *
 * @param category - The category to check the tag against
 * @param tag - The tag string to check
 * @returns True if the string is a valid communication variable tag for the given category
 *
 * @example
 * ```tsx
 * if (isValidCommunicationVariableTag("User", tagName)) {
 *   // TypeScript knows tagName is a valid tag for User category
 *   const translatedTag = t(`communicationVariable.User.tags.${tagName}`);
 * }
 * ```
 */
export function isValidCommunicationVariableTag(
  category: string,
  tag: string,
): tag is CommunicationVariableTag {
  const tags = (communicationVariableTags as Record<string, unknown>)[category];
  return Array.isArray(tags) ? tags.includes(tag) : false;
}

/**
 * Hook for formatting communication variables into autocomplete items for UI display.
 *
 * This hook transforms a CommunicationVariable object (which has category keys mapping to arrays of tag strings)
 * into an array of sections that can be rendered in an Autocomplete component. It provides type safety through
 * the isValidCommunicationVariableCategory and isValidCommunicationVariableTag type guards and gracefully
 * handles missing translations.
 *
 * The resulting array structure is:
 * - Each category becomes a section with a translated title (falls back to raw category name)
 * - Each tag within that category becomes an option with id and translated label (falls back to raw tag name)
 * - Categories and their tags maintain the original order
 *
 * @param params - The hook parameters
 * @param params.communicationVariables - Object mapping tag categories to arrays of tag strings
 *
 * @returns Object containing the formatted autocomplete items
 * @returns returns.formattedItems - Array of sections for Autocomplete component
 */

export function useFormatCommunicationVariableItems({
  communicationVariables,
}: {
  communicationVariables: CommunicationVariable;
}) {
  /**
   * Safely get the translated category name.
   * Falls back to the raw category name if translation is not available.
   */
  const getCategoryLabel = (category: string): string => {
    if (!isValidCommunicationVariableCategory(category)) {
      return category;
    }
    return i18nInstance.t(`communicationVariable.${category}.name`, {
      ns: "sm-transactional-notification_communicationVariables",
      defaultValue: category,
    });
  };

  /**
   * Safely get the translated tag label.
   * Falls back to the raw tag name if translation is not available.
   */
  const getTagLabel = (category: string, tag: string): string => {
    if (
      !isValidCommunicationVariableCategory(category) ||
      !isValidCommunicationVariableTag(category, tag)
    ) {
      return tag;
    }

    return (
      i18nInstance.t(`communicationVariable.${category}.tags.${tag}`, {
        ns: "sm-transactional-notification_communicationVariables",
      }) || tag
    );
  };

  /**
   * Internal function that formats communication variables into autocomplete sections.
   *
   * Creates an array of sections where each category becomes a section with a title
   * and its tags become options within that section.
   *
   * @param params - The formatting parameters
   * @param params.communicationVariables - Object mapping categories to tag arrays
   * @returns Array of sections with titles and options for Autocomplete component
   */
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

    const formattedSections = Object.entries(communicationVariables).map(
      ([tagCategory, tagList]) => ({
        title: getCategoryLabel(tagCategory),
        options: tagList.map((tag) => ({
          id: `${tagCategory}-${tag}`,
          label: getTagLabel(tagCategory, tag),
        })),
      }),
    );

    return formattedSections;
  };

  const formattedItems = formatCommunicationVariablesListItems({
    communicationVariables,
  });

  return {
    formattedItems,
  };
}
