# [TanStack Query] App-side hook naming convention: useBlablaQuery / useBlablaMutation

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 4
Level: 🟠 Warning
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:51 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** Hooks that wrap exported options follow `use<Resource><Type>` naming, with the appropriate suffix (`Query`, `Mutation`, or `InfiniteQuery`).

# How

- Single query: `useContractsQuery`, `useContractDetailQuery`
- Infinite query: `useContractsInfiniteQuery`
- Mutation: `useArchiveContractMutation`
- Composition: `useContractsWithStatsQuery` (still ends in `Query` for read-shaped composition)

<aside>
❌

Bad

```tsx
export const useContracts = (params) =>
  useQuery(fetchContractsQueryOptions(fetch, params));

export const archiveContract = () =>
  useMutation(archiveContractMutationOptions(fetch));
```

</aside>

<aside>
✅

Good

```tsx
export const useContractsQuery = (params: FetchContractsParams) =>
  useQuery(fetchContractsQueryOptions(fetch, params));

export const useArchiveContractMutation = () =>
  useMutation(archiveContractMutationOptions(fetch));
```

</aside>

# Why

The suffix is informational in PR review: a reviewer knows from the name alone whether the hook is a read or a write, and whether it can throw under Suspense. It also keeps grep clean, and it’s one of the most classic naming pattern for TanStack query consumers.

# Links

[6. App-side hooks](https://app.notion.com/p/6-App-side-hooks-36f137e4c64080419931d3cfb57249d8?pvs=21)
