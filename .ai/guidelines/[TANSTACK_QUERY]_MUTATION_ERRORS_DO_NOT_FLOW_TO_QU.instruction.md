# [TanStack Query] Mutation errors do not flow to QueryBoundary — surface them via toast (or inline UI)

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 3
Level: 🟠 Warning
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 3:11 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** `QueryBoundary` only catches errors thrown by suspending queries. Mutation errors must be handled explicitly at the call site.

# How

Every `useMutation` has an `onError` callback (or you read `error` from the return). Connect it to your toast utility. For form mutations, surface the error inline next to the form.

<aside>
❌

Bad

```tsx
const { mutate } = useMutation(archiveContractMutationOptions(fetch));

return (
  <QueryBoundary fallback={<Spinner />}>
    <button onClick={() => mutate(params)}>Archive</button>
  </QueryBoundary>
);
// Mutation fails silently. User clicks again, nothing changes,
// no feedback reaches the UI. QueryBoundary doesn't catch it.
```

</aside>

<aside>
✅

Good

```tsx
const { mutate, isPending } = useMutation({
  ...archiveContractMutationOptions(fetch),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    toast.success("Contract archived");
  },
  onError: (e) => toast.error(getErrorMessage(e)),
});

return (
  <button onClick={() => mutate(params)} disabled={isPending}>
    Archive
  </button>
);
```

</aside>

# Why

Mutations don't suspend, so their errors don't reach Suspense / Error Boundaries. A silent mutation failure is one of the worst UX bugs — users click and nothing happens.

# Links

[5. Mutation options builders](https://app.notion.com/p/5-Mutation-options-builders-36f137e4c6408030b0a3d37ff7c032db?pvs=21)

[7. Suspense vs traditional queries](https://app.notion.com/p/7-Suspense-vs-traditional-queries-36f137e4c6408084894cf77d4f25c690?pvs=21)
