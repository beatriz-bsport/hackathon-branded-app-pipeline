import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { makeInboxHandlers } from "#src/inbox/mocks";

export const server = setupServer(...makeInboxHandlers({ delayMs: 0 }));

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
