# Frontend Guidelines

This document contains the comprehensive list of frontend development guidelines for the bsport-django project.
You will find the detail for each rule in the folder `.ai/guidelines/`.
To see the source file or update it, please see: [🧑‍⚖️ Frontend guidelines database - For export](https://www.notion.so/bright-shovel-41b/2a2137e4c640805c9072cd3a997fdde7?v=348137e4c640807e865b000c078df986)

| Name                                                                                                       | Level            | Importance | Scope        |
| ---------------------------------------------------------------------------------------------------------- | ---------------- | ---------- | ------------ |
| [TanStack Query] Composition hooks (useQueries, useSuspenseQueries) belong app-side                        | 🔴 Blocking      | 5          | API          |
| [TanStack Query] Keep exported queryOptions minimal — only queryKey and queryFn                            | 🔴 Blocking      | 5          | API          |
| [TanStack Query] Key factory root: all: [QUERY_KEY_MAIN, "scope"] as const                                 | 🔴 Blocking      | 5          | API          |
| [TanStack Query] Never share a query key between useQuery and useInfiniteQuery                             | 🔴 Blocking      | 5          | API          |
| [TanStack Query] No React hooks inside @bsport/api-\* packages                                             | 🔴 Blocking      | 5          | API, Imports |
| [TanStack Query] Query keys live in @bsport/api-{vertical} packages, not in apps                           | 🔴 Blocking      | 5          | API, Imports |
| [TanStack Query] select and combine need a stable reference                                                | 🔴 Blocking      | 5          | API          |
| [TanStack Query] Two-tier shape for keys using params                                                      | 🔴 Blocking      | 5          | API          |
| [TanStack Query] Use a query key factory (object of functions returning as const arrays)                   | 🔴 Blocking      | 5          | API          |
| [TanStack Query] App-level options live app-side (staleTime, enabled, placeholderData, retry               | 🟠 Warning       | 4          | API          |
| [TanStack Query] App-side hook naming convention: useBlablaQuery / useBlablaMutation                       | 🟠 Warning       | 4          | API          |
| [TanStack Query] Don't spread params in query keys                                                         | 🟠 Warning       | 4          | API          |
| [TanStack Query] One file per scope for query keys                                                         | 🟠 Warning       | 4          | API          |
| [TanStack Query] Prefer useQueries({ combine }) over manually aggregating query results                    | 🟠 Warning       | 4          | API          |
| [TanStack Query] Co-locate option builders with their fetch function                                       | 🟠 Warning       | 3          | API          |
| [TanStack Query] Infinite list keys are children of lists(), not siblings of all                           | 🟠 Warning       | 3          | API          |
| [TanStack Query] Mutation errors do not flow to QueryBoundary — surface them via toast (or inline UI)      | 🟠 Warning       | 3          | API          |
| [TanStack Query] Export mutationOptions builders for mutating endpoint                                     | 🟢 Best practice | 2          | API          |
| [TanStack Query] One QueryBoundary per independent data slice — not one per page                           | 🟢 Best practice | 2          | API          |
| [TanStack Query] Single fetch function as source of truth between query options and infinite query options | 🟢 Best practice | 2          | API          |
| File names should be kebab-case                                                                            | 🟠 Warning       | 3          | Naming       |

## Legend

- 🔴 **Blocking** (Importance 5): Critical issues that must be addressed
- 🟠 **Warning** (Importance 3-4): Important guidelines that should be followed
- 🟢 **Best practice** (Importance 1-2): Recommended practices for code quality
