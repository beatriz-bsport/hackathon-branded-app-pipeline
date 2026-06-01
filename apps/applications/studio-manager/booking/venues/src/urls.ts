const VENUES = "venues";

export const ROUTES = {
  ACTIVE: "/",
  ARCHIVED: "archived",
  DETAIL: ":venueId",
};

export const ABSOLUTE_ROUTES = {
  ACTIVE: `/${VENUES}`,
  ARCHIVED: `/${VENUES}/${ROUTES.ARCHIVED}`,
  DETAIL: (id: number) => `/${VENUES}/${id}`,
};

export const LEGACY_URLS = {
  DETAIL: (id: number) => `/establishment/details/${id}`,
  SPOT_SCHEDULING: (roomBlueprintId: number) =>
    `/spot-scheduling/${roomBlueprintId}`,
};
