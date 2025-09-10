import type { SubscriptionState } from "./store";
import { Subscription } from "./types";

// =============================================================================
// BASIC SELECTORS
// =============================================================================

/**
 * Selects all subscriptions from the normalized store.
 */
export const selectAllSubscriptions = (
  state: SubscriptionState,
): Subscription[] => Object.values(state.subscriptions.byId);

/**
 * Selects subscriptions in their flat order as stored.
 */
export const selectSubscriptionsInOrder = (
  state: SubscriptionState,
): Subscription[] => {
  const { flatIds, byId } = state.subscriptions;
  return flatIds.map((id) => byId[id]).filter(Boolean);
};

/**
 * Selects fuzzy search results in order.
 */
export const selectFuzzySearchedSubscriptions = (
  state: SubscriptionState,
): Subscription[] => {
  const { fuzzySearchIds, byId } = state.subscriptions;
  return fuzzySearchIds.map((id) => byId[id]).filter(Boolean);
};

/**
 * Selects the complete subscriptions state structure.
 */
export const selectSubscriptionsMappedById = (state: SubscriptionState) =>
  state.subscriptions;

/**
 * Selects a subscription by ID.
 */
export const selectSubscriptionById = (
  state: SubscriptionState,
  id: number,
): Subscription | undefined => state.subscriptions.byId[id];

/**
 * Selects multiple subscriptions by their IDs.
 */
export const selectSubscriptionsByIds = (
  state: SubscriptionState,
  ids: number[],
): Subscription[] => {
  return ids.map((id) => state.subscriptions.byId[id]).filter(Boolean);
};

// =============================================================================
// METADATA SELECTORS
// =============================================================================

/**
 * Selects the total count of subscriptions.
 */
export const selectSubscriptionsCount = (state: SubscriptionState): number =>
  state.subscriptions.count;

/**
 * Selects the current page number for search results.
 */
export const selectSearchPage = (state: SubscriptionState): number =>
  state.subscriptions.page;

/**
 * Checks if subscriptions store has any data.
 */
export const selectHasSubscriptions = (state: SubscriptionState): boolean =>
  Object.keys(state.subscriptions.byId).length > 0;

/**
 * Checks if there are search results.
 */
export const selectHasSearchResults = (state: SubscriptionState): boolean =>
  state.subscriptions.fuzzySearchIds.length > 0;
