import { useQueryClient } from "@tanstack/react-query";

import { appointmentPassKeys } from "@bsport/api-buyables/appointment-pass";
import {
  type ContractWithBenefits,
  fetchContractQueryOptions,
} from "@bsport/api-buyables/contract";
import { passKeys } from "@bsport/api-buyables/pass";
import { toast } from "@bsport/kaizen-primitive-core";

import type { ContractFormMethods } from "#src/features/contract-form/types";
import { transformContractIntoFormState } from "#src/features/contract-form/utils";
import { useUpdateRevampedContract } from "#src/hooks/api/use-update-contract";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

/**
 * Define the helpers and handlers for the editor form.
 *
 * The benefit details are loaded via suspense (see `useBenefitsQueries`), so
 * the form is initialized directly from `defaultValues` — no effect-based
 * synchronization is needed here.
 */
export const useEditorForm = ({
  methods,
}: {
  methods: ContractFormMethods;
}) => {
  const { t } = useTranslation("contract-details");
  const queryClient = useQueryClient();

  // ----- Form submit lifecycle -----

  const onSuccess = async (contractWithBenefits: ContractWithBenefits) => {
    const {
      payment_pack_details: pass,
      private_pass_details: appointmentPass,
      ...updatedContract
    } = contractWithBenefits;
    const { id, payment_pack, private_pass } = updatedContract;

    // Invalidate the contract and its associated benefit details so other
    // consumers refetch the latest data.
    await Promise.allSettled([
      queryClient.invalidateQueries({
        queryKey: fetchContractQueryOptions(fetch, { id }).queryKey,
      }),
      payment_pack != null
        ? queryClient.invalidateQueries({
            queryKey: passKeys.detail(payment_pack),
          })
        : Promise.resolve(),
      private_pass != null
        ? queryClient.invalidateQueries({
            queryKey: appointmentPassKeys.detail(private_pass),
          })
        : Promise.resolve(),
    ]);

    methods.reset(
      transformContractIntoFormState({
        contract: updatedContract,
        appointmentPass,
        pass,
      }),
    );
  };

  const onError = () => {
    toast({
      status: "critical",
      icon: "alert-circle",
      title: t("editor.submit.error"),
      buttonIcon: "x-close",
    });
  };

  const { mutateAsync: updateRevampedContract } = useUpdateRevampedContract({
    onSuccess,
    onError,
  });

  return { updateRevampedContract };
};
