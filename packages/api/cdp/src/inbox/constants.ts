// Provisional endpoint — the real backend route does not exist yet. The Inbox
// data model is still a proposal (see Notion "Inbox & communications data
// model"); the MSW mocks define the contract for the prototype.
export const INBOX_CONVERSATION_API_URL =
  "customer-data-platform/v1/inbox_conversation";

/**
 * Messages of a single conversation. Provisional CDP-style path matching
 * `INBOX_CONVERSATION_API_URL` — the real backend route
 * (`/communication/studio_manager/conversation/<id>/communication_sent/`) does
 * not exist yet; the MSW mocks define the contract for the prototype.
 */
export const inboxMessagesApiUrl = (conversationId: string) =>
  `${INBOX_CONVERSATION_API_URL}/${conversationId}/communication_sent`;
