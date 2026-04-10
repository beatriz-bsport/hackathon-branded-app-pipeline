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
