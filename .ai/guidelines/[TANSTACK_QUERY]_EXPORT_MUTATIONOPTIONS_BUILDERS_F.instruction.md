# [TanStack Query] Export mutationOptions builders for mutating endpoint

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 2
Level: 🟢 Best practice
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:47 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** Each mutating endpoint exports a `xxxMutationOptions(fetch)` builder following the same shape as `queryOptions`.

# How

Write a `xxxMutationOptions` function that returns `mutationOptions({ mutationFn })`. Like with queries, it owns only the binding between the mutation and its fetcher. Invalidations, optimistic updates, toasts, and navigation happen at the call site.

<aside>
❌

Bad

```tsx
// @bsport/api-buyables/contract/api.ts
export const archiveContractAPI = async (fetch, params) => { ... };

// In the app, callers reach for the raw API function and re-declare mutation logic each time.
const { mutate } = useMutation({
  mutationFn: (params) => archiveContractAPI(fetch, params),
});
```

</aside>

<aside>
✅

Good

```tsx
// @bsport/api-buyables/contract/api.ts
export const archiveContractMutationOptions = (fetch: Fetch<Contract>) =>
  mutationOptions({
    mutationFn: (params: ArchiveContractParams) =>
      archiveContractAPI(fetch, params),
  });

// apps/.../contract/.../use-archive-contract-mutation.ts
export const useArchiveContractMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...archiveContractMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      toast.success("Contract archived");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
};
```

</aside>

# Why

Same reason as queries: one source of truth for the contract between a mutation and its fetcher. Apps decide invalidation and UX.

# Links

[5. Mutation options builders](https://app.notion.com/p/5-Mutation-options-builders-36f137e4c6408030b0a3d37ff7c032db?pvs=21)
