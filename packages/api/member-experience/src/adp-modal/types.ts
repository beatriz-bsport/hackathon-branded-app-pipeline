export type AdpModalVisibility = "show-recommend" | "block-user" | "hide";

export const ADP_MODAL_KIND = {
  MIGRATION: "migration",
  PENDING_AGREEMENTS: "pending-agreements",
} as const;

export type AdpModalKind = (typeof ADP_MODAL_KIND)[keyof typeof ADP_MODAL_KIND];

export type AdpModalVisibilityConfiguration = {
  adp_modal_visibility: AdpModalVisibility;
  adp_modal_kind?: AdpModalKind;
};
