import { type Establishment } from "@bsport/api-core";

export type GroupedEstablishment = {
  title: string;
  options: Array<{ id: string; label: string; disabled?: boolean }>;
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
