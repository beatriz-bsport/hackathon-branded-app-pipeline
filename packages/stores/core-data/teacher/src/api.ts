import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

const API_URL = "core-data/v1";
const API_URL_COACH = `${API_URL}/coach`;
const API_URL_ASSOCIATED_COACH = `${API_URL}/associated_coach`;

export type FetchTeachersParams = {
  associated_coach__in?: number[];
  company?: number;
  disabled?: boolean;
  has_coach_payment_rule_group?: boolean;
  id__in?: number[];
  id__not_in?: number[];
  page?: number;
  page_size?: number;
  with_workshop?: boolean;
};

export const fetchTeachersAPI = (
  params: FetchTeachersParams = {},
): ApiConfig => {
  const { page, page_size, ...otherParams } = params;

  const finalParams =
    page && page_size
      ? {
          ...otherParams,
          page,
          page_size,
          paginated: true,
        }
      : otherParams;

  return [`${API_URL_ASSOCIATED_COACH}/${buildUrlParams(finalParams)}`];
};

export type FuzzySearchParams = FetchTeachersParams & { queryString: string };

export const fuzzySearchTeachersAPI = (
  params: FuzzySearchParams,
): ApiConfig => {
  const { queryString, ...otherParams } = params;
  return [
    `${API_URL_ASSOCIATED_COACH}/search/${buildUrlParams({ ...otherParams, q: queryString ?? "" })}`,
  ];
};

export const archiveTeacherAPI = ({ id }: { id: number }): ApiConfig => {
  return [
    `${API_URL_COACH}/${id}`,
    {
      method: "DELETE",
    },
  ];
};

export const restoreTeacherAPI = ({
  associatedCoachId,
}: {
  associatedCoachId: number;
}): ApiConfig => {
  return [
    `${API_URL_ASSOCIATED_COACH}/${associatedCoachId}/restore/`,
    {
      method: "PUT",
    },
  ];
};
