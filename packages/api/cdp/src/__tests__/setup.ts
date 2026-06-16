import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { makeInboxHandlers, makeInboxMessagesHandlers } from "#src/inbox/mocks";

// The messages handler must come first: the conversation list pattern
// (`*/inbox_conversation*`) also matches the messages sub-resource URL, and MSW
// resolves the first matching handler.
export const server = setupServer(
  ...makeInboxMessagesHandlers({ delayMs: 0 }),
  ...makeInboxHandlers({ delayMs: 0 }),
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
