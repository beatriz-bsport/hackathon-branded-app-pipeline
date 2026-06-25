import { activePassesFilterRegistryEntry } from "../active-passes-filter/registry-entry";
import { ageFilterRegistryEntry } from "../age-filter/registry-entry";
import { appointmentPassFilterRegistryEntry } from "../appointment-pass-filter/registry-entry";
import { basketAbandonmentFilterRegistryEntry } from "../basket-abandonment-filter/registry-entry";
import { bookingMilestoneFilterRegistryEntry } from "../booking-milestone/registry-entry";
import { creditAccountFilterRegistryEntry } from "../credit-account/registry-entry";
import { firstPurchaseFilterRegistryEntry } from "../first-purchase-filter/registry-entry";
import { genderFilterRegistryEntry } from "../gender-filter/registry-entry";
import { hasPasswordFilterRegistryEntry } from "../has-password-filter/registry-entry";
import { hasPhoneFilterRegistryEntry } from "../has-phone-filter/registry-entry";
import { internalNotesFilterRegistryEntry } from "../internal-notes-filter/registry-entry";
import { lastBookingFilterRegistryEntry } from "../last-booking-filter/registry-entry";
import { liabilityWaiverFilterRegistryEntry } from "../liability-waiver-filter/registry-entry";
import { marketingNotificationFilterRegistryEntry } from "../marketing-notification-filter/registry-entry";
import { memberSignUpDateFilterRegistryEntry } from "../member-sign-up-date-filter/registry-entry";
import { passesFilterRegistryEntry } from "../passes-filter/registry-entry";
import { paymentMethodFilterRegistryEntry } from "../payment-method-filter/registry-entry";
import { purchaseHistoryFilterRegistryEntry } from "../purchase-history-filter/registry-entry";
import { referredMembersFilterRegistryEntry } from "../referred-members-filter/registry-entry";
import { referrerFilterRegistryEntry } from "../referrer-filter/registry-entry";
import { relationshipsFilterRegistryEntry } from "../relationships-filter/registry-entry";
import { tagFilterRegistryEntry } from "../tag-filter/registry-entry";
import { termsAndConditionsFilterRegistryEntry } from "../terms-and-conditions-filter/registry-entry";
import { totalAppointmentsNumberFilterRegistryEntry } from "../total-appointments/registry-entry";
import { totalBookingNumberFilterRegistryEntry } from "../total-booking/registry-entry";
import { SegmentFilterRegistryEntry } from "./types";

/**
 * Single source of truth for every smartlist filter managed in the segment UI.
 * Each entry is declared in its own filter folder; order matches the filter selector popover.
 */
export const SEGMENT_FILTER_REGISTRY_ENTRIES: SegmentFilterRegistryEntry[] = [
  creditAccountFilterRegistryEntry,
  genderFilterRegistryEntry,
  tagFilterRegistryEntry,
  memberSignUpDateFilterRegistryEntry,
  passesFilterRegistryEntry,
  basketAbandonmentFilterRegistryEntry,
  bookingMilestoneFilterRegistryEntry,
  totalBookingNumberFilterRegistryEntry,
  purchaseHistoryFilterRegistryEntry,
  appointmentPassFilterRegistryEntry,
  totalAppointmentsNumberFilterRegistryEntry,
  activePassesFilterRegistryEntry,
  firstPurchaseFilterRegistryEntry,
  referrerFilterRegistryEntry,
  relationshipsFilterRegistryEntry,
  referredMembersFilterRegistryEntry,
  ageFilterRegistryEntry,
  marketingNotificationFilterRegistryEntry,
  internalNotesFilterRegistryEntry,
  hasPhoneFilterRegistryEntry,
  termsAndConditionsFilterRegistryEntry,
  hasPasswordFilterRegistryEntry,
  liabilityWaiverFilterRegistryEntry,
  lastBookingFilterRegistryEntry,
  paymentMethodFilterRegistryEntry,
];
