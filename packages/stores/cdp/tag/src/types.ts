export type TagGroup = {
  id: number;
  name: string;
  tags: number[];
  kind: number;
  tag_group_template: number | null;
  is_created_for_zoho: boolean;
};

export type Tag = {
  id: number;
  group: number;
  name: string;
  color: string;
  icon: string;
  tag_template: number | null;
};

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
