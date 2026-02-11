import { generatePath } from "react-router";

export const URLS = {
  DETAILS_SLUG: ":id",
  EDIT_SLUG: ":id/edit",
} as const;

export const getDetailsUrl = (id: number) =>
  generatePath(URLS.DETAILS_SLUG, { id: String(id) });

export const getEditUrl = (id: number) =>
  generatePath(URLS.EDIT_SLUG, { id: String(id) });
