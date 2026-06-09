/**
 * Get Popups from the API
 * Endpoint for lists: GET member-experience/v1/mobile_app/manager/custom_popup_links/
 * Endpoint for individual popups: GET member-experience/v1/mobile_app/manager/custom_popup_links/{id}
 * Backend serializer: AppPopupLinkSerializer
 */
export type Popup = {
  custom_popup_id: number;
  name: string;
  link: string;
  image: string;
  date_created: string; // ISO 8601 datetime string
  smartlist_popup_id?: number;
  smartlist_id?: number;
  smartlist_name?: string;
};

export type PopupImageQueryOptionsParams = {
  popupId: number;
  imageUrl: string;
};
