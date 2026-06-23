import type {
  InboxChannel,
  InboxMessage,
  InboxMessageChannelCode,
  InboxMessageSource,
  RawInboxConversation,
} from "../types";

// Deterministic fixture data — no randomness so stories/tests are stable.
// Pure TS (no msw) so it can also be reused in Node tests.

const FIRST_NAMES = [
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Ava",
  "Lucas",
  "Mia",
  "Hugo",
  "Chloé",
  "Léo",
  "Manon",
  "Gabriel",
  "Jade",
  "Raphaël",
  "Louise",
  "Adam",
];

const LAST_NAMES = [
  "Martin",
  "Bernard",
  "Dubois",
  "Thomas",
  "Robert",
  "Petit",
  "Durand",
  "Leroy",
  "Moreau",
  "Simon",
  "Laurent",
  "Lefebvre",
  "Michel",
  "Garcia",
  "David",
  "Roux",
];

const PREVIEWS = [
  "Hi! Is the 7pm class still available tonight?",
  "Thanks, see you tomorrow 🙌",
  "Can I freeze my membership for a month?",
  "I'd like to cancel my booking for Friday.",
  "Do you have any spots left this weekend?",
  "My payment didn't go through, can you check?",
  "Perfect, I just booked the session!",
  "Is there parking near the studio?",
  "Could you send me the invoice for last month?",
  "I'll be 10 minutes late, is that okay?",
];

// Communication-kind codes mirroring bsport-django (0=email, 1=sms, 2=push,
// 3=in_app). The list cycles through them to exercise every channel icon.
const CHANNEL_CODES: InboxMessageChannelCode[] = [3, 0, 1, 2]; // chat(in_app), email, sms, push

const pick = <T>(arr: T[], index: number): T => arr[index % arr.length];

/**
 * Builds a deterministic list of raw (backend-shaped) inbox conversations,
 * ordered by most recent activity first. Timestamps are derived from a fixed
 * anchor so output is stable across renders.
 */
export const makeInboxConversations = (
  count: number,
): RawInboxConversation[] => {
  // Fixed anchor (not `Date.now()`) to keep fixtures deterministic.
  const anchor = Date.UTC(2026, 4, 5, 9, 0, 0); // 2026-05-05T09:00:00Z

  return Array.from({ length: count }, (_, index) => {
    const firstName = pick(FIRST_NAMES, index);
    const lastName = pick(LAST_NAMES, index * 7 + 3);
    const fullName = `${firstName} ${lastName}`;
    const unread = index % 3 === 0 ? (index % 4) + 1 : 0;
    // Each row is 17 minutes older than the previous one.
    const activityAt = new Date(anchor - index * 17 * 60 * 1000).toISOString();

    return {
      uuid: `conv-${(index + 1).toString().padStart(4, "0")}`,
      participants: [
        {
          name: fullName,
          photo: `https://i.pravatar.cc/96?u=${1000 + index}`,
        },
      ],
      last_message_preview: pick(PREVIEWS, index * 3 + 1),
      last_message_channel: pick(CHANNEL_CODES, index),
      date_created: activityAt,
      last_inbox_activity_at: activityAt,
      studio_unread_count: unread,
      has_unresolved_escalation: index % 7 === 0,
      ai_enabled: index % 2 === 0,
    } satisfies RawInboxConversation;
  });
};

// ~13 pages at the default page size of 20, so the Storybook demo scrolls
// through many pages.
export const mockInboxConversations = makeInboxConversations(253);

// --- Conversation messages -------------------------------------------------

const MESSAGE_BODIES = [
  "Hi! Is the 7pm class still available tonight?",
  "Yes, there are still a few spots left — want me to book you in?",
  "That would be great, thank you!",
  "All set, see you at 7 🙌",
  "Can I freeze my membership for a month?",
  "Of course, I've paused it until the 1st.",
  "Could you send me the invoice for last month?",
  "I'll be 10 minutes late, is that okay?",
  "No problem at all, the coach has been notified.",
  "Thanks for the quick reply!",
];

