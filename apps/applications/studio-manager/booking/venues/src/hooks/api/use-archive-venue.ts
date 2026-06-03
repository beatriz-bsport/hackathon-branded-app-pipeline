import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import {
  deleteEstablishmentMutationOptions,
  establishmentKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { useUnarchiveVenue } from "#src/hooks/api/use-unarchive-venue";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useArchiveVenue = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("venues-list");
  const { mutate: unarchive } = useUnarchiveVenue();
  const navigate = useNavigate();

  return useMutation({
    ...deleteEstablishmentMutationOptions(fetch),
    onSuccess: (_data, venueId) => {
      queryClient.invalidateQueries({ queryKey: establishmentKeys.lists() });
      toast({
        status: "default",
        icon: "archive",
        description: t("toasts.archive"),
        buttonLabel: t("toasts.undo"),
        onButtonClick: () => {
          unarchive(venueId);
          navigate(ABSOLUTE_ROUTES.ACTIVE);
        },
      });
    },
    onError: () => {
      toast({ status: "critical", description: t("toasts.archiveError") });
    },
  });
};
