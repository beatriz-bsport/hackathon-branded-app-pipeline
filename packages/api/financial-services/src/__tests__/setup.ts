import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { makeUnpaidInvoiceHandlers } from "#src/invoice/mocks";

export const server = setupServer(...makeUnpaidInvoiceHandlers({ delayMs: 0 }));

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
