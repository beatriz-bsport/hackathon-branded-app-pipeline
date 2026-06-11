# [TanStack Query] Two-tier shape for keys using params

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 5
Level: 🔴 Blocking
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:34 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** For any list-like endpoint that can receive params, expose both a collection key (`lists()` / `details()`) and a parameterized key (`list(params)` / `detail(params)`).

# How

The collection key holds no params. The parameterized key extends the collection key with the params. Invalidations almost always target the collection.

<aside>
❌

Bad

```tsx
export const contractKeys = {
  all: [QUERY_KEY_MAIN, "contracts"] as const,
  list: (params) => [...contractKeys.all, "lists", params] as const,
  // No `lists()` — can't invalidate "all list variants" without knowing params
};

// Forced to do this:
queryClient.invalidateQueries({
  queryKey: [QUERY_KEY_MAIN, "contracts", "lists"],
  // Hardcoded — fragile
});
```

</aside>

<aside>
✅

Good

```tsx
export const contractKeys = {
  all: [QUERY_KEY_MAIN, "contracts"] as const,

  lists: () => [...contractKeys.all, "lists"] as const,
  list: (params: FetchContractsParams) =>
    [...contractKeys.lists(), params] as const,
};

// One call covers every list variant, regardless of filters
queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
```

</aside>

# Why

After a create / update / delete, you almost never know which filtered list variants were affected. The collection key invalidates all of them in one call.

# Links

[3. Query keys: the factory pattern](https://app.notion.com/p/3-Query-keys-the-factory-pattern-36f137e4c6408027b770ca10b258c84e?pvs=21)
