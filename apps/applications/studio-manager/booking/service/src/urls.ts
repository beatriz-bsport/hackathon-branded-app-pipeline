// Cross-vertical URL — no shared export mechanism exists yet. If the calendar URL changes in its vertical, update this too.
export const CALENDAR_URL = "/calendar";

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
