import { useMemo } from "react";

import {
  ACTIVE_TRIAL_STATUS_BY_ID,
  type ActiveTrialStatus,
  type ActiveTrialStatusId,
  CUSTOMER_LIFECYCLE_STATE_BY_ID,
  type CustomerLifecycleState,
  type CustomerLifecycleStateId,
} from "@bsport/api-cdp/prebuilt-segment";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Body, type GenericTableColumn } from "@bsport/kaizen-primitive-core";

import { MemberAvatar } from "#src/components/member-avatar";
import { i18nInstance, useTranslation } from "#src/utils/i18n";

import type { PrebuiltSegmentId } from "./constants";
import type {
  PrebuiltSegmentDefinitionResponse,
  PrebuiltSegmentDetailRow,
  PrebuiltSegmentMetadataColumnId,
} from "./prebuilt-segment-contract";

type PrebuiltSegmentMetadataValueMap = {
  pass_name?: string | null;
  pass_validity_start_date?: string | null;
  last_visit_date?: string | null;
  offer_expiry_date?: string | null;
  status_id?: ActiveTrialStatusId | null;
  date_joined?: string | null;
  last_purchase_date?: string | null;
  current_lifecycle_state_id?: CustomerLifecycleStateId | null;
};

type PrebuiltSegmentTableRow = {
  id: string;
  name: string;
  email: string;
  photo?: string;
  values: PrebuiltSegmentMetadataValueMap;
};

type TableColumn = GenericTableColumn<PrebuiltSegmentTableRow>;

type MetadataColumnConfig = {
  translationKey:
    | "prebuilt.columns.passName"
    | "prebuilt.columns.passValidityStartDate"
    | "prebuilt.columns.lastVisitDate"
    | "prebuilt.columns.offerExpiryDate"
    | "prebuilt.columns.status"
    | "prebuilt.columns.dateJoined"
    | "prebuilt.columns.lastPurchaseDate"
    | "prebuilt.columns.currentLifecycleState";
  render: (value: unknown) => React.ReactNode;
};

const ACTIVE_TRIAL_STATUS_LABEL_KEY = {
  attended: "prebuilt.enums.activeTrialStatus.attended",
  booked: "prebuilt.enums.activeTrialStatus.booked",
  purchased: "prebuilt.enums.activeTrialStatus.purchased",
} as const satisfies Record<ActiveTrialStatus, string>;

const CUSTOMER_LIFECYCLE_STATE_LABEL_KEY = {
  archived: "prebuilt.enums.customerLifecycleState.archived",
  lead: "prebuilt.enums.customerLifecycleState.lead",
  active: "prebuilt.enums.customerLifecycleState.active",
  inactive: "prebuilt.enums.customerLifecycleState.inactive",
  churned: "prebuilt.enums.customerLifecycleState.churned",
} as const satisfies Record<CustomerLifecycleState, string>;

function formatCalendarDate(value: string) {
  return formatDateTime(value, DATETIME_FORMATS.DAY_MONTH_YEAR, {
    locale: i18nInstance.language,
    timeZone: "utc",
  });
}

const EMPTY_CELL = (
  <Body htmlVariant="span" size="md" color="weak">
    —
  </Body>
);

function getMetadataValue(
  values: PrebuiltSegmentMetadataValueMap,
  columnId: PrebuiltSegmentMetadataColumnId,
) {
  switch (columnId) {
    case "pass_name":
      return values.pass_name;
    case "pass_validity_start_date":
      return values.pass_validity_start_date;
    case "last_visit_date":
      return values.last_visit_date;
    case "offer_expiry_date":
      return values.offer_expiry_date;
    case "status":
      return values.status_id;
    case "date_joined":
      return values.date_joined;
    case "last_purchase_date":
      return values.last_purchase_date;
    case "current_lifecycle_state":
      return values.current_lifecycle_state_id;
  }
}

function getActiveTrialStatusFromId(
  value: unknown,
): ActiveTrialStatus | undefined {
  if (
    typeof value !== "number" ||
    !Object.hasOwn(ACTIVE_TRIAL_STATUS_BY_ID, value)
  ) {
    return undefined;
  }

  return ACTIVE_TRIAL_STATUS_BY_ID[value as ActiveTrialStatusId];
}

