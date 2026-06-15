# [TanStack Query] Use a query key factory (object of functions returning as const arrays)

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 5
Level: 🔴 Blocking
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:31 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** Every resource scope exports a `xxxKeys` object whose entries are functions returning `as const` arrays.

# How

Define `xxxKeys` at the top of the resource's `api.ts`. Use `as const` on every array so TanStack and TypeScript can narrow types. Functions (not pre-computed arrays) let you accept params.

<aside>
❌

Bad

```tsx
export const CONTRACT_KEY = "contracts";
export const CONTRACT_LIST_KEY = "contracts-list";

useQuery({
  queryKey: [CONTRACT_LIST_KEY, params],
  // ...
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

  details: () => [...contractKeys.all, "detail"] as const,
  detail: (params: { id: number }) =>
    [...contractKeys.details(), params] as const,
};
```

</aside>

# Why

A flat list of strings can't be partially invalidated. The factory pattern gives you a tree, so `invalidateQueries({ queryKey: contractKeys.all })` clears the whole scope, `contractKeys.lists()` clears all list variants, and `contractKeys.list(params)` clears one specific one.

# Links

[Effective React Query Keys (tkdodo)](https://tkdodo.eu/blog/effective-react-query-keys#query-key-factory)

[3. Query keys: the factory pattern](https://app.notion.com/p/3-Query-keys-the-factory-pattern-36f137e4c6408027b770ca10b258c84e?pvs=21)
