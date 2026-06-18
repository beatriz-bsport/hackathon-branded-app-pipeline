import type { Decorator } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { setCurrencyCode, setCurrencyDisplay } from "@bsport/currency";

import { AppI18nextProvider } from "#src/utils/i18n";

// One QueryClient per story (keyed by Storybook's stable story id) so a
// connected story's cache never bleeds into another and stays isolated from
// Storybook's global client. Keying by id — rather than a `useState` inside a
// decorator component — keeps this file hook-free and the instance stable
// across the story's re-renders.
const queryClientsByStoryId = new Map<string, QueryClient>();

const getStoryQueryClient = (storyId: string): QueryClient => {
  let queryClient = queryClientsByStoryId.get(storyId);
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    queryClientsByStoryId.set(storyId, queryClient);
  }
  return queryClient;
};

/**
 * Shared decorators applied to every story in this app. The whole inbox is
 * data-driven, so a fresh per-story QueryClient is part of the baseline
 * alongside the i18n provider.
 */
export const storybookDecorator: Decorator[] = [
  // Storybook never runs sm-backbone's `DataLayerWrapper`, which is what seeds
  // the active currency into storage at app startup. Without this seed,
  // `@bsport/currency` silently falls back to its € / eur default. Use
  // "session" storage so it doesn't leak into the developer's real localStorage.
  (Story) => {
    setCurrencyCode("eur", "session");
    setCurrencyDisplay("€", "session");
    return <Story />;
  },
  (Story) => (
    <AppI18nextProvider>
      <Story />
    </AppI18nextProvider>
  ),
  (Story, { id }) => (
    <QueryClientProvider client={getStoryQueryClient(id)}>
      <Story />
    </QueryClientProvider>
  ),
];
