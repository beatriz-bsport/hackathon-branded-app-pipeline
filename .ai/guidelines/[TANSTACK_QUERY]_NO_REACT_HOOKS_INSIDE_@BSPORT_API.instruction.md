# [TanStack Query] No React hooks inside @bsport/api-\* packages

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 5
Level: 🔴 Blocking
Scope: API, Imports
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 11:33 AM
Author: David Bretaud
Repository: ichizen

> **Rule:** API packages are vanilla TypeScript. No `useQuery`, no `useMutation`, no `useQueries`, no React imports at all.

# How

Anything that starts with `use` belongs in `apps/`. The api package exports keys, fetch functions, and option builders. The app wraps those in hooks.

<aside>
❌

Bad

```tsx
// In @bsport/api-buyables/contract/api.ts
import { useQuery } from "@tanstack/react-query";

export const useContractsQuery = (params) =>
  useQuery(fetchContractsQueryOptions(fetch, params));
```

</aside>

<aside>
✅

Good

```tsx
// In @bsport/api-buyables/contract/api.ts
export const fetchContractsQueryOptions = (
  fetch: Fetch<Contract[]>,
  params: FetchContractsParams,
) =>
  queryOptions({
    queryKey: contractKeys.list(params),
    queryFn: () => fetchContractsAPI(fetch, params),
  });

// In apps/<app>/.../use-contracts-query.ts
export const useContractsQuery = (params: FetchContractsParams) =>
  useQuery(fetchContractsQueryOptions(fetch, params));
```

</aside>

# Why

Keeping api packages React-free lets us reuse them in non-React contexts (workers, tests, scripts), and avoids importing the React tree from a package that shouldn't care about it.

# Links

[2. Where code lives (architecture)](https://app.notion.com/p/2-Where-code-lives-architecture-36f137e4c64080ac8e12c88fd1402a01?pvs=21)
