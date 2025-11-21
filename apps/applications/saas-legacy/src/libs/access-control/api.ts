import type { PaginatedResponse } from '#src/state/types';
import { buildUrlParams, getAuth, postAuth, patchAuth } from '../../http';
import { EntryStatus } from './constants';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CORE_V1;

import type {
  AccessControlBookingOrPrivateBooking,
  AccessControlPolicy,
  MemberVisitQueryParams,
  MemberVisitREST,
  UserPhotoUpdate,
} from './types';

export const retrieveMemberVisit = (memberVisitId: number) => {
  return getAuth<MemberVisitREST>(
    `${API_V1_URI}/access_control/member_visit/${memberVisitId}`,
  );
};

export const getMemberVisitList = (params: MemberVisitQueryParams) => {
  return getAuth<PaginatedResponse<MemberVisitREST>>(
    `${API_V1_URI}/access_control/member_visit/${buildUrlParams(params)}`,
  );
};

export const checkMemberInEstablishment = ({
  // Only one of memberId or memberBarcode is required.
  // If both are provided, the backend will raise an error.
  memberId,
  memberBarcode,
  establishmentIds,
}: {
  memberId: number;
  memberBarcode: string;
  establishmentIds: number[];
}) => {
  return postAuth<MemberVisitREST>(
    `${API_V1_URI}/access_control/member_visit/check_in/`,
    {
      member_id: memberId,
      member_barcode: memberBarcode,
      establishments: establishmentIds,
    },
  );
};

export const setMemberVisitEntryStatus = (
  memberVisitId: number,
  entryStatus: EntryStatus,
) => {
  return patchAuth<MemberVisitREST>(
    `${API_V1_URI}/access_control/member_visit/${memberVisitId}/member_entry/`,
    {
      entry_status: entryStatus,
    },
  );
};

export const refreshMemberVisitAccessStatus = (memberVisitId: number) => {
  return postAuth<MemberVisitREST>(
    `${API_V1_URI}/access_control/member_visit/${memberVisitId}/refresh_access_status/`,
  );
};

export const getAccessControlPolicy = (companyId: number) => {
  return getAuth<AccessControlPolicy>(
    `${API_V1_URI}/access_control/policy/${companyId}`,
  );
};

export const patchAccessControlPolicy = (
  companyId: number,
  data: AccessControlPolicy,
) => {
  return patchAuth<AccessControlPolicy>(
    `${API_V1_URI}/access_control/policy/${companyId}/`,
    data,
  );
};

export const retrieveMemberNextBookingOrPrivateBooking = (memberId: number) => {
  return getAuth<AccessControlBookingOrPrivateBooking>(
    `${API_V1_URI}/access_control/member_visit/today_next_booking_or_private_booking/${buildUrlParams(
      { member: memberId },
    )}`,
  );
};

export const getUserPhotoUpdates = (params: {
  member: number;
  page_size?: number;
}) => {
  return getAuth<PaginatedResponse<UserPhotoUpdate>>(
    `${API_V1_URI}/access_control/user_photo_update/${buildUrlParams(params)}`,
  );
};

export const approveUserPhotoUpdate = (userPhotoUpdateUuid: string) => {
  return patchAuth<UserPhotoUpdate>(
    `${API_V1_URI}/access_control/user_photo_update/${userPhotoUpdateUuid}/approve/`,
    {},
  );
};
