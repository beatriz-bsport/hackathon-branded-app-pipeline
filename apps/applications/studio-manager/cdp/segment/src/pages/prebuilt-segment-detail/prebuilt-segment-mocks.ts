// TODO: replace with @bsport/api/cdp-segment queries once the backend lands.
import { useMemo } from "react";

import {
  ActiveTrialStatusId,
  CustomerLifecycleStateId,
} from "@bsport/api-cdp/prebuilt-segment";

import type { PrebuiltSegmentId } from "./constants";
import {
  type ActiveMembersRow,
  type ActiveTrialsRow,
  type CustomersRow,
  parsePrebuiltSegmentDefinitionResponse,
  parsePrebuiltSegmentMembersResponse,
} from "./prebuilt-segment-contract";

const PREBUILT_SEGMENT_DEFINITION_PAYLOADS = {
  active_members: {
    segment_id: "active_members",
    fallback_title: "Active members",
    fallback_description: "Members with an active pass.",
    columns: [
      { id: "pass_name", fallback_label: "Pass name" },
      {
        id: "pass_validity_start_date",
        fallback_label: "Pass start date",
      },
      { id: "last_visit_date", fallback_label: "Last visit date" },
    ],
    sortable_fields: [
      "name",
      "email",
      "pass_name",
      "pass_validity_start_date",
      "last_visit_date",
    ],
  },
  active_trials: {
    segment_id: "active_trials",
    fallback_title: "Trials (intro offer)",
    fallback_description:
      "Convert new clients before their trial window closes. This segment groups all clients currently on an active trial or intro pass who have not yet made a second purchase.",
    columns: [
      { id: "pass_name", fallback_label: "Pass name" },
      {
        id: "pass_validity_start_date",
        fallback_label: "Trial start date",
      },
      { id: "offer_expiry_date", fallback_label: "Offer expiry date" },
      { id: "status", fallback_label: "Status" },
    ],
    sortable_fields: [
      "name",
      "email",
      "pass_name",
      "pass_validity_start_date",
      "offer_expiry_date",
      "status",
    ],
  },
  customers: {
    segment_id: "customers",
    fallback_title: "Customers",
    fallback_description: "All customers grouped by lifecycle state.",
    columns: [
      { id: "date_joined", fallback_label: "Join date" },
      { id: "last_purchase_date", fallback_label: "Last purchase date" },
      { id: "last_visit_date", fallback_label: "Last visit date" },
      {
        id: "current_lifecycle_state",
        fallback_label: "Lifecycle state",
      },
    ],
    sortable_fields: [
      "name",
      "email",
      "date_joined",
      "last_purchase_date",
      "last_visit_date",
      "current_lifecycle_state",
    ],
  },
} as const;

const ACTIVE_MEMBERS_ROWS: Array<ActiveMembersRow> = [
  {
    member: {
      id: 31001,
      name: "Maya Chen",
      email: "maya.chen@example.com",
    },
    values: {
      pass_name: "Unlimited Monthly",
      pass_validity_start_date: "2026-04-02",
      last_visit_date: "2026-05-17",
    },
  },
  {
    member: {
      id: 31002,
      name: "Rowan Indigo",
      email: "rowan.indigo@example.com",
    },
    values: {
      pass_name: "10 Class Pack",
      pass_validity_start_date: "2026-03-15",
      last_visit_date: "2026-05-14",
    },
  },
  {
    member: {
      id: 31003,
      name: "Dakota Gray",
      email: "dakota.gray@example.com",
    },
    values: {
      pass_name: "Pilates Membership",
      pass_validity_start_date: "2026-02-20",
      last_visit_date: "2026-05-13",
    },
  },
  {
    member: {
      id: 31004,
      name: "Cameron Red",
      email: "cameron.red@example.com",
    },
    values: {
      pass_name: "Annual Membership",
      pass_validity_start_date: "2026-01-05",
      last_visit_date: "2026-05-11",
    },
  },
  {
    member: {
      id: 31005,
      name: "Jamie Brown",
      email: "jamie.brown@example.com",
    },
    values: {
      pass_name: "Strength Membership",
      pass_validity_start_date: "2026-04-08",
      last_visit_date: "2026-05-10",
    },
  },
  {
    member: {
      id: 31006,
      name: "Morgan White",
      email: "morgan.white@example.com",
    },
    values: {
      pass_name: "Yoga Unlimited",
      pass_validity_start_date: "2026-04-21",
      last_visit_date: "2026-05-08",
    },
  },
  {
    member: {
      id: 31007,
      name: "Isabella Johnson",
      email: "isabella.johnson@example.com",
    },
    values: {
      pass_name: "6 Month Membership",
      pass_validity_start_date: "2026-02-12",
      last_visit_date: "2026-05-07",
    },
  },
  {
    member: {
      id: 31008,
      name: "Oliver Parker",
      email: "oliver.parker@example.com",
    },
    values: {
      pass_name: "Unlimited Monthly",
      pass_validity_start_date: "2026-05-01",
      last_visit_date: "2026-05-06",
    },
  },
  {
    member: {
      id: 31009,
      name: "Avery Blake",
      email: "avery.blake@example.com",
    },
    values: {
      pass_name: "8 Class Pack",
      pass_validity_start_date: "2026-04-18",
      last_visit_date: null,
    },
  },
  {
    member: {
      id: 31010,
      name: "Harper Violet",
      email: "harper.violet@example.com",
    },
    values: {
      pass_name: "Barre Membership",
      pass_validity_start_date: "2026-03-09",
      last_visit_date: "2026-05-05",
    },
  },
  {
    member: {
      id: 31011,
      name: "Peyton Gold",
      email: "peyton.gold@example.com",
    },
    values: {
      pass_name: "Reformer Membership",
      pass_validity_start_date: "2026-05-04",
      last_visit_date: "2026-05-04",
    },
  },
  {
    member: {
      id: 31012,
      name: "Quinn Roberts",
      email: "quinn.roberts@example.com",
    },
    values: {
      pass_name: null,
      pass_validity_start_date: null,
      last_visit_date: "2026-05-02",
    },
  },
];

