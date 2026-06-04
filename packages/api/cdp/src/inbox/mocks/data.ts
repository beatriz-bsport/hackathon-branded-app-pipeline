import type { InboxChannel, InboxConversationListItem } from "../types";

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

const CHANNELS: InboxChannel[] = ["chat", "email", "sms", "push"];

const pick = <T>(arr: T[], index: number): T => arr[index % arr.length];

const initialsOf = (fullName: string): string =>
  fullName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

/**
 * Builds a deterministic list of inbox conversations, ordered by most recent
 * activity first. Timestamps are derived from a fixed anchor so output is
 * stable across renders.
 */
export const makeInboxConversations = (
  count: number,
): InboxConversationListItem[] => {
  // Fixed anchor (not `Date.now()`) to keep fixtures deterministic.
  const anchor = Date.UTC(2026, 4, 5, 9, 0, 0); // 2026-05-05T09:00:00Z

  return Array.from({ length: count }, (_, index) => {
    const firstName = pick(FIRST_NAMES, index);
    const lastName = pick(LAST_NAMES, index * 7 + 3);
    const fullName = `${firstName} ${lastName}`;
    const unread = index % 3 === 0 ? (index % 4) + 1 : 0;

    return {
      id: `conv-${(index + 1).toString().padStart(4, "0")}`,
      participant: {
        memberId: 1000 + index,
        fullName,
        initials: initialsOf(fullName),
      },
      lastMessagePreview: pick(PREVIEWS, index * 3 + 1),
      lastMessageChannel: pick(CHANNELS, index),
      // Each row is 17 minutes older than the previous one.
      dateUpdated: new Date(anchor - index * 17 * 60 * 1000).toISOString(),
      studioUnreadCount: unread,
      favorite: index % 5 === 0,
      muted: index % 11 === 0,
      aiEnabled: index % 2 === 0,
    } satisfies InboxConversationListItem;
  });
};

// ~13 pages at the default page size of 20, so the Storybook demo scrolls
// through many pages.
export const mockInboxConversations = makeInboxConversations(253);
