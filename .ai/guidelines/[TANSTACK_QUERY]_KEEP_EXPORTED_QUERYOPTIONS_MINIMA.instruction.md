# [TanStack Query] Keep exported queryOptions minimal — only queryKey and queryFn

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 5
Level: 🔴 Blocking
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:43 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** `fetchXxxQueryOptions` exports `queryKey` + `queryFn`, and nothing else. No `staleTime`, no `retry`, no `select`, no `enabled`, no `placeholderData`.
> 

# How

Strip every option that isn't `queryKey` or `queryFn` from the builder. App-level options are added by the consuming hook.

<aside>
❌

Bad

```tsx
// @bsport/api-buyables/contract/api.ts
export const fetchContractsQueryOptions = (
  fetch: Fetch<Contract[]>,
  params: FetchContractsParams,
) =>
  queryOptions({
    queryKey: contractKeys.list(params),
    queryFn: () => fetchContractsAPI(fetch, params),
    staleTime: 60_000,                  // ← decision belongs to the app
    refetchOnWindowFocus: false,        // ← decision belongs to the app
  });
```

</aside>

<aside>
✅

Good

```tsx
// @bsport/api-buyables/contract/api.ts
export const fetchContractsQueryOptions = (
  fetch: Fetch<Contract[]>,
  params: FetchContractsParams,
) =>
  queryOptions({
    queryKey: contractKeys.list(params),
    queryFn: () => fetchContractsAPI(fetch, params),
  });

// apps/../contract/.../use-contracts-query.ts
export const useContractsQuery = (params: FetchContractsParams) =>
  useQuery({
    ...fetchContractsQueryOptions(fetch, params),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
```

</aside>

# Why

The api package can't know the right `staleTime` for every screen. One screen needs fresh data on every navigation, another can cache for minutes. Defaults in the api package multiply into shadow conventions that drift over time. Keep the package opinion-free; let the app decide.

# Links

[4. Query options builders](https://app.notion.com/p/4-Query-options-builders-36f137e4c640802aad15df56c1a7618f?pvs=21)