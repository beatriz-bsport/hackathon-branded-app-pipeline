import type { Tag, TagGroup } from "@bsport/api-core";

export type { Tag, TagGroup };

export type CreateTagGroupPayload = {
  name: string;
  kind: number;
};

export type UpdateTagGroupPayload = TagGroup;

export type DeleteTagGroupParams = {
  id: number;
};

export type CreateTagPayload = {
  name: string;
  group: number;
  color?: string;
  icon?: string;
};

export type UpdateTagPayload = Tag;

export type DeleteTagParams = {
  id: number;
};

export type TagUsage = {
  id: number;
  autotagrule_count: number;
  member_count: number;
  member_total_count: number;
  offer_count: number;
};
