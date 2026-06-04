import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateMemberDateJoinedFilterPayload,
  MemberDateJoinedFilter,
  UpdateMemberDateJoinedFilterPayload,
} from "./types";

const MEMBER_DATE_JOINED_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/member_date_joined`;

export const createMemberDateJoinedFilter = async (
  fetch: Fetch<MemberDateJoinedFilter>,
  payload: CreateMemberDateJoinedFilterPayload,
): Promise<MemberDateJoinedFilter> => {
  const { data } = await fetch(`${MEMBER_DATE_JOINED_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchMemberDateJoinedFilter = async (
  fetch: Fetch<MemberDateJoinedFilter>,
  filterId: number,
  payload: UpdateMemberDateJoinedFilterPayload,
): Promise<MemberDateJoinedFilter> => {
  const { data } = await fetch(
    `${MEMBER_DATE_JOINED_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteMemberDateJoinedFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${MEMBER_DATE_JOINED_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
