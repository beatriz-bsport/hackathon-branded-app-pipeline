import { QueryClient } from "@tanstack/react-query";

import type {
  Establishment,
  MetaActivity,
  Session,
  Teacher,
} from "@bsport/api-book";
import {
  establishmentKeys,
  groupActivityKeys,
  sessionKeys,
  teacherKeys,
} from "@bsport/api-book";
import type { Tag, TagGroup } from "@bsport/api-cdp/tags";
import { tagsKeys } from "@bsport/api-cdp/tags";

export const SESSION_ID = 1;
export const TEACHER_ID = 10;
export const ESTABLISHMENT_ID = 20;
export const META_ACTIVITY_ID = 100;
export const HYBRID_OFFER_ID = 999;

const baseTeacher = {
  id: TEACHER_ID,
  name: "Elisabeth Teacher",
  firstname: "Elisabeth",
  lastname: "Teacher",
  photo: null,
  color: "#7E57C2",
} as unknown as Teacher;

const baseEstablishment = {
  id: ESTABLISHMENT_ID,
  title: "Flow Studio Downtown",
} as unknown as Establishment;

const baseActivity = {
  id: META_ACTIVITY_ID,
  name: "Yoga Flow",
} as unknown as MetaActivity;

const tagGroups: TagGroup[] = [
  {
    id: 1,
    name: "Main-tag",
    tags: [11, 12, 13],
    kind: 1,
    tag_group_template: null,
    is_created_for_zoho: false,
  },
  {
    id: 2,
    name: "Level",
    tags: [21],
    kind: 1,
    tag_group_template: null,
    is_created_for_zoho: false,
  },
];

const tags: Tag[] = [
  {
    id: 11,
    group: 1,
    name: "Sub-tag",
    color: "#2E7D6F",
    icon: "",
    tag_template: null,
  },
  {
    id: 12,
    group: 1,
    name: "Sub-tag",
    color: "#2E7D6F",
    icon: "",
    tag_template: null,
  },
  {
    id: 13,
    group: 1,
    name: "VIP",
    color: "#2E7D6F",
    icon: "",
    tag_template: null,
  },
  {
    id: 21,
    group: 2,
    name: "Beginner",
    color: "#B14F4F",
    icon: "",
    tag_template: null,
  },
];

const baseSession = {
  activity_name: "Yoga Flow Basics",
  activity: 1,
  additional_coaches: [],
  allow_guest_offer: false,
  available_on_partnership: false,
  available: true,
  blacklist_tags: [],
  booking_options: [],
  bookings: [],
  broadcast_link: "",
  coach_override: null,
  coach_payment_rule_id: null,
  coach: TEACHER_ID,
  company: 1,
  credit_price: 2,
  custom_level: 0,
  date_roll_call_last_modified: null,
  date_start: "2026-05-12T13:00:00Z",
  duration_minute: 60,
  effectif: 12,
  establishment: ESTABLISHMENT_ID,
  full: false,
  group: null,
  id: SESSION_ID,
  internal_note: null,
  is_waiting_list_full: false,
  level: 0,
  linked_hybrid_offer_id: null,
  manager_only: false,
  meta_activity_color: null,
  meta_activity: META_ACTIVITY_ID,
  name_override: "",
  partner_max_booking_count: 0,
  recurrence_id: "",
  roll_call_needs_validation: false,
  room_blueprint: null,
  timezone_name: "Europe/Paris",
  tot_slots: 24,
  validated_booking_count: 0,
  waiting_list_disabled: false,
  waiting_list_max_size: 0,
  whitelist_tags: [],
} as unknown as Session;

export const sessionVariants = {
  default: {
    ...baseSession,
    recurrence_id: "recurrence-abc-123",
    linked_hybrid_offer_id: HYBRID_OFFER_ID,
    whitelist_tags: [11, 12],
    blacklist_tags: [21],
  },
  minimal: {
    ...baseSession,
    meta_activity: 0,
    recurrence_id: "",
    linked_hybrid_offer_id: null,
    whitelist_tags: [],
    blacklist_tags: [],
  },
} satisfies Record<string, Session>;

export const seededSessionPanelClient = (session: Session): QueryClient => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });

  client.setQueryData(sessionKeys.detail(SESSION_ID), session);
  client.setQueryData(teacherKeys.detail(TEACHER_ID), baseTeacher);
  client.setQueryData(
    establishmentKeys.detail(ESTABLISHMENT_ID),
    baseEstablishment,
  );
  // useRetrieveSessionDetails always queries the activity, even when
  // session.meta_activity is 0 — seed under whichever id the variant uses.
  client.setQueryData(groupActivityKeys.detail(session.meta_activity), {
    ...baseActivity,
    id: session.meta_activity,
  });
  client.setQueryData(tagsKeys.tagList(), tags);
  client.setQueryData(tagsKeys.tagGroupList(), tagGroups);

  return client;
};
