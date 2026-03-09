import { toast } from "@bsport/kaizen-primitive-core";
import {
  fetchConsumerGiftcardAction,
  sendEmailInvitationAction,
} from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const sendEmailInvitationBound = sendEmailInvitationAction.bind(null, fetch);

const fetchConsumerGiftcardBound = fetchConsumerGiftcardAction.bind(
  null,
  fetch,
);

export const useSendEmailInvitation = () => {
  const { t, i18n } = useTranslation("giftcard-details");

  const [{ isLoading: isRevalidating }, fetchConsumerGiftcard] = useAsync<
    typeof fetchConsumerGiftcardBound
  >({
    asyncFn: fetchConsumerGiftcardBound,
  });

  const [{ isLoading }, sendEmailActivation] = useAsync<
    typeof sendEmailInvitationBound
  >({
    asyncFn: sendEmailInvitationBound,
    onSuccess: ({ args }) => {
      toast({
        status: "positive",
        icon: "send-01",
        title: t("purchases.detailDrawer.shareModal.toasts.invitationSent"),
        buttonIcon: "x-close",
      });

      const consumerGiftcardId = args[0]?.consumerGiftcardId;

      if (!consumerGiftcardId) {
        return;
      }

      // Revalidate data
      fetchConsumerGiftcard({ id: consumerGiftcardId });
    },
    onFailure: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t(
          "purchases.detailDrawer.shareModal.toasts.invitationSentFailed",
        ),
        buttonIcon: "x-close",
      });
    },
    dependencies: [fetchConsumerGiftcard, i18n.language],
  });

  return {
    isLoading: isLoading || isRevalidating,
    sendEmailActivation,
  };
};
