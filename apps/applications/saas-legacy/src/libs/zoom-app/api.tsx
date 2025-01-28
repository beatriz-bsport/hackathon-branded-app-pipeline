import type {
  ZoomApp,
  ZoomMember,
  ZoomEstablishment,
  ZoomEstablishmentBulkEditData,
} from '#src/libs/zoom-app/types';
import { getAuth, deleteAuth, patchAuth, postAuth } from '../../http';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

export const fetchZoomApp = (companyId: number) => {
  return getAuth<ZoomApp>(`${API_V1_URI}/zoom_app/company/${companyId}/`);
};

export const updateZoomApp = (companyId: number, data: Partial<ZoomApp>) => {
  return patchAuth<ZoomApp>(
    `${API_V1_URI}/zoom_app/company/${companyId}/`,
    data,
  );
};

export const toggleDisableZoomApp = (companyId: number) => {
  return patchAuth<ZoomApp>(
    `${API_V1_URI}/zoom_app/company/${companyId}/toggle_disable/`,
    {},
  );
};

export const requestZoomAccessToken = (
  companyId: number,
  code: string,
  redirect_uri: string,
) => {
  return postAuth(
    `${API_V1_URI}/zoom_app/company/${companyId}/request_access_token/`,
    {
      code,
      redirect_uri,
    },
  );
};

export const revokeZoomApp = (companyId: number) => {
  return deleteAuth(`${API_V1_URI}/zoom_app/company/${companyId}/`);
};

export const toggleMultiZoomUserSupport = (companyId: number) => {
  return patchAuth<ZoomApp>(
    `${API_V1_URI}/zoom_app/company/${companyId}/toggle_multi_zoom_user_support_enabled/`,
    {},
  );
};

export const updateZoomGroupId = (
  companyId: number,
  data: { zoom_group_id: string },
) => {
  return patchAuth<ZoomApp>(
    `${API_V1_URI}/zoom_app/company/${companyId}/set_zoom_group_id/`,
    data,
  );
};

export const fetchZoomGroupMembers = (companyId: number) => {
  return getAuth<ZoomMember[]>(
    `${API_V1_URI}/zoom_app/company/${companyId}/list_group_members/`,
  );
};

export const fetchAllZoomMembers = (companyId: number) => {
  return getAuth<ZoomMember[]>(
    `${API_V1_URI}/zoom_app/company/${companyId}/list_all_members/`,
  );
};

export const listZoomEstablishments = () => {
  return getAuth<ZoomEstablishment[]>(`${API_V1_URI}/zoom_app/establishments/`);
};

export const resetZoomEstablishments = () => {
  return deleteAuth<void>(`${API_V1_URI}/zoom_app/establishments/reset/`);
};

export const bulkEditZoomEstablishments = (
  data: ZoomEstablishmentBulkEditData,
) => {
  return postAuth<ZoomEstablishment[]>(
    `${API_V1_URI}/zoom_app/establishments/bulk_edit/`,
    data,
  );
};
