---
name: add-insight
description: Add a new Business Insight in saas-legacy and studio-manager. Use when asked to add or extend an Insight page, card, route, or flag.
---

## When to use

- The request mentions adding a new Insight (e.g., "Bookings & Pass Usage", "Community Health", "Schedule Performance").
- The change touches Insights cards, routes, pages, feature flags, or embedded analytics dashboards.

## Process (use these steps in order)

1. Follow the existing Insight patterns (Trial/Schedule/Community/Recurring) for structure and naming.
2. Apply changes in **both** saas-legacy and studio-manager unless the request explicitly says otherwise.

## saas-legacy checklist

- Feature flag: apps/applications/saas-legacy/src/utils/feature-flag/flags.ts
- Routes: apps/applications/saas-legacy/src/pages/insights/constants.ts + apps/applications/saas-legacy/src/pages/insights/Insights.router.tsx
- Page: apps/applications/saas-legacy/src/pages/<insight>/<Insight>.page.tsx
  - Use the Schedule/Community iframe pattern.
  - Gate with `ObjectLevelPermissionProvider` + `FeatureFlags`.
  - Use `Config.REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V1` and `appendSigmaLocale`.
- Insights index card: apps/applications/saas-legacy/src/pages/insights/InsightsIndex.page.tsx
  - Add access booleans and card placement in the correct section.
- i18n: apps/applications/saas-legacy/src/i18n/source/b2b_insights.json
  - `pages.<insight>.title` and card title/description keys.

## studio-manager (sm-insights) checklist

Studio Manager uses a **declarative registry** — there are no per-insight page files.

### 1. Feature flag

`apps/applications/studio-manager/business-insights/insights/src/utils/featureFlags.ts`

### 2. Access requirements

`apps/applications/studio-manager/business-insights/insights/src/utils/insightAccessRequirements.ts`

- Add `InsightId` entry + flag/subscription check in `useInsightFlagValues`.
- Add `upsell` if required (see Community Health pattern).

### 3. Register in the registry (single source of truth)

`apps/applications/studio-manager/business-insights/insights/src/constants.ts`

- Add a `DASHBOARD_TYPES` entry.
- Add a URL constant to `URLS` in `urls.ts`.
- Add an `InsightRegistryItem` entry to `INSIGHT_REGISTRY`:
  ```ts
  {
    id: "<id>",                          // matches InsightId + i18n key
    section: INSIGHT_SECTION.OPERATIONS, // or COMMUNITY_MARKETING / FINANCIAL
    dashboardType: DASHBOARD_TYPES.MY_NEW_INSIGHT,
    link: URLS.MY_NEW_INSIGHT,
    titleKey: "pages.myNewInsight.title",
  }
  ```
  Routes and the list page are generated automatically from this registry — no other file changes needed for routing.

### 4. URL path

`apps/applications/studio-manager/business-insights/insights/src/urls.ts`

### 5. i18n

`apps/applications/studio-manager/business-insights/insights/src/i18n/source/insights.json`

- `items.<id>.title` + `items.<id>.description` (list page card)
- `pages.<id>.title` (detail page breadcrumb/header)

### Architecture notes (current state)

- **No per-page files** — `InsightPage` (`pages/insight-page.tsx`) is the single generic page for all insights.
- The AI summary panel is automatic for all insights — no field or config needed.
- `InsightPage` calls `useInsightGate`, `usePresignedUrl(dashboardType, { enabled: isAllowed })`, and `useAiSummary`.
- `InsightDetailLayout` component **has been deleted** — layout is inlined in `InsightPage`.
- `useAiSummary` is a pure data hook (no JSX). It returns `summaryLayoutProps: { detailsLayoutProps, withPanel, summaryKey, summaryPanelProps }`. The page renders `<AiSummaryPanel>` itself.
- `usePresignedUrl` accepts `{ enabled?: boolean }` to gate the fetch behind the access check.

## Notes

- Keep names consistent across `DASHBOARD_TYPES`, `URLS`, `InsightRegistryItem.id`, and i18n keys.
- Prefer reusing existing component patterns; do not introduce new architecture.
- Avoid unrelated formatting changes.
- Known debt (saas-legacy): existing iframe pages use hardcoded title + error strings. Mirror the pattern for consistency unless explicitly asked to refactor.
