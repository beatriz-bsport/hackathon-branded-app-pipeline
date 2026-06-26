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
const SERIES_ID_PARAM = ":seriesId";
const EDIT_SLUG = `${SESSION_ID_PARAM}/edit`;
const INDEX = "..";
const CALENDAR_ROOT = "/calendar";
const SERIES_ROOT_SLUG = "series";
const SERIES_SLUG = `${SERIES_ROOT_SLUG}/${SERIES_ID_PARAM}`;
const SERIES_EDIT_SLUG = `${SERIES_SLUG}/edit`;
const SERIES_CLASSES_SLUG = `${SERIES_SLUG}/classes`;
const ALL_OCCURRENCES_SLUG = `${SESSION_ID_PARAM}/all-occurrences`;

export const URLS = {
  INDEX,
  BOOKINGS_MANAGEMENT_REVAMP: SESSION_ID_PARAM,
  BOOKINGS_MANAGEMENT_REVAMP_PATH: `${INDEX}/${SESSION_ID_PARAM}`,
  EDIT_SLUG,
  EDIT_PATH: `${INDEX}/${EDIT_SLUG}`,
  SERIES_ROOT_SLUG,
  SERIES_SLUG,
  SERIES_EDIT_SLUG,
  SERIES_CLASSES_SLUG,
  ALL_OCCURRENCES_SLUG,
  ALL_OCCURRENCES_PATH: `${INDEX}/${ALL_OCCURRENCES_SLUG}`,
  SERVICES_CLASSES_DETAIL: (id: number) => `/services/classes/${id}`,
} as const;

export const ABSOLUTE_ROUTES = {
  INDEX: CALENDAR_ROOT,
  CLASSES_LIST: `${CALENDAR_ROOT}?tab=classes`,
  SERIES_LIST: `${CALENDAR_ROOT}?tab=series`,
  BOOKINGS_MANAGEMENT_REVAMP: `${CALENDAR_ROOT}/${SESSION_ID_PARAM}`,
  SERIES_EDIT: `${CALENDAR_ROOT}/${SERIES_EDIT_SLUG}`,
  SERIES_CLASSES: `${CALENDAR_ROOT}/${SERIES_CLASSES_SLUG}`,
  ALL_OCCURRENCES: `${CALENDAR_ROOT}/${ALL_OCCURRENCES_SLUG}`,
};

export const EXTERNAL_ROUTES = {
  SERVICES: "/services/classes",
};

export const resolveBookingsManagementRevampPath = (sessionId: number) =>
  generatePath(ABSOLUTE_ROUTES.BOOKINGS_MANAGEMENT_REVAMP, {
    sessionId: String(sessionId),
  });

export const resolveSeriesClassesPath = (seriesId: number) =>
  generatePath(ABSOLUTE_ROUTES.SERIES_CLASSES, {
    seriesId: String(seriesId),
  });

export const LEGACY_URLS = {
  BOOKINGS_MANAGEMENT_REVAMP: `/offer/${SESSION_ID_PARAM}`,
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
  WAITLIST_SETTINGS: "/settings/waiting-list",
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

  const resolveSeriesEditPath = (seriesId: number) =>
    generatePath(ABSOLUTE_ROUTES.SERIES_EDIT, {
      seriesId: String(seriesId),
    });

  const navigateToSeriesDetails = (seriesId: number) => {
    const path = resolveSeriesEditPath(seriesId);
    navigate(path);
  };

  const resolveAllOccurrencesPath = (id: number) =>
    generatePath(URLS.ALL_OCCURRENCES_PATH, { sessionId: String(id) });

  const resolveServicesPath = () => `${appBasePath}${EXTERNAL_ROUTES.SERVICES}`;

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
    resolveSeriesEditPath,
    resolveSeriesClassesPath,
    resolveAllOccurrencesPath,
    resolveServicesPath,
    navigateToIndex,
    navigateToEdit,
    navigateToSeriesDetails,
  };
};
