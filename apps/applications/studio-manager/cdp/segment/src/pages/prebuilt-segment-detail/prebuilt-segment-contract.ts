import { DateTime } from "luxon";
import { z } from "zod";

import {
  ActiveTrialStatusId,
  CustomerLifecycleStateId,
} from "@bsport/api-cdp/prebuilt-segment";
import { captureException } from "@bsport/sm-backbone";

import type { PrebuiltSegmentId } from "./constants";

const isoCompanyLocalDateSchema = z.string().superRefine((value, ctx) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid company-local date format",
    });
    return;
  }

  const parsedDate = DateTime.fromISO(value, { zone: "utc" });

  if (!parsedDate.isValid || parsedDate.toISODate() !== value) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid company-local date value",
    });
  }
});

const prebuiltMetadataColumnIdSchema = z.enum([
  "pass_name",
  "pass_validity_start_date",
  "last_visit_date",
  "offer_expiry_date",
  "status_id",
  "join_date",
  "last_purchase_date",
  "current_lifecycle_state_id",
]);

const metadataColumnSchema = z.object({
  id: prebuiltMetadataColumnIdSchema,
  fallback_label: z.string().min(1),
});

const memberIdentitySchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  photo: z.string().nullable().optional(),
});

const membersPageSchema = z.object({
  count: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  page_size: z.number().int().positive(),
});

const activeMembersValuesSchema = z
  .object({
    pass_name: z.string().nullable(),
    pass_validity_start_date: isoCompanyLocalDateSchema.nullable(),
    last_visit_date: isoCompanyLocalDateSchema.nullable(),
  })
  .strict();

const activeTrialStatusIdSchema = z.nativeEnum(ActiveTrialStatusId);

const customerLifecycleStateIdSchema = z.nativeEnum(CustomerLifecycleStateId);
const nullableCustomerLifecycleStateIdSchema = z
  .union([customerLifecycleStateIdSchema, z.literal(0)])
  .nullable();

const activeTrialsValuesSchema = z
  .object({
    pass_name: z.string().nullable(),
    pass_validity_start_date: isoCompanyLocalDateSchema.nullable(),
    offer_expiry_date: isoCompanyLocalDateSchema.nullable(),
    status_id: activeTrialStatusIdSchema.nullable(),
  })
  .strict();

const customersValuesSchema = z
  .object({
    join_date: isoCompanyLocalDateSchema.nullable(),
    last_purchase_date: isoCompanyLocalDateSchema.nullable(),
    last_visit_date: isoCompanyLocalDateSchema.nullable(),
    current_lifecycle_state_id: nullableCustomerLifecycleStateIdSchema,
  })
  .strict();

function createMetadataColumnsSchema(
  allowedColumnIds: ReadonlyArray<
    z.infer<typeof prebuiltMetadataColumnIdSchema>
  >,
) {
  const allowedColumnIdSet = new Set(allowedColumnIds);

  return z.array(metadataColumnSchema).superRefine((columns, ctx) => {
    const seenColumnIds = new Set<string>();

    columns.forEach((column, columnIndex) => {
      if (!allowedColumnIdSet.has(column.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [columnIndex, "id"],
          message: "Unsupported metadata column for this segment",
        });
      }

      if (seenColumnIds.has(column.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [columnIndex, "id"],
          message: "Duplicate metadata column",
        });
      }

      seenColumnIds.add(column.id);
    });

    allowedColumnIds.forEach((columnId) => {
      if (!seenColumnIds.has(columnId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [],
          message: "Missing required metadata column for this segment",
        });
      }
    });
  });
}

const prebuiltSegmentDefinitionBaseSchema = z.object({
  fallback_title: z.string().min(1),
  fallback_description: z.string().nullable().optional(),
});

const activeMembersDefinitionSchema =
  prebuiltSegmentDefinitionBaseSchema.extend({
    segment_id: z.literal("active_members"),
    columns: createMetadataColumnsSchema([
      "pass_name",
      "pass_validity_start_date",
      "last_visit_date",
    ]),
  });

const activeTrialsDefinitionSchema = prebuiltSegmentDefinitionBaseSchema.extend(
  {
    segment_id: z.literal("active_trials"),
    columns: createMetadataColumnsSchema([
      "pass_name",
      "pass_validity_start_date",
      "offer_expiry_date",
      "status_id",
    ]),
  },
);

const customersDefinitionSchema = prebuiltSegmentDefinitionBaseSchema.extend({
  segment_id: z.literal("customers"),
  columns: createMetadataColumnsSchema([
    "join_date",
    "last_purchase_date",
    "last_visit_date",
    "current_lifecycle_state_id",
  ]),
});

export const prebuiltSegmentDefinitionSchema = z.discriminatedUnion(
  "segment_id",
  [
    activeMembersDefinitionSchema,
    activeTrialsDefinitionSchema,
    customersDefinitionSchema,
  ],
);

const activeMembersRowSchema = z.object({
  member: memberIdentitySchema,
  values: activeMembersValuesSchema,
});

const activeTrialsRowSchema = z.object({
  member: memberIdentitySchema,
  values: activeTrialsValuesSchema,
});

const customersRowSchema = z.object({
  member: memberIdentitySchema,
  values: customersValuesSchema,
});

