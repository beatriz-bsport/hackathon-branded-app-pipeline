// @ts-nocheck
import {
  DisciplineGroupAPIData,
  AssignAssociatedCoachDisciplineGroupParams,
  ReplacementRequestFilter,
  ReplacementRequestAPIData,
  ReplacementRequestConfiguration,
  ReplacementRequestCoachAnswerAPIData,
} from './types';
import {
  API_V1_URI,
  getAuth,
  postAuth,
  deleteAuth,
  putAuth,
  buildUrlParams,
  patchAuth,
} from '../../http';

export async function fetchAllReplacementRequests(
  params: ReplacementRequestFilter,
) {
  return getAuth(`${API_V1_URI}/replacement_request/${buildUrlParams(params)}`);
}

export async function postponeReplacementRequestClosingDate(
  id: number,
  date: string,
) {
  return patchAuth(`${API_V1_URI}/replacement_request/${id}/`, {
    closing_date: date,
  });
}

export async function refuseReplacementRequest(id: number) {
  return postAuth(
    `${API_V1_URI}/replacement_request/${id}/refuse_request/`,
    {},
  );
}

export async function cancelReplacementRequest(id: number) {
  return postAuth(
    `${API_V1_URI}/replacement_request/${id}/cancel_request/`,
    {},
  );
}

export async function createReplacementRequestBulk(
  data: ReplacementRequestAPIData[],
) {
  return postAuth(`${API_V1_URI}/replacement_request/bulk_create/`, data);
}

export async function approveReplacementRequestCoachAnswer(
  requestId: number,
  answerId: number,
) {
  return postAuth(
    `${API_V1_URI}/replacement_request/${requestId}/approve_coach_answer/`,
    { coach_answer_id: answerId },
  );
}

export async function fetchAllReplacementRequestCoachAnswers(params: any) {
  return getAuth(
    `${API_V1_URI}/replacement_request/coach_answer/${buildUrlParams(params)}`,
  );
}

export async function createOrUpdateReplacementRequestCoachAnswer(
  replacementRequestId: number,
  data: ReplacementRequestCoachAnswerAPIData,
) {
  return postAuth(
    `${API_V1_URI}/replacement_request/${replacementRequestId}/create_or_update_answer/`,
    data,
  );
}

export async function fetchDisciplineGroupList() {
  return getAuth(`${API_V1_URI}/replacement_request/discipline_group/`);
}

export async function deleteDisciplineGroup(id: number) {
  return deleteAuth(`${API_V1_URI}/replacement_request/discipline_group/${id}`);
}

export async function createDisciplineGroup(
  data: Omit<DisciplineGroupAPIData, 'company'>,
) {
  return postAuth(`${API_V1_URI}/replacement_request/discipline_group/`, data);
}

export async function updateDisciplineGroup(
  id: number,
  data: Omit<DisciplineGroupAPIData, 'company'>,
) {
  return putAuth(
    `${API_V1_URI}/replacement_request/discipline_group/${id}/`,
    data,
  );
}

export async function assignDisciplineGroup(
  params: AssignAssociatedCoachDisciplineGroupParams,
) {
  return putAuth(
    `${API_V1_URI}/replacement_request/discipline_group/set_associated_coach_discipline_group/${buildUrlParams(
      params,
    )}`,
  );
}

export async function updateReplacementRequestLastSeen(params: {
  company?: number;
}) {
  return getAuth(
    `${API_V1_URI}/replacement_request/last_seen/${buildUrlParams(params)}`,
  );
}

export async function hasUnseenConfirmedRequests(params: { company?: number }) {
  return getAuth(
    `${API_V1_URI}/replacement_request/has_unseen_confirmed_requests/${buildUrlParams(
      params,
    )}`,
  );
}
export async function hasRequestsLinkedToCancelledOffers() {
  return getAuth(
    `${API_V1_URI}/replacement_request/has_requests_linked_to_cancelled_offers/`,
  );
}
export async function fetchReplacementRequestConfiguration() {
  return getAuth(`${API_V1_URI}/replacement_request/configuration/me/`);
}

export async function updateReplacementRequestConfiguration(
  companyId: number,
  data: ReplacementRequestConfiguration,
) {
  return patchAuth(
    `${API_V1_URI}/replacement_request/configuration/${companyId}/`,
    data,
  );
}
