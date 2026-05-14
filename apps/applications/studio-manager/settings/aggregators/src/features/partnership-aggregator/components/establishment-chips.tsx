import type { FC } from "react";

import {
  Avatar,
  Body,
  Button,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";

import type { AccountRow } from "#src/features/partnership-aggregator/adapters/account-row";
import type { AggregatorNamespace } from "#src/features/partnership-aggregator/types";
import { type TFunction, useTranslation } from "#src/utils/i18n";

const COPY_ID_KEYS = {
  myclubs: "myclubs.table.actions.copyId",
  wellhub: "wellhub.table.actions.copyId",
  usc: "usc.table.actions.copyId",
} as const satisfies Record<AggregatorNamespace, Parameters<TFunction>[0]>;

type EstablishmentChipsProps = {
  establishments: AccountRow["establishments"];
  namespace: AggregatorNamespace;
  readOnly?: boolean;
};

const getInitials = (title: string): string =>
  title
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

export const EstablishmentChips: FC<EstablishmentChipsProps> = ({
  establishments,
  namespace,
  readOnly = false,
}) => {
  const { t } = useTranslation("common");
  const { copyToClipboard } = useCopyToClipboard();

  if (establishments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-xs">
      {establishments.map((establishment) => {
        const establishmentId = String(establishment.id);
        const renderedId = `ID: ${establishmentId}`;

        return (
          <div
            key={establishmentId}
            className="inline-flex max-w-full items-center gap-sm rounded-lg px-sm py-xs"
            style={{
              opacity: establishment.disabled ? 0.5 : 1,
              pointerEvents: establishment.disabled ? "none" : "auto",
            }}
          >
            <Avatar
              alt={establishment.title}
              className="shrink-0"
              initials={getInitials(establishment.title)}
              shape="round"
              size="sm"
              src={establishment.cover ?? undefined}
            />
            <div className="min-w-0">
              <Body
                color="default"
                htmlVariant="span"
                size="sm"
                weight="strong"
                className="block truncate"
              >
                {establishment.title}
              </Body>
              <Body
                color="weak"
                htmlVariant="span"
                size="sm"
                className="block truncate"
              >
                {renderedId}
              </Body>
            </div>
            {(!readOnly || !establishment.disabled) && (
              <Button
                kind="icon-button"
                icon="copy-07"
                label={t(COPY_ID_KEYS[namespace])}
                intent="flat"
                size="md"
                color="default"
                onClick={() => {
                  if (establishment.disabled) return;
                  copyToClipboard(establishmentId);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
