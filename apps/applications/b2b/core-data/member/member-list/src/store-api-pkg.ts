// TODO : export in store | api pkg
import { buildUrlParams } from "@bsport/fetch";
import fetch from "#src/utils/fetch";

// ----- Types -----

// Based on MemberListMinimalWithAvatarSerializer
export type Member = {
  accept_email: boolean;
  archived: boolean;
  birthday?: string;
  consumer: number;
  credit_account_balance: number;
  date_joined: string;
  email: string;
  first_name: string;
  has_bough_pack: boolean;
  id: number;
  is_pos: boolean;
  last_name: string;
  name: string;
  phone?: string;
  photo?: string;
  tags: Array<number>;
  total_unpaid_amount: string;
  user_id: number;
};

// ----- Generic -----
export const performFetchAction = async <T>({
  url,
  params = {},
  errorReturn,
}: {
  url: string;
  params?: object;
  errorReturn: T;
}): Promise<T> => {
  try {
    const { data } = await fetch<T>(url, params);
    return data;
  } catch (error) {
    console.error(error);
    return errorReturn;
  }
};

type PaginatedResponse = {
  page: number;
  next_page: number;
  count: number;
  results: Member[];
};

// ----- APIs -----

const API_URI = "core-data/v1/member";

/**
 * Return a Paginated Response with MemberListMinimalWithAvatarSerializer
 * @param urlParams URL params to custom the request.
 * page & page_size are mandatory to make the paginated request.
 */
export const fetchMemberListPage = async (
  urlParams: { page: number; page_size: number } & Record<
    string,
    string | boolean | number
  >,
): Promise<PaginatedResponse> => {
  return await performFetchAction<PaginatedResponse>({
    url: `${API_URI}/${buildUrlParams(urlParams)}`,
    errorReturn: {
      count: 0,
      page: 1,
      next_page: 1,
      results: [],
    },
  });
};

/**
 * Archive an active member
 * @param memberId Id of the member to archive
 */
export const archiveMember = async ({ memberId }: { memberId: number }) => {
  await performFetchAction<void>({
    url: `${API_URI}/${memberId}/archive/`,
    params: {
      method: "POST",
    },
    errorReturn: undefined,
  });
};

/**
 * Restore an archived member
 * @param memberId Id of the member to restore
 */
export const restoreMember = async ({ memberId }: { memberId: number }) => {
  await performFetchAction<void>({
    url: `${API_URI}/${memberId}/unarchive/`,
    params: {
      method: "POST",
    },
    errorReturn: undefined,
  });
};

/**
 * Check if the member has irregularity and retrieve a list of error code
 * @param memberId Id of the member to interrogate
 * @returns A list of error codes, that is empty if the member is regularized
 */
export const interrogateMemberRegularity = async ({
  memberId,
}: {
  memberId: number;
}) => {
  return await performFetchAction<Array<number>>({
    url: `${API_URI}/${memberId}/interrogate_member_before_archive/`,
    errorReturn: [],
  });
};
