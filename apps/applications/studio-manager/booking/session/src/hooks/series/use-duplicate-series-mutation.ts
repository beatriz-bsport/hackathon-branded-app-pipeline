import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Session,
  createGroupSessionsWithOffersMutationOptions,
  groupSessionKeys,
  prepareGroupSessionsCreationMutationOptions,
  sessionKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import type { Series } from "#src/types";
import { fetch } from "#src/utils/fetch";
import { useWaitForBackgroundTask } from "#src/utils/fetch-background-task";
import { useTranslation } from "#src/utils/i18n";
import type { SeriesDuplicateFormData } from "#src/utils/series-duplicate-form";
import { buildPrepareDuplicateGroupSessionsCreationPayload } from "#src/utils/series-duplicate-payload";
import { normalizePreparedGroupSessionsForCreation } from "#src/utils/series-group-session-creation-payload";

type DuplicateSeriesParams = {
  classes: Session[];
  series: Series;
  timeZone: string;
  values: SeriesDuplicateFormData;
};

export const useDuplicateSeriesMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("series");
  const { handleBackgroundTaskError, waitForBackgroundTask } =
    useWaitForBackgroundTask(fetch);
  const { mutateAsync: prepareGroupSessionsCreation } = useMutation(
    prepareGroupSessionsCreationMutationOptions(fetch),
  );
  const { mutateAsync: createGroupSessionsWithOffers } = useMutation(
    createGroupSessionsWithOffersMutationOptions(fetch),
  );

  return useMutation<unknown | null, Error, DuplicateSeriesParams>({
    mutationFn: async ({ classes, series, timeZone, values }) => {
      const preparePayload = buildPrepareDuplicateGroupSessionsCreationPayload({
        classes,
        series,
        timeZone,
        values,
      });

      // Backend calls this preparation step "generate_preview"
      // New UI don't generate or render a preview.
      const preparedGroupSessions =
        await prepareGroupSessionsCreation(preparePayload);
      // The prepared response contains preview-only fields and legacy aliases;
      // normalize it into the final create_groups_with_offers payload shape.
      const createPayload = normalizePreparedGroupSessionsForCreation(
        preparedGroupSessions,
      );
      const backgroundTaskUuid =
        await createGroupSessionsWithOffers(createPayload);

      if (backgroundTaskUuid) {
        // Group creation is asynchronous when a task UUID is returned, so wait
        // before reporting success and refreshing the affected caches.
        return waitForBackgroundTask(backgroundTaskUuid);
      }

      return null;
    },
    onSuccess: async () => {
      // Improvement: redirect to the created series details page after
      // duplication. This needs backend support first because the create API
      // only returns a background task UUID today, not the created group id.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupSessionKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: sessionKeys.all }),
      ]);

      toast({
        status: "default",
        description: t("seriesDuplicateModal.toasts.success"),
        icon: "check",
        buttonIcon: "x-close",
      });
    },
    onError: (error) => {
      handleBackgroundTaskError(error, t("seriesDuplicateModal.errors.create"));
    },
  });
};
