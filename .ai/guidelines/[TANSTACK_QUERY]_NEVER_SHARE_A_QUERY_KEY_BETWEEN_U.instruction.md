# [TanStack Query] Never share a query key between useQuery and useInfiniteQuery

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 5
Level: 🔴 Blocking
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:37 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** A query key identifies one cache entry with one data shape. `useQuery` and `useInfiniteQuery` store different shapes and must never collide.

# How

Always use `infiniteList(params)` for infinite consumers and `list(params)` for paginated consumers. Never reuse one for the other.

<aside>
❌

Bad

```tsx
// In one component:
useQuery({
  queryKey: contractKeys.list(params), // stores PaginatedResponse<Contract>
  queryFn: () => fetchContractsAPI(fetch, params),
});

// In another component:
useInfiniteQuery({
  queryKey: contractKeys.list(params), // 💥 same key, different shape
  // ...
});
// Type errors and runtime cache corruption.
```

</aside>

<aside>
✅

Good

```tsx
useQuery(fetchContractsQueryOptions(fetch, params));
//        └─ uses contractKeys.list(params)

useInfiniteQuery(fetchContractsInfiniteQueryOptions(fetch, params));
//                 └─ uses contractKeys.infiniteList(params)
```

</aside>

# Why

`useQuery` stores `PaginatedResponse<T>`; `useInfiniteQuery` stores `InfiniteData<PaginatedResponse<T>>`. Sharing a key collides the types and breaks the cache at runtime. TanStack keeps them separate on purpose — our `infiniteList` suffix enforces it.

# Links

[3. Query keys: the factory pattern](https://app.notion.com/p/3-Query-keys-the-factory-pattern-36f137e4c6408027b770ca10b258c84e?pvs=21)
