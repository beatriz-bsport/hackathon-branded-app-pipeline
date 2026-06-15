import type { ReactNode } from "react";
import { useParams } from "react-router";

import type { Contract } from "@bsport/api-buyables/contract";
import {
  type UseDetailsLayoutReturnType,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import {
  type UseBenefitsQueriesReturnType,
  useBenefitsQueries,
} from "#src/hooks/api/use-benefits-queries";
import { useFetchContract } from "#src/hooks/api/use-fetch-contract";
import { invariant } from "#src/utils/invariant";

import { useContractDetailsHeader } from "./use-contract-details-header";

export const useDetailsConfig = (): {
  detailsLayoutConfig: UseDetailsLayoutReturnType;
  headerConfig: Omit<
    ReturnType<typeof useContractDetailsHeader>,
    "startGroupActionsRaw" | "modals"
  >;
  contract: Contract;
  modals: ReactNode;
  benefitQuery: UseBenefitsQueriesReturnType;
} => {
  const { id: rawId } = useParams();

  const id = rawId && /^\d+$/.test(rawId) ? Number(rawId) : undefined;

  invariant(id);

  const { data: contract } = useFetchContract({ id });

  const benefitQuery = useBenefitsQueries({
    passId: contract.payment_pack,
    appointmentPassId: contract.private_pass,
  });

  const detailsLayoutConfig = useDetailsLayout();

  const {
    startGroupActionsRaw: _,
    modals,
    ...headerConfig
  } = useContractDetailsHeader({
    contract: contract,
    isVisible: !contract.manager_only,
  });

  return {
    detailsLayoutConfig,
    headerConfig,
    contract,
    modals,
    benefitQuery,
  };
};