export const prebuiltSegmentMembersSchemaById = {
  active_members: membersPageSchema.extend({
    results: z.array(activeMembersRowSchema),
  }),
  active_trials: membersPageSchema.extend({
    results: z.array(activeTrialsRowSchema),
  }),
  customers: membersPageSchema.extend({
    results: z.array(customersRowSchema),
  }),
} satisfies Record<PrebuiltSegmentId, z.ZodType>;

export type PrebuiltSegmentMetadataColumnId = z.infer<
  typeof prebuiltMetadataColumnIdSchema
>;
export type PrebuiltSegmentDefinitionResponse = z.infer<
  typeof prebuiltSegmentDefinitionSchema
>;
export type ActiveMembersRow = z.infer<typeof activeMembersRowSchema>;
export type ActiveTrialsRow = z.infer<typeof activeTrialsRowSchema>;
export type CustomersRow = z.infer<typeof customersRowSchema>;
export type PrebuiltSegmentDetailRow =
  | ActiveMembersRow
  | ActiveTrialsRow
  | CustomersRow;
export type ActiveMembersResponse = z.infer<
  typeof prebuiltSegmentMembersSchemaById.active_members
>;
export type ActiveTrialsResponse = z.infer<
  typeof prebuiltSegmentMembersSchemaById.active_trials
>;
export type CustomersResponse = z.infer<
  typeof prebuiltSegmentMembersSchemaById.customers
>;
export type PrebuiltSegmentMembersResponse =
  | ActiveMembersResponse
  | ActiveTrialsResponse
  | CustomersResponse;

function getPayloadRecord(payload: unknown) {
  return typeof payload === "object" && payload !== null ? payload : undefined;
}

function getReceivedColumnIds(payload: unknown) {
  const payloadRecord = getPayloadRecord(payload);

  if (!payloadRecord || !("columns" in payloadRecord)) {
    return undefined;
  }

  const columns = payloadRecord.columns;

  if (!Array.isArray(columns)) {
    return undefined;
  }

  return columns.map((column) => {
    if (
      typeof column === "object" &&
      column !== null &&
      "id" in column &&
      typeof column.id === "string"
    ) {
      return column.id;
    }

    return "<invalid-column>";
  });
}

function getReceivedSegmentId(payload: unknown) {
  const payloadRecord = getPayloadRecord(payload);

  if (
    payloadRecord &&
    "segment_id" in payloadRecord &&
    typeof payloadRecord.segment_id === "string"
  ) {
    return payloadRecord.segment_id;
  }

  return undefined;
}

function getPaginationSummary(payload: unknown) {
  const payloadRecord = getPayloadRecord(payload);

  if (!payloadRecord) {
    return undefined;
  }

  const count =
    "count" in payloadRecord && typeof payloadRecord.count === "number"
      ? payloadRecord.count
      : undefined;
  const page =
    "page" in payloadRecord && typeof payloadRecord.page === "number"
      ? payloadRecord.page
      : undefined;
  const pageSize =
    "page_size" in payloadRecord && typeof payloadRecord.page_size === "number"
      ? payloadRecord.page_size
      : undefined;
  const resultCount =
    "results" in payloadRecord && Array.isArray(payloadRecord.results)
      ? payloadRecord.results.length
      : undefined;

  return {
    count,
    page,
    pageSize,
    resultCount,
  };
}

function sanitizeZodIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    code: issue.code,
    path: issue.path.map(String),
  }));
}

export function parsePrebuiltSegmentDefinitionResponse(
  payload: unknown,
  context: { requestedPrebuiltSegmentId: PrebuiltSegmentId },
) {
  const result = prebuiltSegmentDefinitionSchema.safeParse(payload);

  if (!result.success) {
    captureException(
      new Error("Prebuilt segment definition API contract validation failed"),
      {
        tags: {
          feature: "cdp-prebuilt-segment-detail",
          endpoint: "definition",
        },
        extra: {
          requestedPrebuiltSegmentId: context.requestedPrebuiltSegmentId,
          receivedPrebuiltSegmentId: getReceivedSegmentId(payload),
          receivedColumnIds: getReceivedColumnIds(payload),
          issues: sanitizeZodIssues(result.error),
        },
      },
    );

    throw result.error;
  }

  if (result.data.segment_id !== context.requestedPrebuiltSegmentId) {
    captureException(new Error("Prebuilt segment definition id mismatch"), {
      tags: {
        feature: "cdp-prebuilt-segment-detail",
        endpoint: "definition",
      },
      extra: {
        requestedPrebuiltSegmentId: context.requestedPrebuiltSegmentId,
        receivedPrebuiltSegmentId: result.data.segment_id,
      },
    });

    throw new Error("Prebuilt segment definition id mismatch");
  }

  return result.data;
}

export function parsePrebuiltSegmentMembersResponse(
  payload: unknown,
  context: { requestedPrebuiltSegmentId: PrebuiltSegmentId },
) {
  const schema =
    prebuiltSegmentMembersSchemaById[context.requestedPrebuiltSegmentId];
  const result = schema.safeParse(payload);

  if (!result.success) {
    captureException(
      new Error("Prebuilt segment members API contract validation failed"),
      {
        tags: {
          feature: "cdp-prebuilt-segment-detail",
          endpoint: "members",
        },
        extra: {
          requestedPrebuiltSegmentId: context.requestedPrebuiltSegmentId,
          pagination: getPaginationSummary(payload),
          issues: sanitizeZodIssues(result.error),
        },
      },
    );

    throw result.error;
  }

  return result.data;
}
