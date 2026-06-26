import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  inboxKeys,
  markConversationAsUnreadMutationOptions,
} from "@bsport/api-cdp/inbox";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export function useMarkConversationAsUnreadMutation(conversationId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("thread-list");

  return useMutation({
    ...markConversationAsUnreadMutationOptions(fetch, conversationId),
    onSuccess: () => {
      // Invalidate to refetch filtered lists (e.g., unread-only)
      // Return the promise so the mutation stays pending until refetch completes
      return queryClient.invalidateQueries({
        queryKey: inboxKeys.infiniteLists(),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        title: t("threadListItem.markAsUnreadError"),
        buttonIcon: "x-close",
      });
    },
  });
}
