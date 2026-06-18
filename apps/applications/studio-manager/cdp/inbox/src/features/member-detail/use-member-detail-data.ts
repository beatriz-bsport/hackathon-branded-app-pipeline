import {
  type UseSuspenseQueryResult,
  useSuspenseQueries,
} from "@tanstack/react-query";

import {
  MEMBER_STALE_TIME,
  type MemberDetail,
  memberQueryOptions,
} from "@bsport/api-cdp/member";
import {
  type Tag,
  type TagGroup,
  fetchTagGroupsQueryOptions,
  fetchTagsQueryOptions,
} from "@bsport/api-cdp/tags";
import { unpaidInvoiceCountQueryOptions } from "@bsport/api-financial-services/invoice";

import { fetch } from "#src/utils/fetch";

import { mapMemberDetailToPanelProps } from "./map-member-detail";

export const useMemberDetailData = (memberId: number) =>
  useSuspenseQueries({
    queries: [
      {
        ...memberQueryOptions(fetch, { memberId }),
        staleTime: MEMBER_STALE_TIME,
      },
      {
        ...unpaidInvoiceCountQueryOptions(fetch, memberId),
        staleTime: MEMBER_STALE_TIME,
      },
      {
        ...fetchTagsQueryOptions(fetch),
        staleTime: MEMBER_STALE_TIME,
      },
      {
        ...fetchTagGroupsQueryOptions(fetch),
        staleTime: MEMBER_STALE_TIME,
      },
    ],
    combine: combineMemberDetail,
  });

const combineMemberDetail = ([
  memberQuery,
  unpaidQuery,
  tagsQuery,
  tagGroupsQuery,
]: [
  UseSuspenseQueryResult<MemberDetail>,
  UseSuspenseQueryResult<number>,
  UseSuspenseQueryResult<Tag[]>,
  UseSuspenseQueryResult<TagGroup[]>,
]) =>
  mapMemberDetailToPanelProps(
    memberQuery.data,
    unpaidQuery.data,
    tagsQuery.data,
    tagGroupsQuery.data,
  );
