import type { Decorator } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
