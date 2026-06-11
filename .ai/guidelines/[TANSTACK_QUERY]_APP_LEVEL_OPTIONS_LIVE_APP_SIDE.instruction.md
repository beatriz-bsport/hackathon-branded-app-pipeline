# [TanStack Query] App-level options live app-side (staleTime, enabled, placeholderData, retry)

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 4
Level: 🟠 Warning
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:53 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** Every option that depends on screen behavior — `staleTime`, `gcTime`, `enabled`, `placeholderData`, `refetchOnWindowFocus`, `retry` — is set in the app, not in the api package.

⚠️ One exception: api-platform/background-task ⇒ it has a specific logic that is tight to the API itself. These fields are then defined in the API package because this complex logic is always the same and shouldn’t be implemented in other places.

# How

Override exported options inside the consuming hook via spread:

<aside>
❌

Bad

```tsx
// @bsport/api-buyables/contract/api.ts
export const fetchContractsQueryOptions = (fetch, params) =>
  queryOptions({
    queryKey: contractKeys.list(params),
    queryFn: () => fetchContractsAPI(fetch, params),
    staleTime: 30_000, // app-level decision in the api package
    enabled: Boolean(params.companyId),
  });
```

</aside>

<aside>
✅

Good

```tsx
// apps/.../contract/.../use-contracts-query.ts
import { keepPreviousData } from "@tanstack/react-query";

export const useContractsQuery = (params: FetchContractsParams) =>
  useQuery({
    ...fetchContractsQueryOptions(fetch, params),
    staleTime: 30_000,
    enabled: Boolean(params.companyId),
    placeholderData: keepPreviousData,
  });
```

</aside>

# Why

The same endpoint may be consumed by multiple screens with different needs. A `staleTime` baked into the api package locks every consumer into one trade-off and pushes everyone toward overrides — which then live next to a misleading "default."

# Links

[6. App-side hooks](https://app.notion.com/p/6-App-side-hooks-36f137e4c64080419931d3cfb57249d8?pvs=21)
