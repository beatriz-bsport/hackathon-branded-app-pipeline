// @ts-nocheck
export type ZoomApp = {
  id: number;
  company: number;
  zoom_user_id: string;
  is_disabled: boolean;
  is_configured: boolean;
};

export type ZoomAppState = {
  detail: ZoomApp;
  update: {
    loading: boolean;
    error?: Error;
  };
  loading: boolean;
  error?: Error;
};
