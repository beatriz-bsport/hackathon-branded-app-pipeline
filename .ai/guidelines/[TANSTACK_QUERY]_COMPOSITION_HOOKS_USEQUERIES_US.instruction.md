# [TanStack Query] Composition hooks (useQueries, useSuspenseQueries) belong app-side

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 5
Level: 🔴 Blocking
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:29 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** Cross-endpoint composition is business logic. It never lives in api packages.
> 

# How

Inside api packages, only export single-endpoint primitives (`fetchXxxQueryOptions`). When a view needs two or more endpoints combined, write the `useQueries` call in the app.

<aside>
❌

Bad

```tsx
// @bsport/api-cdp/consumer/api.ts
export const useConsumerWithPassesQuery = (id: number) =>
  useQueries({
    queries: [
      fetchConsumerQueryOptions(fetch, { id }),
      fetchConsumerPassesQueryOptions(fetch, { id }),
    ],
    combine: ([consumer, passes]) => ({ ... }),
  });
```

</aside>

<aside>
✅

Good

```tsx
// apps/cdp/features/consumer/use-consumer-with-passes-query.ts
export const useConsumerWithPassesQuery = (id: number) =>
  useQueries({
    queries: [
      fetchConsumerQueryOptions(fetch, { id }),
      fetchConsumerPassesQueryOptions(fetch, { id }),
    ],
    combine: ([consumer, passes]) => ({
      data: consumer.data && passes.data
        ? { consumer: consumer.data, passes: passes.data }
        : undefined,
      isPending: consumer.isPending || passes.isPending,
    }),
  });
```

</aside>

# Why

"Show consumer + their passes together" is a product decision specific to one screen. Another app may want consumer + bookings, or consumer alone. Keeping composition in the app prevents the api package from accumulating screen-specific aggregations.

# Links

[8. Composing multiple queries](https://app.notion.com/p/8-Composing-multiple-queries-36f137e4c64080a8ad88f33b151f2010?pvs=21)