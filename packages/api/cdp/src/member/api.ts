import { type ApiConfig, type Fetch } from "@bsport/store-base";

import type {
  GetMemberParams,
  Member,
  SearchMembersParams,
} from "#src/member/types";

const API_URL = "core-data/v1/member";

const getMemberAPIConfig = (params: GetMemberParams): ApiConfig => {
  return [`${API_URL}/${params.memberId}/`];
};

export const fetchMember = async (
  fetch: Fetch<Member>,
  params: GetMemberParams,
): Promise<Member> => {
  const [uri, init] = getMemberAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

const searchMembersAPIConfig = (params: SearchMembersParams): ApiConfig => {
  return [
    `${API_URL}/search/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const searchMembersAPI = async (
  fetch: Fetch<Member[]>,
  params: SearchMembersParams,
): Promise<Member[]> => {
  const [uri, init] = searchMembersAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};
