// Studio-manager inbox conversations. Mounted in bsport-django under the
// `communicate` module (`<slug>/v1/` + `communication/` + the studio_manager
// router): `communicate/v1/communication/studio_manager/conversation`.
export const INBOX_CONVERSATION_API_URL =
  "communicate/v1/communication/studio_manager/conversation";

/**
 * Messages of a single conversation:
 * `communicate/v1/communication/studio_manager/conversation/<id>/communication_sent`.
 * The message contract is still served by the MSW mocks (the backend
 * serializer does not yet expose the source/status fields the thread view
 * needs); only the conversation list is wired to the real backend.
 */
export const inboxMessagesApiUrl = (conversationId: string) =>
  `${INBOX_CONVERSATION_API_URL}/${conversationId}/communication_sent`;