function getCustomerLifecycleStateFromId(
  value: unknown,
): CustomerLifecycleState | undefined {
  if (
    typeof value !== "number" ||
    !Object.hasOwn(CUSTOMER_LIFECYCLE_STATE_BY_ID, value)
  ) {
    return undefined;
  }

  return CUSTOMER_LIFECYCLE_STATE_BY_ID[value as CustomerLifecycleStateId];
}

export function usePrebuiltSegmentTableRows(
  rows: Array<PrebuiltSegmentDetailRow>,
) {
  return useMemo<Array<PrebuiltSegmentTableRow>>(
    () =>
      rows.map((row) => ({
        id: String(row.member.id),
        name: row.member.name,
        email: row.member.email,
        photo: row.member.photo,
        values: row.values,
      })),
    [rows],
  );
}

export function usePrebuiltSegmentTableColumns(
  prebuiltSegmentId: PrebuiltSegmentId,
  definition: PrebuiltSegmentDefinitionResponse,
) {
  const { t, i18n } = useTranslation("list");

  return useMemo<Array<TableColumn>>(() => {
    const metadataColumnConfigById: Record<
      PrebuiltSegmentMetadataColumnId,
      MetadataColumnConfig
    > = {
      pass_name: {
        translationKey: "prebuilt.columns.passName",
        render: (value) =>
          typeof value === "string" && value.length > 0 ? value : EMPTY_CELL,
      },
      pass_validity_start_date: {
        translationKey: "prebuilt.columns.passValidityStartDate",
        render: (value) =>
          typeof value === "string" ? formatCalendarDate(value) : EMPTY_CELL,
      },
      last_visit_date: {
        translationKey: "prebuilt.columns.lastVisitDate",
        render: (value) =>
          typeof value === "string" ? formatCalendarDate(value) : EMPTY_CELL,
      },
      offer_expiry_date: {
        translationKey: "prebuilt.columns.offerExpiryDate",
        render: (value) =>
          typeof value === "string" ? formatCalendarDate(value) : EMPTY_CELL,
      },
      status: {
        translationKey: "prebuilt.columns.status",
        render: (value) => {
          const status = getActiveTrialStatusFromId(value);

          if (!status) {
            return EMPTY_CELL;
          }

          return (
            <Body htmlVariant="span" size="md">
              {t(ACTIVE_TRIAL_STATUS_LABEL_KEY[status])}
            </Body>
          );
        },
      },
      date_joined: {
        translationKey: "prebuilt.columns.dateJoined",
        render: (value) =>
          typeof value === "string" ? formatCalendarDate(value) : EMPTY_CELL,
      },
      last_purchase_date: {
        translationKey: "prebuilt.columns.lastPurchaseDate",
        render: (value) =>
          typeof value === "string" ? formatCalendarDate(value) : EMPTY_CELL,
      },
      current_lifecycle_state: {
        translationKey: "prebuilt.columns.currentLifecycleState",
        render: (value) => {
          const lifecycleState = getCustomerLifecycleStateFromId(value);

          if (!lifecycleState) {
            return EMPTY_CELL;
          }

          return (
            <Body htmlVariant="span" size="md">
              {t(CUSTOMER_LIFECYCLE_STATE_LABEL_KEY[lifecycleState])}
            </Body>
          );
        },
      },
    };

    const fixedColumns: Array<TableColumn> = [
      {
        header: t("prebuilt.columns.name"),
        id: `${prebuiltSegmentId}-name`,
        type: "custom",
        align: "start",
        render: (row) => (
          <div className="flex flex-row items-center gap-sm">
            <MemberAvatar name={row.name} photo={row.photo} />
            {row.name ? (
              <Body htmlVariant="span" size="md">
                {row.name}
              </Body>
            ) : (
              EMPTY_CELL
            )}
          </div>
        ),
      },
      {
        header: t("prebuilt.columns.email"),
        id: `${prebuiltSegmentId}-email`,
        type: "copy",
        keyPath: "email",
        align: "start",
      },
    ];

    const metadataColumns = definition.columns.map<TableColumn>((column) => ({
      header: t(metadataColumnConfigById[column.id].translationKey, {
        defaultValue: column.fallback_label,
      }),
      id: `${prebuiltSegmentId}-${column.id}`,
      type: "custom",
      align: "start",
      render: (row) =>
        metadataColumnConfigById[column.id].render(
          getMetadataValue(row.values, column.id),
        ),
    }));

    return [...fixedColumns, ...metadataColumns];
  }, [definition, prebuiltSegmentId, i18n.language]);
}
