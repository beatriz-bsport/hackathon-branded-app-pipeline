import type {
  PartnershipAccount,
  PartnershipAccountStatus,
} from "@bsport/api-book";

export type AccountRow = {
  id: string;
  externalId: string;
  status: PartnershipAccountStatus;
  establishments: Array<{
    id: number;
    title: string;
    cover: string | null;
    disabled: boolean;
  }>;
};

export const computeStatus = (
  active?: boolean,
  activatedAt?: string,
): PartnershipAccountStatus => {
  if (active === true) {
    return "active";
  }

  if (activatedAt) {
    return "deactivated";
  }

  return "pending";
};

export const toAccountRow = (account: PartnershipAccount): AccountRow => ({
  id: account.id,
  externalId: account.external_id,
  status: computeStatus(account.active, account.activated_at),
  establishments: account.establishments.map((establishment) => ({
    id: establishment.id,
    title: establishment.title,
    cover: establishment.cover,
    disabled: establishment.disabled,
  })),
});
