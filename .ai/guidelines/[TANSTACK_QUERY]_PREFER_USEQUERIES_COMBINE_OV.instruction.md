# [TanStack Query] Prefer useQueries({ combine }) over manually aggregating query results

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 4
Level: 🟠 Warning
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 3:13 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** When a view depends on two or more queries that can be run in parallel, compose them with `useQueries({ combine })`. Do not assemble the result in component code.

# How

Pass an array of `queryOptions` builders to `useQueries`, and use the `combine` option to derive the shape the component actually consumes. Return both the derived `data` and an `isPending` (or other) flag.

Make sure to use a module-scope combine function with a stable reference.

<aside>
❌

Bad

```tsx
const consumer = useQuery(fetchConsumerQueryOptions(fetch, { id }));
const passes = useQuery(fetchConsumerPassesQueryOptions(fetch, { id }));

const merged = useMemo(
  () =>
    consumer.data && passes.data
      ? { consumer: consumer.data, passes: passes.data }
      : undefined,
  [consumer.data, passes.data],
);
// Manual aggregation. Re-derives on every render of either query.
// Encourages useEffect creep when more dependencies arrive.
```

</aside>

<aside>
✅

Good

```tsx
// module-scope combine function
const combineConsumerAndPasses = ([consumer, passes]) => ({
  data:
    consumer.data && passes.data
      ? { consumer: consumer.data, passes: passes.data }
      : undefined,
  isPending: consumer.isPending || passes.isPending,
});

const { data, isPending } = useQueries({
  queries: [
    fetchConsumerQueryOptions(fetch, { id }),
    fetchConsumerPassesQueryOptions(fetch, { id }),
  ],
  combine: combineConsumerAndPasses,
});
```

</aside>

# Why

`combine` runs inside TanStack and benefits from structural sharing — the merged value keeps the same reference until inputs actually change. Manual merging defeats that and pushes you toward `useEffect` to react to changes, which is a source of races.

💡This does not apply to [dependent queries](https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries), since here the request waterfall can’t be avoided.

# Links

[8. Composing multiple queries](https://app.notion.com/p/8-Composing-multiple-queries-36f137e4c64080a8ad88f33b151f2010?pvs=21)

https://tanstack.com/query/latest/docs/framework/react/guides/parallel-queries

https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries
