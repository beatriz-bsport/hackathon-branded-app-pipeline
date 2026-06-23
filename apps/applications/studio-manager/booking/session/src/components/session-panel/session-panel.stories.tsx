import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MemoryRouter } from "react-router";

import type { CompanyRole } from "@bsport/api-staff-management";
import { DetailsLayout } from "@bsport/kaizen-primitive-core";
import { FeatureFlagsProvider, dataAccessLayer } from "@bsport/sm-backbone";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import {
  SESSION_ID,
  seededSessionPanelClient,
  sessionVariants,
} from "./__fixtures__/session-panel-fixtures";
import { SessionPanel } from "./session-panel";

type Variant = keyof typeof sessionVariants;

const JSON_INIT = {
  status: 200,
  headers: { "Content-Type": "application/json" },
} as const;

const allSessionActions = {
  create: true,
  edit: true,
  delete: true,
  viewNotes: true,
  editNotes: true,
};

const MOCK_USER_ROLE = {
  id: 1,
  object_level_permissions: {
    session: {
      activity: { allowed_actions: allSessionActions },
      workshop: { allowed_actions: allSessionActions },
      privateSlot: { allowed_actions: allSessionActions },
    },
  },
} as unknown as CompanyRole;

// The NotesSection is gated on object-level note permissions sourced from
// `dataAccessLayer.useUserRole`, which reads sm-backbone's auth/role stores —
// stores Storybook has no way to hydrate from outside the bundle. Override the
// read hook directly to return a role granting note permissions; otherwise the
// gate renders the whole section as null.
dataAccessLayer.useUserRole = () => MOCK_USER_ROLE;

const withProviders = (variant: Variant): Decorator =>
  function SessionPanelProviders(Story) {
    // Persist the note in memory so the real CRUD flow works without a backend:
    // `@bsport/fetch` wraps `window.fetch`, so stubbing it lets the offer PATCH
    // (and its invalidate refetch) round-trip instead of 404ing on the dev API.
    const [{ client, state }] = useState(() => {
      const session = sessionVariants[variant];
      return {
        client: seededSessionPanelClient(session),
        state: { ...session },
      };
    });

    useEffect(() => {
      const realFetch = window.fetch;
      const stub = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = (init?.method ?? "GET").toUpperCase();

        if (method === "PATCH" && url.includes("update_internal_note")) {
          const body = JSON.parse(String(init?.body ?? "{}")) as {
            internal_note: string;
          };
          state.internal_note = body.internal_note;
          return new Response(JSON.stringify(state), JSON_INIT);
        }

        if (method === "GET" && url.includes("/offer/")) {
          return new Response(JSON.stringify(state), JSON_INIT);
        }

        return realFetch(input, init);
      }) as typeof window.fetch;
      window.fetch = stub;

      return () => {
        // Only restore if our stub is still installed; a concurrently-mounted
        // story (e.g. autodocs) may have replaced it, and clobbering its stub
        // would break that story's fetch.
        if (window.fetch === stub) window.fetch = realFetch;
      };
    }, [state]);

    return (
      <FeatureFlagsProvider>
        <MemoryRouter initialEntries={[`/${SESSION_ID}`]}>
          <QueryClientProvider client={client}>
            <DetailsLayout withPanel>
              <DetailsLayout.Panel>
                <Story />
              </DetailsLayout.Panel>
            </DetailsLayout>
          </QueryClientProvider>
        </MemoryRouter>
      </FeatureFlagsProvider>
    );
  };

const meta = {
  title: "Session Management/SessionPanel",
  component: SessionPanel,
  parameters: { layout: "fullscreen" },
  args: { sessionId: SESSION_ID },
  decorators: storybookDecorator,
} satisfies Meta<typeof SessionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withProviders("default")],
};

export const Minimal: Story = {
  decorators: [withProviders("minimal")],
};

export const GroupedSeries: Story = {
  decorators: [withProviders("groupedSeries")],
};
