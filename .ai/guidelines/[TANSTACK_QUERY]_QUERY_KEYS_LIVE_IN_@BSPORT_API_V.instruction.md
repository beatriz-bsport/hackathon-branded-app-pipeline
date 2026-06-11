# [TanStack Query] Query keys live in @bsport/api-{vertical} packages, not in apps

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 5
Level: 🔴 Blocking
Scope: API, Imports
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 11:23 AM
Author: David Bretaud
Repository: ichizen

> **Rule:** Define every `queryKeys` factory inside the relevant `@bsport/api-*` package, and export them as part of the public surface of the api package. Apps consume them; they never declare their own.

# How

When you add a new endpoint, add its key factory next to the fetch function in the api package. If you're tempted to declare a key inside `apps/<app>/...`, stop and add it to the api package instead. The only exception is app-specific derived/aggregated data that genuinely has no reuse potential. And we don’t like exceptions.

<aside>
❌

Bad

```tsx
// apps/**/contract/**/use-contracts.ts
const contractKeys = {
  all: ["contracts"] as const,
  list: (params) => [...contractKeys.all, params] as const,
};

export const useContractsQuery = (params) =>
  useQuery({
    queryKey: contractKeys.list(params),
    queryFn: () => fetchContracts(params),
  });
```

</aside>

<aside>
✅

Good

```tsx
// In @bsport/api-buyables/contract/api.ts
import { QUERY_KEY_MAIN } from "../constants";

// @api-buyables

export const contractKeys = {
  all: [QUERY_KEY_MAIN, "contracts"] as const,

  lists: () => [...contractKeys.all, "lists"] as const,
  list: (params: FetchContractsParams) =>
    [...contractKeys.lists(), params] as const,
};

// In apps/**/contract/**/use-contracts.ts
export const useContractsQuery = (params: FetchContractsParams) =>
  useQuery(fetchContractsQueryOptions(fetch, params));
```

</aside>

# Why

Keys exported from the api package are the single source of truth for cache identity. When two apps declare their own keys for the same endpoint, invalidations from one app don't reach the other, and you get stale UI for reasons that take hours to debug.

Without exported keys, the app can't write `queryClient.invalidateQueries({ queryKey: contractKeys.lists() })`, which is the most common reason to need them.

# Links

[2. Where code lives (architecture)](https://app.notion.com/p/2-Where-code-lives-architecture-36f137e4c64080ac8e12c88fd1402a01?pvs=21)

[The standard shape](https://app.notion.com/p/The-standard-shape-36f137e4c640801db39bd6555f9bd975?pvs=21)
