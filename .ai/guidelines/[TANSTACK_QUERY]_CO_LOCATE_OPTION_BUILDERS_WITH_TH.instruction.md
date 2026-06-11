# [TanStack Query] Co-locate option builders with their fetch function

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 3
Level: 🟠 Warning
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:49 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** `fetchXxxAPI`, `fetchXxxQueryOptions`, `fetchXxxInfiniteQueryOptions`, and `xxxMutationOptions` live in the same file as the keys (default: `api.ts`). Split into `query-options.ts` / `mutation-options.ts` only when the file becomes hard to navigate.

# How

A new endpoint in `api.ts` adds: key entries → fetch function → query options → infinite query options (if applicable) → mutation options. Reading top to bottom should tell the full story of one endpoint.

<aside>
❌

Bad

```tsx
@bsport/api-buyables/contract/
├── keys.ts          // contractKeys
├── api.ts           // only fetchContractsAPI
├── queries.ts       // fetchContractsQueryOptions
├── mutations.ts     // archiveContractMutationOptions
└── infinite.ts      // fetchContractsInfiniteQueryOptions
// Five files for one resource — premature split.
```

</aside>

<aside>
✅

Good

```tsx
// Default
@bsport/api-buyables/contract/
└── api.ts           // keys + fetchers + all option builders

// Once api.ts crosses ~300 lines and has 10+ endpoints
@bsport/api-buyables/contract/
├── query-keys.ts
├── api.ts                  // fetch functions only
├── query-options.ts
└── mutation-options.ts
```

</aside>

# Why

Premature splitting hides the relationship between the key, the fetcher, and the option builder. A reader has to jump between files to understand one endpoint. Keep them together until the file genuinely doesn't fit on a screen.

# Links

[4. Query options builders](https://app.notion.com/p/4-Query-options-builders-36f137e4c640802aad15df56c1a7618f?pvs=21)
