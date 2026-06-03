import { generatePath, useNavigate } from "react-router";

import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags, useFlag: useBookingManagementFlag } = makeFeatureFlags({
  BOOKINGS_MANAGEMENT_REVAMP: "booking_bookings_management_revamped",
  CALENDAR_APPOINTMENTS_TAB: "booking_calendar_appointments_tab",
} as const);

const SESSION_ID_PARAM = ":sessionId";
const EDIT_SLUG = `${SESSION_ID_PARAM}/edit`;
const INDEX = "..";
const SERIES_SLUG = `${SESSION_ID_PARAM}/series`;
const ALL_OCCURRENCES_SLUG = `${SESSION_ID_PARAM}/all-occurrences`;

export const URLS = {
  INDEX,
  BOOKINGS_MANAGEMENT_REVAMP: SESSION_ID_PARAM,
  BOOKINGS_MANAGEMENT_REVAMP_PATH: `${INDEX}/${SESSION_ID_PARAM}`,
  EDIT_SLUG,
  EDIT_PATH: `${INDEX}/${EDIT_SLUG}`,
  SERIES_SLUG,
  SERIES_PATH: `${INDEX}/${SERIES_SLUG}`,
  ALL_OCCURRENCES_SLUG,
  ALL_OCCURRENCES_PATH: `${INDEX}/${ALL_OCCURRENCES_SLUG}`,
} as const;

export const LEGACY_URLS = {
  BOOKINGS_MANAGEMENT_REVAMP: `/offer/${SESSION_ID_PARAM}`,
  MEMBER_DETAILS: (memberId: number) => `/member/${memberId}/info`,
  ADD_MEMBER: "/member/add",
  PASS_DETAILS: (passId: number) => `/payment-pack/${passId}`,
  MEMBER_NOTES: (memberId: number) => `/member/${memberId}/info#member-notes`,
  ESTABLISHMENT_DETAILS: (establishmentId: number) =>
    `/establishment/details/${establishmentId}`,
  COACH_DETAILS: (coachId: number) => `/coach/${coachId}`,
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

  const resolveSeriesPath = (id: number) =>
    generatePath(URLS.SERIES_PATH, { sessionId: String(id) });

  const resolveAllOccurrencesPath = (id: number) =>
    generatePath(URLS.ALL_OCCURRENCES_PATH, { sessionId: String(id) });

  const getIndexUrl = () => URLS.INDEX;

  const navigateToIndex = () => navigate(URLS.INDEX);

  const navigateToEdit = (id: number) => {
    const url = resolveEditPath(id);
    navigate(url);
  };

  return {
    navigateToBookingsManagement,
    getBookingsManagementUrl,
    getBookingsManagementPath,
    getEditUrl,
    getIndexUrl,
    resolveEditPath,
    resolveSeriesPath,
    resolveAllOccurrencesPath,
    navigateToIndex,
    navigateToEdit,
  };
};
