import {
  API_URI,
  API_V1_URI,
  getAuth,
  postAuth,
  putAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

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
  data: any,
) {
  return putAuth(
    `${API_V1_URI}/associated_coach/${id}/update_coach_private_slots_payment_rules/`,
    data,
  );
}
export default {
  fetchAssociated: fetchAssociatedCoaches,
  addCoach,
  updateCoach,
  fetchAssociatedCoachPerformance,
  linkByEmail,
};
