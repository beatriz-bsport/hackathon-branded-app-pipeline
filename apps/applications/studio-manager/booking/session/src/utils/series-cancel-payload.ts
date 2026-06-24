import type { DeleteGroupSessionPayload } from "@bsport/api-book";

type BuildCancelGroupSessionPayloadParams = {
  notifyIfCancelled: boolean;
};

export const buildCancelGroupSessionPayload = ({
  notifyIfCancelled,
}: BuildCancelGroupSessionPayloadParams): DeleteGroupSessionPayload => ({
  notify_if_cancelled: notifyIfCancelled,
  similar_group_ids: [],
});
