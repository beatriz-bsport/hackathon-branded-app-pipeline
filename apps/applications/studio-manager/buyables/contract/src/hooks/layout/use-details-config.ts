import { useParams } from "react-router";

import type { Contract } from "@bsport/api-buyables/contract";
import {
  type UseDetailsLayoutReturnType,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { invariant } from "#src/utils/invariant";

import { useFetchContract } from "../api/use-fetch-contract";
import { useContractDetailsHeader } from "./use-contract-details-header";

export const useDetailsConfig = (): {
  detailsLayoutConfig: UseDetailsLayoutReturnType;
  headerConfig: Omit<
    ReturnType<typeof useContractDetailsHeader>,
    "startGroupActionsRaw"
  >;
  contract: Contract;
} => {
  const { id: rawId } = useParams();

  const id = rawId && /^\d+$/.test(rawId) ? Number(rawId) : undefined;

  invariant(id);

  const { data: contract } = useFetchContract({ id });

  const detailsLayoutConfig = useDetailsLayout();

  const { startGroupActionsRaw: _, ...headerConfig } = useContractDetailsHeader(
    {
      contract: contract,
      isVisible: !contract.manager_only,
    },
  );

  return {
    detailsLayoutConfig,
    headerConfig,
    contract,
  };
};