const ACTIVE_TRIALS_ROWS: Array<ActiveTrialsRow> = [
  {
    member: {
      id: 32001,
      name: "Rowan Indigo",
      email: "rowan.indigo@example.com",
    },
    values: {
      pass_name: "Free trial",
      pass_validity_start_date: "2026-04-28",
      offer_expiry_date: "2026-05-28",
      status_id: ActiveTrialStatusId.BOOKED,
    },
  },
  {
    member: {
      id: 32002,
      name: "Dakota Gray",
      email: "dakota.gray@example.com",
    },
    values: {
      pass_name: "Intro offer",
      pass_validity_start_date: "2026-05-02",
      offer_expiry_date: "2026-05-30",
      status_id: ActiveTrialStatusId.PURCHASED,
    },
  },
  {
    member: {
      id: 32003,
      name: "Cameron Red",
      email: "cameron.red@example.com",
    },
    values: {
      pass_name: "Free trial",
      pass_validity_start_date: "2026-04-25",
      offer_expiry_date: "2026-05-25",
      status_id: ActiveTrialStatusId.ATTENDED,
    },
  },
  {
    member: {
      id: 32004,
      name: "Jamie Brown",
      email: "jamie.brown@example.com",
    },
    values: {
      pass_name: "Starter week",
      pass_validity_start_date: "2026-05-01",
      offer_expiry_date: "2026-05-22",
      status_id: ActiveTrialStatusId.BOOKED,
    },
  },
  {
    member: {
      id: 32005,
      name: "Morgan White",
      email: "morgan.white@example.com",
    },
    values: {
      pass_name: "Free trial",
      pass_validity_start_date: "2026-04-20",
      offer_expiry_date: "2026-05-20",
      status_id: ActiveTrialStatusId.ATTENDED,
    },
  },
  {
    member: {
      id: 32006,
      name: "Isabella Johnson",
      email: "isabella.johnson@example.com",
    },
    values: {
      pass_name: "Intro offer",
      pass_validity_start_date: "2026-05-05",
      offer_expiry_date: "2026-06-05",
      status_id: ActiveTrialStatusId.PURCHASED,
    },
  },
  {
    member: {
      id: 32007,
      name: "Oliver Parker",
      email: "oliver.parker@example.com",
    },
    values: {
      pass_name: "Starter week",
      pass_validity_start_date: "2026-05-07",
      offer_expiry_date: "2026-05-21",
      status_id: ActiveTrialStatusId.BOOKED,
    },
  },
  {
    member: {
      id: 32008,
      name: "Avery Blake",
      email: "avery.blake@example.com",
    },
    values: {
      pass_name: "Free trial",
      pass_validity_start_date: "2026-05-09",
      offer_expiry_date: "2026-06-09",
      status_id: ActiveTrialStatusId.ATTENDED,
    },
  },
  {
    member: {
      id: 32009,
      name: "Harper Violet",
      email: "harper.violet@example.com",
    },
    values: {
      pass_name: "Intro offer",
      pass_validity_start_date: "2026-05-10",
      offer_expiry_date: "2026-06-10",
      status_id: ActiveTrialStatusId.BOOKED,
    },
  },
  {
    member: {
      id: 32010,
      name: "Peyton Gold",
      email: "peyton.gold@example.com",
    },
    values: {
      pass_name: null,
      pass_validity_start_date: null,
      offer_expiry_date: "2026-05-29",
      status_id: null,
    },
  },
];

