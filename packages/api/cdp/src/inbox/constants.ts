import type { InboxChannel } from "./types";

// Studio-manager inbox conversations. Mounted in bsport-django under the
// `communicate` module (`<slug>/v1/` + `communication/` + the studio_manager
// router): `communicate/v1/communication/studio_manager/conversation`.
export const INBOX_CONVERSATION_API_URL =
  "communicate/v1/communication/studio_manager/conversation";

/**
 * Maps a UI {@link InboxChannel} to the bsport-django communication-kind wire
 * name used by the `timeline` contract. Every channel matches its UI value
 * except `push`, which the backend names `push_notification`
 * (`COMMUNICATION_KIND_CHOICES`). Used to encode the `channels` filter and to
 * decode `data.channel` on the way back.
 */
export const INBOX_CHANNEL_TO_WIRE_NAME = {
  email: "email",
  sms: "sms",
  push: "push_notification",
  in_app: "in_app",
} as const satisfies Record<InboxChannel, string>;

const WIRE_NAME_TO_INBOX_CHANNEL: Record<string, InboxChannel> = {
  email: "email",
  sms: "sms",
  push_notification: "push",
  in_app: "in_app",
};

/**
 * Decodes a backend communication-kind wire name into a UI {@link InboxChannel}.
 * Returns `null` for `null` or any unknown name, so an unexpected backend
 * channel folds to "no channel" rather than throwing.
 */
export const inboxChannelFromWireName = (
  wire: string | null,
): InboxChannel | null =>
  wire !== null ? (WIRE_NAME_TO_INBOX_CHANNEL[wire] ?? null) : null;

/**
 * Member search over the studio-manager conversation set
 * (`…/conversation/search/?q=`). A dedicated viewset action with fuzzy trigram
 * matching over member name, email, and phone. Distinct from the list endpoint:
 * it uses DRF page-number pagination, not the list's activity cursor.
 */
export const INBOX_CONVERSATION_SEARCH_API_URL = `${INBOX_CONVERSATION_API_URL}/search`;

/**
 * Messages of a single conversation, served as the backend `timeline` envelope:
 * `communicate/v1/communication/studio_manager/conversation/<id>/timeline`.
 */
export const inboxMessagesApiUrl = (conversationId: string) =>
  `${INBOX_CONVERSATION_API_URL}/${conversationId}/timeline`;
