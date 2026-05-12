import { type Establishment } from "@bsport/api-core";

export type GroupedEstablishment = {
  title: string;
  options: Array<{ id: string; label: string; disabled?: boolean }>;
};

export type EstablishmentDisplayGroup = {
  address: string;
  establishments: Establishment[];
};

export const groupEstablishmentsByAddress = (
  establishments: Establishment[],
  disabledIds: Set<number> = new Set(),
): GroupedEstablishment[] => {
  if (!establishments.length) return [];

  const grouped = new Map<string, GroupedEstablishment["options"]>();

  for (const establishment of establishments) {
    const address = establishment.location.address;
    const option = {
      id: establishment.id.toString(),
      label: establishment.title,
      disabled: disabledIds.has(establishment.id),
    };

    const existing = grouped.get(address);
    if (existing) {
      existing.push(option);
    } else {
      grouped.set(address, [option]);
    }
  }

  return Array.from(grouped.entries()).map(([address, options]) => ({
    title: address,
    options,
  }));
};

export const groupEstablishmentsForDisplay = (
  establishments: Establishment[],
  selectedIds: number[],
): EstablishmentDisplayGroup[] => {
  const selectedIdSet = new Set(selectedIds);
  const selected = establishments.filter((e) => selectedIdSet.has(e.id));
  const grouped = new Map<string, Establishment[]>();

  for (const establishment of selected) {
    const address = establishment.location.address;
    const existing = grouped.get(address);
    if (existing) {
      existing.push(establishment);
    } else {
      grouped.set(address, [establishment]);
    }
  }

  return Array.from(grouped.entries()).map(([address, list]) => ({
    address,
    establishments: list,
  }));
};
