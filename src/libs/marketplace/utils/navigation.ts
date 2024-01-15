import { MarketplaceTabConfig } from '../types';
import {
  EXPORTABLE_COMPONENT_TYPE_CALENDAR,
  EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2,
  EXPORTABLE_COMPONENT_TYPE_PASS,
  EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
  EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
} from '#libs/exportable-components/constants';

export function urlToMarketplace(companyName: string, companyId: string) {
  return `/m/${encodeURI(companyName)}/${companyId}`;
}

export function urlToMarketplaceTab(
  companyName: string,
  companyId: string,
  path: string,
) {
  return `${urlToMarketplace(companyName, companyId)}/${path}`;
}

/**
 * Handles the "Book a session" button from My Bookings in member profile
 *
 * Tries to redirect to Calendar/Appointment/Workshop tabs.
 * If none, redirect to the first available tab.
 *
 * @param marketplaceConfig The config from marketplace settings object
 */
export const urlToMarketplaceSessionTab = (
  marketplaceConfig: MarketplaceTabConfig[],
  companyName: string,
  companyId: string,
) => {
  const calendarTab = marketplaceConfig?.find(
    (tabConfig) =>
      tabConfig.component_type ===
      (EXPORTABLE_COMPONENT_TYPE_CALENDAR ||
        EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2),
  )?.component_type;
  const appointmentTab = marketplaceConfig?.find(
    (tabConfig) =>
      tabConfig.component_type === EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
  )?.component_type;
  const workshopTab = marketplaceConfig?.find(
    (tabConfig) =>
      tabConfig.component_type === EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
  )?.component_type;

  const marketplaceTab =
    calendarTab ||
    appointmentTab ||
    workshopTab ||
    marketplaceConfig[0]?.component_type;

  return `${urlToMarketplace(companyName, companyId)}/${marketplaceTab}`;
};

/**
 * Handles the "Buy a new pass" button from My Passes in member profile
 *
 * Tries to redirect to Passes tabs.
 * If none, redirect to the first available tab.
 *
 * @param marketplaceConfig The config from marketplace settings object
 */
export const urlToMarketplacePassTab = (
  marketplaceConfig: MarketplaceTabConfig[],
  companyName: string,
  companyId: string,
) => {
  const passTab = marketplaceConfig?.find(
    (tabConfig) => tabConfig.component_type === EXPORTABLE_COMPONENT_TYPE_PASS,
  )?.component_type;

  const marketplaceTab = passTab || marketplaceConfig[0]?.component_type;

  return `${urlToMarketplace(companyName, companyId)}/${marketplaceTab}`;
};
