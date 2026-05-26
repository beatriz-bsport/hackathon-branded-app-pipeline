import { describe, expect, it, vi } from "vitest";

import {
  ActiveTrialStatusId,
  CustomerLifecycleStateId,
} from "@bsport/api-cdp/prebuilt-segment";

import {
  parsePrebuiltSegmentDefinitionResponse,
  parsePrebuiltSegmentMembersResponse,
} from "#src/pages/prebuilt-segment-detail/prebuilt-segment-contract";

vi.mock("@bsport/sm-backbone", () => ({
  captureException: vi.fn(),
}));

describe("prebuilt segment contract", () => {
  it("parses the active members definition payload", () => {
    const result = parsePrebuiltSegmentDefinitionResponse(
      {
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
      {
        requestedPrebuiltSegmentId: "active_members",
      },
    );

    expect(result.segment_id).toBe("active_members");
    expect(result.columns).toHaveLength(3);
  });

  it("parses the customers members payload", () => {
    const result = parsePrebuiltSegmentMembersResponse(
      {
        count: 1,
        page: 1,
        page_size: 25,
        results: [
          {
            member: {
              id: 1,
              name: "Cameron Red",
              email: "cameron.red@example.com",
            },
            values: {
              date_joined: "2022-03-02",
              last_purchase_date: "2022-03-01",
              last_visit_date: null,
              current_lifecycle_state_id: CustomerLifecycleStateId.CHURNED,
            },
          },
        ],
      },
      {
        requestedPrebuiltSegmentId: "customers",
      },
    );

    expect(result.count).toBe(1);
    expect(result.results[0]?.member.name).toBe("Cameron Red");
    expect(result.results[0]?.values).toEqual(
      expect.objectContaining({
        current_lifecycle_state_id: CustomerLifecycleStateId.CHURNED,
      }),
    );
  });

  it("parses the active trials members payload with numeric status ids", () => {
    const result = parsePrebuiltSegmentMembersResponse(
      {
        count: 1,
        page: 1,
        page_size: 25,
        results: [
          {
            member: {
              id: 1,
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
        ],
      },
      {
        requestedPrebuiltSegmentId: "active_trials",
      },
    );

    expect(result.count).toBe(1);
    expect(result.results[0]?.values).toEqual(
      expect.objectContaining({ status_id: ActiveTrialStatusId.PURCHASED }),
    );
  });

  it("rejects members payloads with invalid numeric enum values", () => {
    expect(() =>
      parsePrebuiltSegmentMembersResponse(
        {
          count: 1,
          page: 1,
          page_size: 25,
          results: [
            {
              member: {
                id: 1,
                name: "Dakota Gray",
                email: "dakota.gray@example.com",
              },
              values: {
                pass_name: "Intro offer",
                pass_validity_start_date: "2026-05-02",
                offer_expiry_date: "2026-05-30",
                status_id: 99,
              },
            },
          ],
        },
        {
          requestedPrebuiltSegmentId: "active_trials",
        },
      ),
    ).toThrow();
  });

  it("rejects members payloads with legacy string enum values", () => {
    expect(() =>
      parsePrebuiltSegmentMembersResponse(
        {
          count: 1,
          page: 1,
          page_size: 25,
          results: [
            {
              member: {
                id: 1,
                name: "Cameron Red",
                email: "cameron.red@example.com",
              },
              values: {
                date_joined: "2022-03-02",
                last_purchase_date: "2022-03-01",
                last_visit_date: null,
                current_lifecycle_state_id: "churned",
              },
            },
          ],
        },
        {
          requestedPrebuiltSegmentId: "customers",
        },
      ),
    ).toThrow();
  });

  it("rejects a definition when the segment id mismatches the requested id", () => {
    expect(() =>
      parsePrebuiltSegmentDefinitionResponse(
        {
          segment_id: "customers",
          fallback_title: "Customers",
          columns: [
            { id: "date_joined", fallback_label: "Join date" },
            {
              id: "last_purchase_date",
              fallback_label: "Last purchase date",
            },
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
        {
          requestedPrebuiltSegmentId: "active_members",
        },
      ),
    ).toThrow("Prebuilt segment definition id mismatch");
  });

  it("rejects a definition with duplicate metadata columns", () => {
    expect(() =>
      parsePrebuiltSegmentDefinitionResponse(
        {
          segment_id: "active_members",
          fallback_title: "Active members",
          columns: [
            { id: "pass_name", fallback_label: "Pass name" },
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
        {
          requestedPrebuiltSegmentId: "active_members",
        },
      ),
    ).toThrow();
  });

  it("rejects a definition with missing required metadata columns", () => {
    expect(() =>
      parsePrebuiltSegmentDefinitionResponse(
        {
          segment_id: "customers",
          fallback_title: "Customers",
          columns: [
            { id: "date_joined", fallback_label: "Join date" },
            {
              id: "last_purchase_date",
              fallback_label: "Last purchase date",
            },
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
            "current_lifecycle_state",
          ],
        },
        {
          requestedPrebuiltSegmentId: "customers",
        },
      ),
    ).toThrow();
  });
});
