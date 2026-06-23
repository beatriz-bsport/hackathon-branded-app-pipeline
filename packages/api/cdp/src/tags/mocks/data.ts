import type { Tag, TagGroup } from "../types";

// Tag IDs here match `mockMemberDetail.tags` in ../../member/mocks/data.ts so
// the member-detail panel can resolve names/colors/groups from these IDs.
export const mockTags: Tag[] = [
  {
    id: 11,
    group: 1,
    name: "VIP",
    color: "#F59E0B",
    icon: "",
    tag_template: null,
  },
  {
    id: 12,
    group: 2,
    name: "Reformer",
    color: "#7C3AED",
    icon: "",
    tag_template: null,
  },
  {
    id: 13,
    group: 3,
    name: "Evening classes",
    color: "#0EA5E9",
    icon: "",
    tag_template: null,
  },
  {
    id: 14,
    group: 4,
    name: "Birthday today",
    color: "#10B981",
    icon: "",
    tag_template: null,
  },
];

export const mockTagGroups: TagGroup[] = [
  {
    id: 1,
    name: "Status",
    tags: [11],
    kind: 0,
    tag_group_template: null,
    is_created_for_zoho: false,
  },
  {
    id: 2,
    name: "Interests",
    tags: [12],
    kind: 0,
    tag_group_template: null,
    is_created_for_zoho: false,
  },
  {
    id: 3,
    name: "Preferences",
    tags: [13],
    kind: 0,
    tag_group_template: null,
    is_created_for_zoho: false,
  },
  {
    id: 4,
    name: "Lifecycle",
    tags: [14],
    kind: 0,
    tag_group_template: null,
    is_created_for_zoho: false,
  },
];
