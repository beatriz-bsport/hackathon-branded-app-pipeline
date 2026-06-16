# [TanStack Query] Single fetch function as source of truth between query options and infinite query options

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 2
Level: 🟢 Best practice
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:45 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** `fetchXxxQueryOptions` and `fetchXxxInfiniteQueryOptions` both call the same `fetchXxxAPI` function. There is exactly one fetcher per endpoint.

# How

Write `fetchXxxAPI` once. Both option builders import it. The only difference between them is how they shape pagination (`queryFn: () => fetchXxxAPI(...)` vs `queryFn: ({ pageParam }) => fetchXxxAPI(..., page: pageParam)`).

<aside>
❌

Bad

```tsx
const fetchContractsAPI = (fetch, params) => fetch(...);
const fetchContractsForInfiniteAPI = (fetch, params, page) => fetch(...);
// Two fetchers — when the endpoint URL changes, you must remember both.
```

</aside>

<aside>
✅

Good

```tsx
const fetchContractsAPI = (
  fetch: Fetch<PaginatedResponse<Contract>>,
  params: FetchContractsParams,
) => fetch(...);

export const fetchContractsQueryOptions = (fetch, params) =>
  queryOptions({
    queryKey: contractKeys.list(params),
    queryFn: () => fetchContractsAPI(fetch, params),
  });

export const fetchContractsInfiniteQueryOptions = (fetch, params) =>
  infiniteQueryOptions({
    queryKey: contractKeys.infiniteList(params),
    queryFn: ({ pageParam }) =>
      fetchContractsAPI(fetch, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
  });
```

</aside>

# Why

Two fetchers for the same endpoint guarantee they will drift. Headers, error mapping, URL changes — anything done in one will eventually be forgotten in the other.

# Links

[4. Query options builders](https://app.notion.com/p/4-Query-options-builders-36f137e4c640802aad15df56c1a7618f?pvs=21)
