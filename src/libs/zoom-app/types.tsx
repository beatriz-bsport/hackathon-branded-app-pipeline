import type { ErrorAndLoading } from '#libs/types';

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

export type ZoomEstablishment = {
  company: number;
  zoom_app: number;
  establishment: number;
  zoom_user_id: string;
};

enum ZoomMemberType {
  BASIC = 1,
  LICENSED = 2,
}

export type ZoomMember = {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  type: ZoomMemberType;
};

export type ZoomEstablishmentBulkEditData = {
  zoom_establishments: Array<{
    establishment_id: number;
    zoom_user_id: string;
  }>;
};

export type ZoomAppState = {
  detail: ZoomApp;
  update: ErrorAndLoading;
  loading: boolean;
  error?: Error;
  zoomMembers: {
    data: ZoomMember[];
  } & ErrorAndLoading;
  zoomEstablishments: {
    data: ZoomEstablishment[];
    update: ErrorAndLoading;
  } & ErrorAndLoading;
};
