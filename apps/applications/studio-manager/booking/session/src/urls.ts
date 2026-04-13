import { generatePath, useNavigate } from "react-router";

import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags, useFlag: useBookingManagementFlag } = makeFeatureFlags({
  BOOKINGS_MANAGEMENT_REVAMP: "booking_bookings_management_revamped",
  CALENDAR_APPOINTMENTS_TAB: "booking_calendar_appointments_tab",
} as const);

const SESSION_ID_PARAM = ":sessionId";
const EDIT_SLUG = `${SESSION_ID_PARAM}/edit`;
const INDEX = "..";

export const URLS = {
  INDEX,
  BOOKINGS_MANAGEMENT_REVAMP: SESSION_ID_PARAM,
  BOOKINGS_MANAGEMENT_REVAMP_PATH: `${INDEX}/${SESSION_ID_PARAM}`,
  EDIT_SLUG,
  EDIT_PATH: `${INDEX}/${EDIT_SLUG}`,
} as const;

export const LEGACY_URLS = {
  BOOKINGS_MANAGEMENT_REVAMP: `/offer/${SESSION_ID_PARAM}`,
} as const;

export const useUrls = () => {
  const navigate = useNavigate();
  const shouldUseBookingManagementRevamp = useBookingManagementFlag(
    flags.BOOKINGS_MANAGEMENT_REVAMP,
  );

  const getBookingsManagementUrl = (id: number) =>
    generatePath(
      shouldUseBookingManagementRevamp
        ? URLS.BOOKINGS_MANAGEMENT_REVAMP
        : LEGACY_URLS.BOOKINGS_MANAGEMENT_REVAMP,
      { sessionId: String(id) },
    );

  const getBookingsManagementPath = (id: number) =>
    generatePath(
      shouldUseBookingManagementRevamp
        ? URLS.BOOKINGS_MANAGEMENT_REVAMP_PATH
        : LEGACY_URLS.BOOKINGS_MANAGEMENT_REVAMP,
      { sessionId: String(id) },
    );

  const navigateToBookingsManagement = (url: string) => {
    const navigateTo = shouldUseBookingManagementRevamp
      ? navigate
      : (target: string) => window.location.assign(target);
    navigateTo(url);
  };

  const getEditUrl = (id: number) =>
    generatePath(URLS.EDIT_SLUG, { sessionId: String(id) });

  const resolveEditPath = (id: number) =>
    generatePath(URLS.EDIT_PATH, { sessionId: String(id) });

  const getIndexUrl = () => URLS.INDEX;

  const navigateToIndex = () => navigate(URLS.INDEX);

  return {
    navigateToBookingsManagement,
    getBookingsManagementUrl,
    getBookingsManagementPath,
    getEditUrl,
    getIndexUrl,
    resolveEditPath,
    navigateToIndex,
  };
};
