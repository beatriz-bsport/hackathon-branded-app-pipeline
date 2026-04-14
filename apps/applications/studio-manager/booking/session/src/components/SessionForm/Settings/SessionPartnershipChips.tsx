import { FC, useMemo } from "react";

import { type ActivePartnershipAccount } from "@bsport/api-book";
import { useFormContext } from "@bsport/form";
import { Chip, Label } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SessionFormData } from "../schemas";

export const SessionPartnershipChips: FC<{
  activeAccounts: ActivePartnershipAccount[] | undefined;
  fieldIdPrefix: string;
}> = ({ activeAccounts, fieldIdPrefix }) => {
  const { t } = useTranslation(["common", "sessionCreation"]);
  const { watch, setValue } = useFormContext<SessionFormData>();

  const partnershipOffers = watch("partnership_offers");

  const offersMap = useMemo(
    () =>
      new Map(
        partnershipOffers.map((po, index) => [po.partnership, { po, index }]),
      ),
    [partnershipOffers],
  );

  const noneSelected = useMemo(
    () =>
      !!activeAccounts?.length &&
      activeAccounts.every((account) => {
        const entry = offersMap.get(account.partnership);
        return (entry?.po.allowed_on_partner ?? true) === false;
      }),
    [activeAccounts, offersMap],
  );

  if (!activeAccounts?.length) return null;

  return (
    <div>
      <Label
        htmlFor={`${fieldIdPrefix}-partnership-chips`}
        label={t(
          "addSessionModal.steps.configureSession.settings.partnership.enabledAggregators.label",
          { ns: "sessionCreation" },
        )}
      />
      <div className="flex flex-wrap gap-xs mt-sm">
        {activeAccounts.map((account) => {
          const entry = offersMap.get(account.partnership);
          const isAllowed = entry?.po.allowed_on_partner ?? true;

          return (
            <button
              key={account.id}
              type="button"
              className="cursor-pointer"
              onClick={() => {
                const updated = [...partnershipOffers];
                if (entry !== undefined) {
                  updated[entry.index] = {
                    ...updated[entry.index],
                    allowed_on_partner: !isAllowed,
                  };
                }
                setValue("partnership_offers", updated, { shouldDirty: true });
              }}
            >
              <Chip
                id={`${fieldIdPrefix}-partnership-chip-${account.partnership}`}
                label={t(`aggregators.name.${account.partnership_identifier}`, {
                  ns: "common",
                })}
                iconLeft={isAllowed ? "check-circle" : "circle"}
                color={isAllowed ? "main" : "default"}
                className={!isAllowed ? "text-onsurface-weaker" : undefined}
                type="weak"
                rounded="lg"
                size="lg"
              />
            </button>
          );
        })}
      </div>
      {noneSelected && (
        <p className="text-body-sm leading-xs text-onsurface-status-critical-strong mt-xs">
          {t(
            "addSessionModal.steps.configureSession.settings.partnership.enabledAggregators.error",
            { ns: "sessionCreation" },
          )}
        </p>
      )}
    </div>
  );
};
