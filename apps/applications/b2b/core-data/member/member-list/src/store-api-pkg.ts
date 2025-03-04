// TODO : export in store | api pkg

import { fetchWithAuth } from "@bsport/b2b-backbone";
import { buildUrlParams } from "@bsport/fetch";

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

export const fetchMemberListPage = async (
  urlParams: Record<string, string | boolean | number>,
): Promise<{
  page: number;
  next_page: number;
  count: number;
  results: Member[];
}> => {
  try {
    const response = await fetchWithAuth(
      `core-data/v1/member/${buildUrlParams(urlParams)}`,
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    return {
      count: 0,
      page: 1,
      next_page: 1,
      results: [],
    };
  }
};
