import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateEstablishmentPayload,
  type EstablishmentGroup,
  createEstablishment,
  establishmentGroupKeys,
  establishmentKeys,
  updateEstablishmentGroup,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch, xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type CreateVenueArgs = {
  payload: CreateEstablishmentPayload;
  // When multi-localization is on, the new venue is assigned to this location.
  group?: EstablishmentGroup;
};

export const useCreateVenue = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("venues-list");

  return useMutation({
    mutationFn: async ({ payload, group }: CreateVenueArgs) => {
      const venue = await createEstablishment(xhr, payload);
      // Group assignment runs after the venue is persisted. Failing here must
      // not bubble as a mutation error, otherwise the user retries and a
      // duplicate venue is created.
      let groupAssignmentFailed = false;
      if (group) {
        try {
          await updateEstablishmentGroup(fetch, group.id, {
            name: group.name,
            establishment: [...group.establishment, venue.id],
          });
        } catch {
          groupAssignmentFailed = true;
        }
      }
      return { venue, groupAssignmentFailed };
    },
    onSuccess: ({ groupAssignmentFailed }, { group }) => {
      queryClient.invalidateQueries({ queryKey: establishmentKeys.lists() });
      if (group && !groupAssignmentFailed) {
        queryClient.invalidateQueries({
          queryKey: establishmentGroupKeys.lists(),
        });
      }
      if (groupAssignmentFailed) {
        toast({
          status: "critical",
          description: t("toasts.createPartial"),
        });
        return;
      }
      toast({
        status: "default",
        icon: "check-circle",
        description: t("toasts.create"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({ status: "critical", description: t("toasts.createError") });
    },
  });
};
