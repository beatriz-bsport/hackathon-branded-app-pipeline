import {
  API_URI,
  API_V1_URI,
  getAuth,
  postAuth,
  putAuth,
  deleteAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';
import type {
  CoachReplacementPreferencesData,
  UpdateCoachPrivateSlotsPaymentRuleData,
} from '#libs/associated-coach/types';

// TO UPDATE TO V1 API
// -----------------------
//

export async function fetchAssociatedCoachPerformance(
  associatedCoachId: number,
  start_timestamp: number,
  end_timestamp: number,
) {
  return getAuth(
    `${API_URI}/saas/associated-coach/${associatedCoachId}/performance/${start_timestamp}/${end_timestamp}`,
  );
}

export async function fetchAssociatedCoaches(params?: {
  [key: string]: boolean;
}) {
  return getAuth(`${API_V1_URI}/associated_coach/${buildUrlParams(params)}`);
}

export async function fetchPaginatedAssociatedCoaches(params?: {
  [key: string]: boolean | number;
}) {
  return getAuth(
    `${API_URI}/saas/associated-coach/${buildUrlParams({
      ...params,
      paginated: true,
    })}`,
  );
}

export async function fetchAssociatedCoach(id: number) {
  return getAuth(`${API_V1_URI}/associated_coach/${id}/`);
}

// -----------------------
export async function addCoach(data: any) {
  return postAuth(`${API_V1_URI}/coach/`, data);
}

export async function updateCoach(data: any) {
  return putAuth(`${API_V1_URI}/coach/${data.get('id')}/`, data);
}

export async function linkByEmail(email: string) {
  return postAuth(`${API_V1_URI}/coach/link_by_email/`, { email });
}

export async function deleteCoach(id: number) {
  return deleteAuth(`${API_V1_URI}/coach/${id}`);
}

export async function canDeleteCoach(id: number) {
  return getAuth(`${API_V1_URI}/coach/${id}/can_destroy/`);
}

export async function restoreCoach(id: number) {
  return putAuth(`${API_V1_URI}/associated_coach/${id}/restore/`); // set {disabled: false}
}

export async function updateCoachPrivateSlotsPaymentRules(
  id: number,
  data: UpdateCoachPrivateSlotsPaymentRuleData,
) {
  return putAuth(
    `${API_V1_URI}/associated_coach/${id}/update_coach_private_slots_payment_rules/`,
    data,
  );
}

export async function updateAssociatedCoachReplacementPreferences(
  id: number,
  data: CoachReplacementPreferencesData,
) {
  return patchAuth(`${API_V1_URI}/associated_coach/${id}/`, data);
}

export async function editAccessToCoachSpaceAPI(params: {
  id: number;
  has_access_to_coach_space: boolean;
}) {
  const { id, ...data } = params;
  return putAuth(`${API_V1_URI}/coach/${id}/edit_access_to_coach_space/`, data);
}
export async function retrieveMyAssociatedCoachProfile(params: {
  companyId: number;
}) {
  return getAuth(`${API_V1_URI}/associated_coach/me/${buildUrlParams(params)}`);
}

export const getAssociatedCoachLateReplacementRequestStatus = (
  coachId: number,
  params: { company: number },
) => {
  return getAuth(
    `${API_V1_URI}/associated_coach/${coachId}/late_replacement_request_status/${buildUrlParams(
      params,
    )}`,
  );
};

export default {
  fetchAssociated: fetchAssociatedCoaches,
  addCoach,
  updateCoach,
  fetchAssociatedCoachPerformance,
  linkByEmail,
};
