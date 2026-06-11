# [TanStack Query] Infinite list keys are children of lists(), not siblings of all

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 3
Level: 🟠 Warning
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 11:35 AM
Author: David Bretaud
Repository: ichizen

> **Rule:** `infiniteLists()` extends `lists()`, not `all`. `infiniteList(params)` extends `infiniteLists()`.

# How

Always nest infinite under the list collection. Don't put them at the same depth as `lists()`.

<aside>
❌

Bad

```tsx
export const contractKeys = {
  all: [QUERY_KEY_MAIN, "contracts"] as const,
  lists: () => [...contractKeys.all, "lists"] as const,
  list: (p) => [...contractKeys.lists(), p] as const,
  infiniteLists: () => [...contractKeys.all, "infinite-lists"] as const, // sibling of `lists` — wrong
  infiniteList: (p) => [...contractKeys.infiniteLists(), p] as const,
};

// Now callers must remember TWO invalidations:
queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
queryClient.invalidateQueries({ queryKey: contractKeys.infiniteLists() });
```

</aside>

<aside>
✅

Good

```tsx
export const contractKeys = {
  all: [QUERY_KEY_MAIN, "contracts"] as const,
  lists: () => [...contractKeys.all, "lists"] as const,
  list: (p) => [...contractKeys.lists(), p] as const,
  infiniteLists: () => [...contractKeys.lists(), "infinite"] as const, // child of `lists`
  infiniteList: (p) => [...contractKeys.infiniteLists(), p] as const,
};

// One invalidation covers paginated AND infinite variants:
queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
```

</aside>

# Why

After a mutation, you want every list variant — paginated and infinite — invalidated. Nesting infinite under `lists()` makes a single `invalidateQueries` call cover both. The sibling layout silently leaves the infinite cache stale half the time, because the caller forgets.

# Links

[3. Query keys: the factory pattern](https://app.notion.com/p/3-Query-keys-the-factory-pattern-36f137e4c6408027b770ca10b258c84e?pvs=21)
