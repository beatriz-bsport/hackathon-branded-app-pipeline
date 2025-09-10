# BUYABLES | Subscription Store Package

A robust, type-safe Zustand store for managing subscription data with normalized state structure and comprehensive CRUD operations.

## Features

- **Normalized State**: Efficient state management with `byId` mapping for O(1) lookups
- **Array & Paginated API Support**: Handles both simple array and paginated API responses
- **Comprehensive CRUD**: Full create, read, update, delete operations
- **Advanced Selectors**: Rich set of selectors for common queries and filtering
- **Utility Functions**: Type guards, validation, filtering, sorting, grouping, and statistics
- **TypeScript First**: Fully typed with comprehensive type safety

## State Structure

```typescript
{
  subscriptions: {
    byId: Record<number, Subscription>      // Normalized by ID for efficient lookups
    flatIds: number[]                       // Maintains insertion order
    fuzzySearchIds: number[]                // Search results order
    count: number                           // Total count from API
    page: number                            // Current page for pagination
  }
}
```

## Installation

1. Add to your application dependencies in `package.json` the store package name :

   ```jsonc
   {
     "dependencies": {
       "@bsport/store-buyables-subscription": "workspace:*",
     },
   }
   ```

2. Run `pnpm i` in your application to finalize the link

## Usage

Here's a basic example of how to use the store in your application:

```tsx
import {
  fetchSubscriptionsAction,
  searchSubscriptionsAction,
  selectAllSubscriptions,
  selectEnabledSubscriptions,
  selectSubscriptionById,
  useSubscriptionStore,
} from "@bsport/store-buyables-subscription";

import fetch from "#src/utils/fetch";

const SubscriptionsList = () => {
  // Retrieve data from the store using selectors
  const allSubscriptions = useSubscriptionStore(selectAllSubscriptions);
  const enabledSubscriptions = useSubscriptionStore(selectEnabledSubscriptions);

  // Get specific subscription by ID
  const subscription = useSubscriptionStore((state) =>
    selectSubscriptionById(state, 123),
  );

  // Fetch all subscriptions (returns array)
  const fetchAllSubscriptions = useCallback(async () => {
    return fetchSubscriptionsAction(fetch);
  }, []);

  // Fetch paginated subscriptions
  const fetchPagedSubscriptions = useCallback(async (page: number) => {
    return fetchSubscriptionsAction(fetch, { page, page_size: 20 });
  }, []);

  // Search subscriptions with filters
  const searchSubscriptions = useCallback(async (query: string) => {
    return searchSubscriptionsAction(fetch, {
      q: query,
      disabled: false,
      page: 1,
      page_size: 10,
    });
  }, []);

  // ... rest of component
};
```

## API Actions

### Data Fetching

- **`fetchSubscriptionsAction(fetch, params?)`** - Fetch subscriptions (array or paginated)
- **`searchSubscriptionsAction(fetch, params)`** - Search with filters and pagination
- **`loadMoreSearchResultsAction(fetch, params)`** - Load additional search results

### Store Management

- **`setSubscriptions(subscriptions)`** - Set complete subscription list
- **`addSubscription(subscription)`** - Add new subscription
- **`updateSubscription(subscription)`** - Update existing subscription
- **`removeSubscription(id)`** - Remove subscription by ID
- **`clearSubscriptions()`** - Clear all subscription data

## Selectors

### Basic Data Access

- **`selectAllSubscriptions`** - Get all subscriptions as array
- **`selectSubscriptionsInOrder`** - Get subscriptions in stored order
- **`selectFuzzySearchedSubscriptions`** - Get search results in order
- **`selectSubscriptionById(id)`** - Get specific subscription by ID
- **`selectSubscriptionsByIds(ids)`** - Get multiple subscriptions by IDs

### Filtered Data

- **`selectEnabledSubscriptions`** - Get only enabled subscriptions
- **`selectDisabledSubscriptions`** - Get only disabled subscriptions
- **`selectManagerOnlySubscriptions`** - Get manager-only subscriptions
- **`selectStaffUsableSubscriptions`** - Get staff-usable subscriptions
- **`selectSubscriptionsByName(query)`** - Search subscriptions by name

### Metadata

- **`selectSubscriptionsCount`** - Get total subscription count
- **`selectSearchPage`** - Get current search page
- **`selectHasSubscriptions`** - Check if store has data
- **`selectSubscriptionStats`** - Get comprehensive statistics

## Utility Functions

### Type Guards & Validation

- **`isSubscriptionEnabled(subscription)`** - Check if subscription is enabled
- **`isValidSubscription(value)`** - Validate subscription object
- **`validateSubscription(subscription)`** - Comprehensive validation with errors

### Data Manipulation

- **`filterEnabledSubscriptions(subscriptions)`** - Filter enabled subscriptions
- **`sortSubscriptionsByName(subscriptions, direction)`** - Sort by name
- **`groupSubscriptionsByStatus(subscriptions)`** - Group by enabled/disabled status
- **`fuzzySearchSubscriptions(subscriptions, query)`** - Fuzzy search with scoring
- **`calculateSubscriptionStats(subscriptions)`** - Calculate statistics

## Files

### types.ts

Defines the TypeScript types for subscription objects retrieved from the backend API. Includes:

- `Subscription` interface with all subscription properties
- `SearchSubscriptionsParams` for search API parameters
- `SubscriptionState` for the normalized store state structure

### store.ts

Implements the Zustand store with normalized state structure and provides:

- `subscriptionStore` - The main Zustand store instance
- `useSubscriptionStore` - React hook for store access
- `SubscriptionState` - TypeScript interface for store state

### actions/store.ts

Contains direct store manipulation actions for state management:

- `setSubscriptions` - Set complete subscription list from API
- `setFuzzySearchedSubscriptions` - Set search results with pagination
- `appendFuzzySearchedSubscriptions` - Append additional search results
- `updateSubscription` - Update existing subscription
- `addSubscription` - Add new subscription
- `removeSubscription` - Remove subscription by ID
- `clearSubscriptions` - Clear all store data

### actions/index.ts

Exports async actions for API integration:

- `fetchSubscriptionsAction` - Fetch subscriptions (array or paginated)
- `searchSubscriptionsAction` - Search with filters and pagination
- `loadMoreSearchResultsAction` - Load additional search results
- Re-exports all store actions for convenience

### api.ts

Defines API functions and parameter builders for subscription endpoints:

- `fetchSubscriptionListAPI()` - Non-paginated subscription list
- `fetchSubscriptionPaginatedListAPI(params)` - Paginated subscription list
- `searchSubscriptionAPI(params)` - Search subscriptions with filters

### selectors.ts

Provides comprehensive selectors for accessing and filtering store data:

- Basic selectors for data access
- Filtered selectors for specific subscription types
- Metadata selectors for counts and statistics
- Utility selectors for grouping and analysis

### utils.ts

Contains utility functions for subscription data manipulation:

- Type guards and validation functions
- Filtering and sorting utilities
- Grouping and statistical analysis
- Search and transformation helpers

## Type Safety

All functions and components are fully typed with TypeScript, providing:

- Compile-time type checking for all operations
- IntelliSense support in IDEs
- Runtime type validation where appropriate
- Comprehensive error handling with typed results
