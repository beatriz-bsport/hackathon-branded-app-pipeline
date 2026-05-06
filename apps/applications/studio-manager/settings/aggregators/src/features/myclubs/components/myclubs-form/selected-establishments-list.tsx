import { type FC, useMemo } from "react";

import { type Establishment } from "@bsport/api-core";
import { Body, Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type Props = {
  selectedIds: number[];
  establishments: Establishment[];
  onRemove: (id: number) => void;
};

type Group = {
  address: string;
  establishments: Establishment[];
};

const groupByAddress = (
  establishments: Establishment[],
  selectedIds: number[],
): Group[] => {
  const selectedIdSet = new Set(selectedIds);
  const selected = establishments.filter((e) => selectedIdSet.has(e.id));
  const map = new Map<string, Establishment[]>();

  for (const establishment of selected) {
    const address = establishment.location.address;
    const existing = map.get(address);
    if (existing) {
      existing.push(establishment);
    } else {
      map.set(address, [establishment]);
    }
  }

  return Array.from(map.entries()).map(([address, list]) => ({
    address,
    establishments: list,
  }));
};

export const SelectedEstablishmentsList: FC<Props> = ({
  selectedIds,
  establishments,
  onRemove,
}) => {
  const { t } = useTranslation("common");
  const groups = useMemo(
    () => groupByAddress(establishments, selectedIds),
    [establishments, selectedIds],
  );

  if (!groups.length) return null;

  return (
    <div className="flex flex-col gap-sm">
      {groups.map((group) => (
        <div key={group.address} className="flex flex-col gap-xs">
          <Body size="sm" color="weak" weight="strong">
            {group.address}
          </Body>
          <div className="flex flex-col gap-xs">
            {group.establishments.map((establishment) => (
              <div
                key={establishment.id}
                className="flex items-center justify-between gap-sm"
              >
                <Body size="md">{establishment.title}</Body>
                <Button
                  iconLeft="x-close"
                  intent="flat"
                  color="default"
                  size="sm"
                  label=""
                  aria-label={t("myclubs.form.actions.removeEstablishment", {
                    title: establishment.title,
                  })}
                  onClick={() => onRemove(establishment.id)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
