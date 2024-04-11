import {
  buildUrlParams,
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
} from '../../http';
import { EntryStatus } from './constants';

import type { PaginatedResponse } from '../../state/types';
import type { MemberVisitQueryParams, MemberVisitREST } from './types';

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
