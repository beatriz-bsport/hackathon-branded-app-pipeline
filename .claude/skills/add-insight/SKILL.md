---
name: add-insight
description: Add a new Business Insight in saas-legacy and studio-manager. Use when asked to add or extend an Insight page, card, route, or flag.
---

## When to use

- The request mentions adding a new Insight (e.g., “Bookings & Pass Usage”, “Community Health”, “Schedule Performance”).
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

- Feature flag: apps/applications/studio-manager/business-insights/insights/src/utils/featureFlags.ts
- Access requirements: apps/applications/studio-manager/business-insights/insights/src/utils/insightAccessRequirements.ts
  - Add `InsightId` entry + flag subscription in `useInsightFlagValues`.
  - Add `upsell` if required (see Community Health pattern).
- Access hooks (no change expected): apps/applications/studio-manager/business-insights/insights/src/utils/access.ts
  - `useInsightGate`/`useInsightAccess` read from `insightAccessRequirements`.
- Dashboard types + items: apps/applications/studio-manager/business-insights/insights/src/constants.ts
- URL path: apps/applications/studio-manager/business-insights/insights/src/urls.ts
- Route: apps/applications/studio-manager/business-insights/insights/src/Routes.tsx
- Page: apps/applications/studio-manager/business-insights/insights/src/pages/<Insight>Page.tsx
  - Use `InsightDetailLayout` + `DashboardIframe` + `useInsightGate` + `usePresignedUrl`.
- API types: apps/applications/studio-manager/business-insights/insights/src/types/api.ts
- i18n: apps/applications/studio-manager/business-insights/insights/src/i18n/source/insights.json
  - `items.<id>` + `pages.<id>` titles/descriptions.

## Notes

- Keep names consistent across routes, dashboard types, and i18n keys.
- Prefer reusing existing component patterns; do not introduce new architecture.
- Avoid unrelated formatting changes.
- Known debt (saas-legacy): existing iframe pages use hardcoded title + error strings. Mirror the pattern for consistency unless explicitly asked to refactor.
