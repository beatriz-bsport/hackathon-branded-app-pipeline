import { generatePath, useHref, useNavigate } from "react-router";

import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags, useFlag: useBookingManagementFlag } = makeFeatureFlags({
  BOOKINGS_MANAGEMENT_REVAMP: "booking_bookings_management_revamped",
  CALENDAR_APPOINTMENTS_TAB: "booking_calendar_appointments_tab",
  CALENDAR_SERIES_TAB: "booking_calendar_series_tab",
} as const);

const { flags: ClassFlags, useFlag: useClassFlag } = makeFeatureFlags({
  CLASSES_DETAIL_PAGE: "booking_classes_detail_page",
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
  SERVICES_CLASSES_DETAIL: (id: number) => `/services/classes/${id}`,
} as const;

export const LEGACY_URLS = {
  BOOKINGS_MANAGEMENT_REVAMP: `/offer/${SESSION_ID_PARAM}`,
  GROUPED_OFFER_LIST: "/workshop-activity/tabs/groups",
  MEMBER_DETAILS: (memberId: number) => `/member/${memberId}/info`,
  MEMBER_BOOKINGS: (memberId: number) => `/member/${memberId}/bookings`,
  ADD_MEMBER: "/member/add",
  PASS_DETAILS: (passId: number) => `/payment-pack/${passId}`,
  MEMBER_NOTES: (memberId: number) => `/member/${memberId}/info#member-notes`,
  ESTABLISHMENT_DETAILS: (establishmentId: number) =>
    `/establishment/details/${establishmentId}`,
  COACH_DETAILS: (coachId: number) => `/coach/${coachId}`,
  GROUP_ACTIVITY_DETAIL: (id: number) => `/activity/${id}/general`,
  WORKSHOP_DETAIL: (id: number) => `/workshop-activity/${id}/general`,
} as const;

export const useUrls = () => {
  const navigate = useNavigate();
  // `window.open` resolves from browser location, so we include router basename
  // (for example `/studio`) before absolute app paths.
  const appBasePath = useHref("/").replace(/\/$/, "");
  const shouldUseBookingManagementRevamp = useBookingManagementFlag(
    flags.BOOKINGS_MANAGEMENT_REVAMP,
  );
  const detailEnabled = useClassFlag(ClassFlags.CLASSES_DETAIL_PAGE);

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

  const resolveSeriesDetailsPath = () => {
    // TODO: when series detail feature is ready, redirect to grouped-session detail page.
    return LEGACY_URLS.GROUPED_OFFER_LIST;
  };

  const navigateToSeriesDetails = () => {
    const path = resolveSeriesDetailsPath();
    window.location.assign(path);
  };

  const resolveAllOccurrencesPath = (id: number) =>
    generatePath(URLS.ALL_OCCURRENCES_PATH, { sessionId: String(id) });

  const getIndexUrl = () => URLS.INDEX;

  const navigateToIndex = () => navigate(URLS.INDEX);

  const navigateToEdit = (id: number) => {
    const url = resolveEditPath(id);
    navigate(url);
  };

  const navigateToClassDetail = (id: number, isWorkshop: boolean) => {
    const url = detailEnabled
      ? `${appBasePath}${URLS.SERVICES_CLASSES_DETAIL(id)}`
      : isWorkshop
        ? LEGACY_URLS.WORKSHOP_DETAIL(id)
        : LEGACY_URLS.GROUP_ACTIVITY_DETAIL(id);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return {
    navigateToClassDetail,
    navigateToBookingsManagement,
    getBookingsManagementUrl,
    getBookingsManagementPath,
    getEditUrl,
    getIndexUrl,
    resolveEditPath,
    resolveSeriesPath,
    resolveSeriesDetailsPath,
    resolveAllOccurrencesPath,
    navigateToIndex,
    navigateToEdit,
    navigateToSeriesDetails,
  };
};
