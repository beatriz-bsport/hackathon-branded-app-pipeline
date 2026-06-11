# [TanStack Query] Don't spread params in query keys

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 4
Level: 🟠 Warning
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 11:39 AM
Author: David Bretaud
Repository: ichizen

> **Rule:** Pass the params object as a single trailing element of the key, not as spread values.

# How

TanStack hashes keys deterministically, including nested objects. Spreading destroys field names and creates ordering bugs.

<aside>
❌

Bad

```tsx
list: (params: FetchContractsParams) =>
  [...contractKeys.lists(), ...Object.values(params)] as const,
// Reorders silently if Object.values changes order;
// loses information about which value is which field.
```

</aside>

<aside>
✅

Good

```tsx
list: (params: FetchContractsParams) =>
  [...contractKeys.lists(), params] as const,
// TanStack hashes the object deterministically.
```

</aside>

# Why

TanStack's [deterministic hashing](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys#query-keys-are-hashed-deterministically) already handles object equality correctly, including key order. Spreading is extra work that breaks more often than it helps.

# Links

[Query Keys are hashed deterministically (TanStack docs)](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys#query-keys-are-hashed-deterministically)

[3. Query keys: the factory pattern](https://app.notion.com/p/3-Query-keys-the-factory-pattern-36f137e4c6408027b770ca10b258c84e?pvs=21)
