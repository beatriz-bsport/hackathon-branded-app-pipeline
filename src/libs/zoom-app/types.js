// @flow

export type ZoomApp = {
  id: number,
  company: number,
  zoom_user_id: string,
  api_key: string,
  api_secret: string,
  is_disabled: boolean,
  upsell_disabled: boolean,
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