// HTML body for email messages, exercising the sanitized rich-text path.
const EMAIL_BODY_HTML =
  "<p>Hi,</p><p>Following up on your request — we've added a <strong>new reformer slot</strong> on Tuesday mornings.</p><p>See you soon!</p>";

const EMAIL_TITLES = [
  "Your booking is confirmed",
  "Re: Membership freeze",
  "Your invoice for last month",
  "We saved you a spot",
];

const PUSH_TITLES = [
  "Class starting soon",
  "Don't miss your session",
  "New classes available",
];

// Automated sources sprinkled into the feed, with a display name each.
const AUTOMATED_SOURCES: { source: InboxMessageSource; name: string }[] = [
  { source: "campaign", name: "Summer campaign" },
  { source: "automation", name: "Lead nurturing workflow" },
  { source: "transactional-notification", name: "Booking confirmation" },
  { source: "auto-message", name: "Welcome message" },
  { source: "audience-message", name: "Active members audience" },
  { source: "franchise-campaign", name: "Franchise newsletter" },
];

const MESSAGE_CHANNELS: InboxChannel[] = ["chat", "email", "sms", "push"];

const titleForChannel = (
  channel: InboxChannel,
  index: number,
): string | null => {
  if (channel === "email") return pick(EMAIL_TITLES, index);
  if (channel === "push") return pick(PUSH_TITLES, index);
  return null; // sms / chat are title-less
};

const bodyForChannel = (channel: InboxChannel, index: number): string =>
  channel === "email" ? EMAIL_BODY_HTML : pick(MESSAGE_BODIES, index);

/**
 * Builds a deterministic list of conversation messages ordered oldest → newest
 * (ascending `id`, starting at 1). Mixes inbound/outbound manual messages with
 * automated ones across all four channels. Deterministic (fixed timestamps, no
 * randomness) so stories/tests are stable.
 *
 * Roughly every fourth message is automated; manual messages alternate between
 * `member` (inbound) and `studio` (outbound). A couple of outbound messages are
 * marked `failed` to exercise the failure UI.
 */
export const makeInboxMessages = (count: number): InboxMessage[] => {
  // Fixed anchor (not `Date.now()`) to keep fixtures deterministic.
  const anchor = Date.UTC(2026, 4, 1, 8, 0, 0); // 2026-05-01T08:00:00Z

  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const channel = pick(MESSAGE_CHANNELS, index);
    const isAutomated = index % 4 === 3;
    const automated = pick(AUTOMATED_SOURCES, index);

    return {
      id,
      // Automated messages never go through the live `chat` channel.
      channel: isAutomated && channel === "chat" ? "email" : channel,
      // Automated messages are always outbound; manual ones alternate.
      sender: isAutomated ? "studio" : index % 2 === 0 ? "member" : "studio",
      source: isAutomated ? automated.source : "manual",
      sourceName: isAutomated ? automated.name : null,
      title: titleForChannel(
        isAutomated && channel === "chat" ? "email" : channel,
        index,
      ),
      body: bodyForChannel(
        isAutomated && channel === "chat" ? "email" : channel,
        index,
      ),
      // Each message is 6 minutes newer than the previous one.
      dateCreated: new Date(anchor + index * 6 * 60 * 1000).toISOString(),
      // Fail a couple of outbound messages to exercise the failed state.
      status: index % 13 === 7 ? "failed" : "sent",
    } satisfies InboxMessage;
  });
};

/** Default dataset: 60 messages across a single conversation. */
export const mockInboxMessages = makeInboxMessages(60);

/**
 * Seam id for `mockInboxMessages` — the first unread message. Chosen near the
 * end so the initial window has read context before it and unread after it.
 */
export const MOCK_INBOX_FIRST_UNREAD_ID = 50;
