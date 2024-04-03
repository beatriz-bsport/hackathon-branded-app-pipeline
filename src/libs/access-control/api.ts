import { buildUrlParams, API_V1_URI, getAuth, postAuth } from '../../http';
import { EntryStatus } from './constants';

import type { MemberVisitFilterParams, MemberVisitREST } from './types';

export const retrieveMemberVisit = (memberVisitId: number) => {
  return getAuth<MemberVisitREST>(
    `${API_V1_URI}/access_control/member_visit/${memberVisitId}`,
  );
};

export const getMemberVisitList = (params: MemberVisitFilterParams) => {
  return getAuth<MemberVisitREST[]>(
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
  return postAuth<MemberVisitREST>(
    `${API_V1_URI}/access_control/member_visit/${memberVisitId}/set_member_entry/`,
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
