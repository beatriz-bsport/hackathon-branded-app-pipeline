# Navigation sidebar application

This application contains the business logic for the navigation sidebar.

It is meant to be imported using module federation into other applications.

## Standalone mode

You can run the app in standalone mode for local development using:

```sh
pnpm dev
```

It will run on port `4050` : <http://localhost:4050>.

## Permissions

The Navigation Sidebar handles Routing security with permissions checks.
Based on the user permissions (inherit from its role) and the company enabled features (upsells), it can allow access or not to a specific URL.

### Dual routing compatibility

The permissions need to be checked against both revamped and legacy URLs, which might differ for a same page. _Example_ : Packs are under /payment-pack (legacy) and /studio/pack (revamp).

### Feature checking

Some features are protected (upsells), and may be linked to a specific URL. Please make sure to add any new protected urls to `#src/features/permissions/features.ts` when it is related to an upsell.
