export type ZoomApp = {
  id: number;
  company: number;
  zoom_user_id: string;
  zoom_user_email?: string;
  is_disabled: boolean;
  is_configured: boolean;
  multi_zoom_user_support_enabled: boolean;
  zoom_group_id?: string;
};
