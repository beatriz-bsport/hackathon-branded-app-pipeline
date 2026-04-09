import { FC, useMemo } from "react";

import {
  type ActivePartnershipAccount,
  type PartnershipOffer,
} from "@bsport/api-book";
import { useFormContext } from "@bsport/form";
import {
  type GenericTableColumn,
  Table,
  TextField,
  Toggle,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SessionFormData } from "../schemas";

type PartnershipOfferRow = PartnershipOffer & {
  id: string;
  formIndex: number;
};

export const SessionPartnershipOffersTable: FC<{
  activeAccounts: ActivePartnershipAccount[] | undefined;
  fieldIdPrefix: string;
}> = ({ activeAccounts, fieldIdPrefix }) => {
  const { t } = useTranslation(["common", "sessionCreation"]);
  const { watch, setValue } = useFormContext<SessionFormData>();

  const partnershipOffers = watch("partnership_offers");

  const rows: PartnershipOfferRow[] = useMemo(
    () =>
      (activeAccounts ?? []).map((account) => {
        const formIndex = partnershipOffers.findIndex(
          (po) => po.partnership === account.partnership,
        );
        const offer = partnershipOffers[formIndex];
        return {
          id: account.id,
          partnership: account.partnership,
          partnership_identifier: account.partnership_identifier,
          allowed_on_partner: offer?.allowed_on_partner ?? true,
          spot_limit: offer?.spot_limit ?? 0,
          formIndex,
        };
      }),
    [activeAccounts, partnershipOffers],
  );

  const columns: GenericTableColumn<PartnershipOfferRow>[] = useMemo(
    () => [
      {
        id: "allowed_on_partner",
        header: (
          <span className="inline-block ml-[2.5rem]">
            {t(
              "addSessionModal.steps.configureSession.settings.partnership.perPartner.table.columns.partner",
              { ns: "sessionCreation" },
            )}
          </span>
        ),
        type: "custom",
        render: (row: PartnershipOfferRow) => (
          <Toggle
            checked={row.allowed_on_partner}
            direction="start"
            id={`${fieldIdPrefix}-partnership-toggle-${row.partnership}`}
            label={t(`aggregators.name.${row.partnership_identifier}`, {
              ns: "common",
            })}
            onToggleChange={(value) => {
              const updated = [...partnershipOffers];
              if (updated[row.formIndex]) {
                updated[row.formIndex] = {
                  ...updated[row.formIndex],
                  allowed_on_partner: value,
                };
              }
              setValue("partnership_offers", updated, { shouldDirty: true });
            }}
          />
        ),
      },
      {
        id: "spots",
        header: t(
          "addSessionModal.steps.configureSession.settings.partnership.perPartner.table.columns.spots",
          { ns: "sessionCreation" },
        ),
        type: "custom",
        render: (row: PartnershipOfferRow) => (
          <TextField
            disabled={!row.allowed_on_partner}
            id={`${fieldIdPrefix}-partnership-spots-${row.partnership}`}
            label=""
            type="number"
            value={String(row.spot_limit ?? 0)}
            onChange={(e) => {
              const numValue = parseInt(e.target.value, 10);
              const updated = [...partnershipOffers];
              if (updated[row.formIndex]) {
                updated[row.formIndex] = {
                  ...updated[row.formIndex],
                  spot_limit: isNaN(numValue) ? 0 : Math.max(0, numValue),
                };
              }
              setValue("partnership_offers", updated, { shouldDirty: true });
            }}
          />
        ),
      },
    ],
    [partnershipOffers, t, fieldIdPrefix, setValue],
  );

  return (
    <div className="mt-md">
      <Table
        className="border border-solid border-stroke-thin border-stroke-default rounded-md overflow-hidden text-body-md"
        columns={columns}
        rows={rows}
        rowHeight="sm"
        withHorizontalDivider
        emptyStateProps={{ isEmpty: rows.length === 0 }}
      />
    </div>
  );
};
