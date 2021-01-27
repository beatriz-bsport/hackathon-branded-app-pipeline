// @flow

export type ZoomApp = {
  id: number,
  company: number,
  zoom_user_id: string,
  is_disabled: boolean,
  is_configured: boolean,
};

export type zoom_app_state = {
  detail: ZoomApp,
  update: {
    loading: boolean,
    error?: Error,
  },
  loading: boolean,
  error?: Error,
};
