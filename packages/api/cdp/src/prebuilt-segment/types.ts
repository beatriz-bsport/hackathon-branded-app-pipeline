import type { PrebuiltSegmentId } from "#src/constants";

export type PrebuiltSegmentDefinitionParams = {
  segment_identifier: PrebuiltSegmentId;
};

export type PrebuiltSegmentMembersParams = PrebuiltSegmentDefinitionParams & {
  page: number;
  page_size: number;
};

export type PrebuiltSegmentMetadataColumn = {
  id: string;
  fallback_label: string;
};

export type PrebuiltSegmentDefinition = {
  segment_id: string;
  fallback_title: string;
  fallback_description?: string | null;
  columns: Array<PrebuiltSegmentMetadataColumn>;
};

export type PrebuiltSegmentMemberIdentity = {
  id: number;
  name: string | null;
  email: string | null;
  photo?: string | null;
};

export type PrebuiltSegmentMemberRow = {
  member: PrebuiltSegmentMemberIdentity;
  values: Record<string, unknown>;
};

export type PrebuiltSegmentMembersPage = {
  count: number;
  page: number;
  page_size: number;
  results: Array<PrebuiltSegmentMemberRow>;
};
