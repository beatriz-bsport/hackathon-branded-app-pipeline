# Store package template setup

This package instantiates a store package with adequate dependencies.

## How to use

Create your store package by running the following command:

```sh
pnpm run -w project:create --template=store-package
```

Select `packages/stores` location for your store.

## Todo list and scope definition

[ ] `types.ts` : types of the objects retrieved from the backend -> API Types

- [ ] `store.ts` : zustand store and hook to bind it
- [ ] `actions/store.ts` : actions to interact with the zustand store
- [ ] `actions/index.ts` : actions exported to your applications
- [ ] `api.ts` : API parameters for your actions
- [ ] `selectors.ts` : function to retrieve data from your store

<!-- @indication Replace "GROUP" with your group name (e.g., "Financial Services") and "[MODEL_NAME]" with your model name (e.g., "User") -->

---

# GROUP | Referral store package

This package provides a Zustand store implementation for managing the state related to the Referral entity in an application. It includes types, actions, API interactions, and selectors to facilitate state management.

## Installation

1. Add to your application dependencies in `package.json` the store package name :

   ```jsonc
   {
     "dependencies": {
       "@bsport/store-cdp-referral": "workspace:*",
     },
   }
   ```

2. Run `pnpm i` in your application to finalize the link

## Usage

Here's a basic example of how to use the store in your application:

```tsx
import { useReferralStore, fetchReferralSettingsAction, selectReferralSettings } from '@bsport/store-cdp-referral';
import fetch from "#src/utils/fetch";

const MyComponent = () => {
    // Retrieve data from the store
    const referralSettings = useReferralStore(selectReferralSettings);

    // Inject fetch in the action
    const fetchReferralSettings = useCallback(async () => {
        return fetchReferralSettingsAction(fetch, { ...params});
    }, [... deps])
    ...
};
```

## Files

### types.ts

Defines the TypeScript types for the objects retrieved from the backend API related to the Referral entity.

### store.ts

Implements the Zustand store and provides a hook to bind it to your components.

### actions/store.ts

Contains actions to interact with the Zustand store, such as updating state or triggering side effects. They shall be used inside actions/index.ts

### actions/index.ts

Exports actions that can be used in your applications to interact with the Referral store.

### api.ts

Defines the API parameters and functions used by the actions to fetch or manipulate Referral data.

### selectors.ts

Provides functions to retrieve specific data from the Referral store, making it easier to access nested or derived state.