const CUSTOMERS_ROWS: Array<CustomersRow> = [
  {
    member: {
      id: 33001,
      name: "Cameron Red",
      email: "cameron.red@example.com",
    },
    values: {
      date_joined: "2022-03-02",
      last_purchase_date: "2026-05-04",
      last_visit_date: "2026-05-14",
      current_lifecycle_state_id: CustomerLifecycleStateId.ACTIVE,
    },
  },
  {
    member: {
      id: 33002,
      name: "Dakota Gray",
      email: "dakota.gray@example.com",
    },
    values: {
      date_joined: "2023-08-29",
      last_purchase_date: "2026-04-26",
      last_visit_date: "2026-05-13",
      current_lifecycle_state_id: CustomerLifecycleStateId.ACTIVE,
    },
  },
  {
    member: {
      id: 33003,
      name: "Jamie Brown",
      email: "jamie.brown@example.com",
    },
    values: {
      date_joined: "2025-08-14",
      last_purchase_date: null,
      last_visit_date: "2026-04-28",
      current_lifecycle_state_id: CustomerLifecycleStateId.LEAD,
    },
  },
  {
    member: {
      id: 33004,
      name: "Morgan White",
      email: "morgan.white@example.com",
    },
    values: {
      date_joined: "2026-02-11",
      last_purchase_date: "2026-04-17",
      last_visit_date: "2026-05-02",
      current_lifecycle_state_id: CustomerLifecycleStateId.INACTIVE,
    },
  },
  {
    member: {
      id: 33005,
      name: "Isabella Johnson",
      email: "isabella.johnson@example.com",
    },
    values: {
      date_joined: "2026-02-19",
      last_purchase_date: "2026-05-01",
      last_visit_date: "2026-05-11",
      current_lifecycle_state_id: CustomerLifecycleStateId.ACTIVE,
    },
  },
  {
    member: {
      id: 33006,
      name: "Oliver Parker",
      email: "oliver.parker@example.com",
    },
    values: {
      date_joined: "2026-03-25",
      last_purchase_date: "2026-04-25",
      last_visit_date: "2026-05-06",
      current_lifecycle_state_id: CustomerLifecycleStateId.ACTIVE,
    },
  },
  {
    member: {
      id: 33007,
      name: "Avery Blake",
      email: "avery.blake@example.com",
    },
    values: {
      date_joined: "2025-05-14",
      last_purchase_date: "2025-09-01",
      last_visit_date: null,
      current_lifecycle_state_id: CustomerLifecycleStateId.CHURNED,
    },
  },
  {
    member: {
      id: 33008,
      name: "Harper Violet",
      email: "harper.violet@example.com",
    },
    values: {
      date_joined: "2026-03-27",
      last_purchase_date: "2026-05-10",
      last_visit_date: "2026-05-12",
      current_lifecycle_state_id: CustomerLifecycleStateId.ACTIVE,
    },
  },
  {
    member: {
      id: 33009,
      name: "Peyton Gold",
      email: "peyton.gold@example.com",
    },
    values: {
      date_joined: "2026-03-11",
      last_purchase_date: "2026-05-15",
      last_visit_date: "2026-05-16",
      current_lifecycle_state_id: CustomerLifecycleStateId.ACTIVE,
    },
  },
  {
    member: {
      id: 33010,
      name: "Quinn Roberts",
      email: "quinn.roberts@example.com",
    },
    values: {
      date_joined: "2026-01-22",
      last_purchase_date: null,
      last_visit_date: null,
      current_lifecycle_state_id: CustomerLifecycleStateId.LEAD,
    },
  },
  {
    member: {
      id: 33011,
      name: "Noah Reed",
      email: "noah.reed@example.com",
    },
    values: {
      date_joined: "2024-11-09",
      last_purchase_date: "2025-10-03",
      last_visit_date: "2025-10-07",
      current_lifecycle_state_id: CustomerLifecycleStateId.ARCHIVED,
    },
  },
  {
    member: {
      id: 33012,
      name: "Luna Hart",
      email: "luna.hart@example.com",
    },
    values: {
      date_joined: "2024-06-18",
      last_purchase_date: "2025-02-14",
      last_visit_date: "2025-02-20",
      current_lifecycle_state_id: CustomerLifecycleStateId.INACTIVE,
    },
  },
];

const PREBUILT_SEGMENT_MEMBER_ROWS = {
  active_members: ACTIVE_MEMBERS_ROWS,
  active_trials: ACTIVE_TRIALS_ROWS,
  customers: CUSTOMERS_ROWS,
} as const;

export function usePrebuiltSegmentDefinition(
  prebuiltSegmentId: PrebuiltSegmentId,
) {
  return useMemo(
    () =>
      parsePrebuiltSegmentDefinitionResponse(
        PREBUILT_SEGMENT_DEFINITION_PAYLOADS[prebuiltSegmentId],
        {
          requestedPrebuiltSegmentId: prebuiltSegmentId,
        },
      ),
    [prebuiltSegmentId],
  );
}

function paginate(
  rows: ReadonlyArray<unknown>,
  page: number,
  pageSize: number,
) {
  const startIndex = (page - 1) * pageSize;

  return {
    count: rows.length,
    page,
    page_size: pageSize,
    results: rows.slice(startIndex, startIndex + pageSize),
  };
}

export function usePrebuiltSegmentMembers(
  prebuiltSegmentId: PrebuiltSegmentId,
  page: number,
  pageSize: number,
) {
  return useMemo(
    () =>
      parsePrebuiltSegmentMembersResponse(
        paginate(
          PREBUILT_SEGMENT_MEMBER_ROWS[prebuiltSegmentId],
          page,
          pageSize,
        ),
        { requestedPrebuiltSegmentId: prebuiltSegmentId },
      ),
    [page, pageSize, prebuiltSegmentId],
  );
}
