# Customer-Data-Platform | EmailTemplate store package

Existing Zustand store package for EmailTemplate data. Use it where consumers still depend on store hooks/actions/selectors. For new API client modules in this area, prefer `packages/api` and TanStack Query.

## Installation

1. Add to your application dependencies in `package.json` the store package name :

   ```jsonc
   {
     "dependencies": {
       "@bsport/store-cdp-email-template": "workspace:*",
     },
   }
   ```

2. Run `pnpm i` in your application to finalize the link

## Usage

Here's a basic example of how to use the store in your application:

```tsx
import { useEmailTemplateStore, fetchAllEmailTemplates, selectFlatEmailTemplates } from '@bsport/store-cdp-email-template';
import fetch from "#src/utils/fetch";

const MyComponent = () => {
    // Retrieve data from the store
    const emailTemplateList = useEmailTemplateStore(selectFlatEmailTemplates);

    // Inject fetch in the action
    const fetchEmailTemplatesList = useCallback(async () => {
        return fetchAllEmailTemplates(fetch, { ...params});
    }, [... deps])
    ...
};
```

## Files

### types.ts

Defines the TypeScript types for the objects retrieved from the backend API related to the [EmailTemplate] entity.

### store.ts

Implements the Zustand store and provides a hook to bind it to your components.

### actions/store.ts

Contains actions to interact with the Zustand store, such as updating state or triggering side effects. They shall be used inside actions/index.ts

### actions/index.ts

Exports actions that can be used in your applications to interact with the [EmailTemplate] store.

### api.ts

Defines the API parameters and functions used by the actions to fetch or manipulate [EmailTemplate] data.

### selectors.ts

Provides functions to retrieve specific data from the [EmailTemplate] store, making it easier to access nested or derived state.
