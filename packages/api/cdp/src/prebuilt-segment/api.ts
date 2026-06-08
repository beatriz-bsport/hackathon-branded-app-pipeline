import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import { PREBUILT_SEGMENT_API_URL } from "./constants";
import type {
  PrebuiltSegmentDefinition,
  PrebuiltSegmentDefinitionParams,
  PrebuiltSegmentMembersPage,
  PrebuiltSegmentMembersParams,
} from "./types";

export const prebuiltSegmentKeys = {
  all: ["@api-cdp", "prebuilt-segment"] as const,
  details: () => [...prebuiltSegmentKeys.all, "detail"] as const,
  detail: (
    segmentIdentifier: PrebuiltSegmentDefinitionParams["segment_identifier"],
  ) => [...prebuiltSegmentKeys.details(), segmentIdentifier] as const,
  membersLists: () => [...prebuiltSegmentKeys.all, "members"] as const,
  membersList: ({
    segment_identifier,
    page,
    page_size,
  }: PrebuiltSegmentMembersParams) =>
    [
      ...prebuiltSegmentKeys.membersLists(),
      segment_identifier,
      page,
      page_size,
    ] as const,
} as const;

const fetchPrebuiltSegmentDefinitionAPIConfig = ({
  segment_identifier,
}: PrebuiltSegmentDefinitionParams): ApiConfig => [
  `${PREBUILT_SEGMENT_API_URL}/${segment_identifier}/`,
];

export const fetchPrebuiltSegmentDefinitionAPI = async (
  fetch: Fetch<PrebuiltSegmentDefinition>,
  params: PrebuiltSegmentDefinitionParams,
): Promise<PrebuiltSegmentDefinition> => {
  const [uri, init] = fetchPrebuiltSegmentDefinitionAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};

const fetchPrebuiltSegmentMembersAPIConfig = ({
  segment_identifier,
  page,
  page_size,
}: PrebuiltSegmentMembersParams): ApiConfig => [
  `${PREBUILT_SEGMENT_API_URL}/${segment_identifier}/members/${buildUrlParams({
    page,
    page_size,
  })}`,
];

export const fetchPrebuiltSegmentMembersAPI = async (
  fetch: Fetch<PrebuiltSegmentMembersPage>,
  params: PrebuiltSegmentMembersParams,
): Promise<PrebuiltSegmentMembersPage> => {
  const [uri, init] = fetchPrebuiltSegmentMembersAPIConfig(params);
  const { data } = await fetch(uri, init);

  return data;
};
