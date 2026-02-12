import { generatePath, useNavigate } from "react-router";

import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags, useFlag: useBookingManagementFlag } = makeFeatureFlags({
  BOOKINGS_MANAGEMENT_REVAMP: "booking_bookings_management_revamped",
} as const);

export const URLS = {
  BOOKINGS_MANAGEMENT_REVAMP: ":sessionId",
  EDIT_SLUG: ":sessionId/edit",
} as const;

export const LEGACY_URLS = {
  BOOKINGS_MANAGEMENT_REVAMP: `/offer/:sessionId`,
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

  const navigateToBookingsManagement = (id: number) => {
    const url = getBookingsManagementUrl(id);
    const navigateTo = shouldUseBookingManagementRevamp
      ? navigate
      : window.location.assign;
    navigateTo(url);
  };

  const getEditUrl = (id: number) =>
    generatePath(URLS.EDIT_SLUG, { sessionId: String(id) });

  return {
    navigateToBookingsManagement,
    getBookingsManagementUrl,
    getEditUrl,
  };
};
