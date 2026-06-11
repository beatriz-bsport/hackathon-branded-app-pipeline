# [TanStack Query] Key factory root: all: [QUERY_KEY_MAIN, "scope"] as const

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 5
Level: 🔴 Blocking
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:33 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** The root of every key factory is `all`, prefixed with the package's `QUERY_KEY_MAIN`, followed by the scope name.

# How

Every key factory must start with `all`. Every other key derives from `all` (directly or transitively). The `QUERY_KEY_MAIN` constant is defined once at the api package level.

<aside>
❌

Bad

```tsx
export const contractKeys = {
  lists: () => ["contracts", "lists"] as const,
  // No `all` root — can't invalidate the whole scope in one call
};
```

</aside>

<aside>
✅

Good

```tsx
// @bsport/api-buyables/constants.ts
export const QUERY_KEY_MAIN = "@api-buyables";

// @bsport/api-buyables/contract/api.ts
export const contractKeys = {
  all: [QUERY_KEY_MAIN, "contracts"] as const,
  lists: () => [...contractKeys.all, "lists"] as const,
  // ...
};
```

</aside>

# Why

The `QUERY_KEY_MAIN` prefix prevents collisions between resources from different api packages. The `all` entry is the only key you can use to nuke an entire scope (e.g., after a logout or a context switch).

# Links

[3. Query keys: the factory pattern](https://app.notion.com/p/3-Query-keys-the-factory-pattern-36f137e4c6408027b770ca10b258c84e?pvs=21)
