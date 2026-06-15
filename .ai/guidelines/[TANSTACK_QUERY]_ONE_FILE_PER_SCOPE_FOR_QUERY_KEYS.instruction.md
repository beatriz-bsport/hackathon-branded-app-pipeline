# [TanStack Query] One file per scope for query keys

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 4
Level: 🟠 Warning
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:39 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** Keys for a given scope live in exactly one place — usually `api.ts`, or a dedicated `query-keys.ts` when the scope is large.

# How

Default to defining `xxxKeys` at the top of the scope's `api.ts`. Move it to `query-keys.ts` in the same folder when the factory grows beyond ~12 entries. Never split keys for the same scope across multiple files.

⚠️ What is a scope ? We have domains (buyables, core, booking, …), and inside them, we have API scopes (contracts, contract-pauses, establishments, sessions, …).

<aside>
❌

Bad

```tsx
@bsport/api-buyables/contract/
├── api.ts              // exports contractKeys.list, contractKeys.detail
└── infinite.ts         // exports contractInfiniteKeys.list  ← split scope!
```

</aside>

<aside>
✅

Good

```tsx
@bsport/api-buyables/contract/
├── api.ts              // exports the full contractKeys factory
└── query-options.ts    // imports contractKeys, exports option builders
```

When `contract` has 15+ keys (up to the team/developer to decide):

```tsx
@bsport/api-buyables/contract/
├── query-keys.ts       // exports the full contractKeys factory
├── api.ts              // imports contractKeys, defines fetchers
└── query-options.ts    // imports both, exports option builders
```

</aside>

# Why

A scope's keys form a tree. Splitting the tree across files makes it impossible to read the structure in one place and invites duplicate or conflicting entries.

# Links

[Where the file lives](https://app.notion.com/p/Where-the-file-lives-36f137e4c64080748e2dd29943295e58?pvs=21)
