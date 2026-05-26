const VENUES = "venues";

export const ROUTES = {
  ACTIVE: "/",
  ARCHIVED: "archived",
};

export const ABSOLUTE_ROUTES = {
  ACTIVE: `/${VENUES}`,
  ARCHIVED: `/${VENUES}/${ROUTES.ARCHIVED}`,
};
