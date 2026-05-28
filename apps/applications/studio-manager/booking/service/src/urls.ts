// Cross-vertical URLs — no shared export mechanism exists yet. Update if the target vertical's URL changes.
// Also defined in apps/applications/studio-manager/navigation-sidebar/src/urls.ts
export const CALENDAR_URL = "/calendar";
export const PASSES_URL = "/payment-pack";

export const ROUTES = {
  ACTIVE: "classes",
  ARCHIVED: "classes/archived",
  DETAIL: "classes/:metaActivityId",
  ARCHIVED_DETAIL: "classes/archived/:metaActivityId",
};

export const ABSOLUTE_ROUTES = {
  ACTIVE: "/services/classes",
  ARCHIVED: "/services/classes/archived",
  DETAIL: (id: number) => `/services/classes/${id}`,
  ARCHIVED_DETAIL: (id: number) => `/services/classes/archived/${id}`,
};

export const LEGACY_URLS = {
  GROUP_ACTIVITY_DETAIL: (id: number) => `/activity/${id}/general`,
  WORKSHOP_DETAIL: (id: number) => `/workshop-activity/${id}/general`,
};

export const getLegacyDetailUrl = (id: number, isWorkshop: boolean) =>
  isWorkshop
    ? LEGACY_URLS.WORKSHOP_DETAIL(id)
    : LEGACY_URLS.GROUP_ACTIVITY_DETAIL(id);
