# Booking | Group Activity store package

This package provides a Zustand store implementation for managing the state related to the Group Activity entity in an application. It includes types, actions, API interactions, and selectors to facilitate state management.

## Installation

1. Add to your application dependencies in `package.json` the store package name :

   ```jsonc
   {
     "dependencies": {
       "@bsport/store-booking-group-activity": "workspace:*",
     },
   }
   ```

2. Run `pnpm i` in your application to finalize the link

## Usage

Here's a basic example of how to use the store in your application:

```tsx
import { useGroupActivityStore, fetchGroupActivitiesAction, selectGroupActivities } from '@bsport/store-package-name';
import fetch from "#src/utils/fetch";

const MyComponent = () => {
    // Retrieve data from the store
    const groupActivities = useGroupActivityStore(selectGroupActivities);

    // Inject fetch in the action
    const fetchGroupActivities = useCallback(async () => {
        return fetchGroupActivitiesAction(fetch, { ...params});
    }, [... deps])
    ...
};
```

## Files

### types.ts

Defines the TypeScript types for the objects retrieved from the backend API related to the Group Activity entity.

### store.ts

Implements the Zustand store and provides a hook to bind it to your components.

### actions/store.ts

Contains actions to interact with the Zustand store, such as updating state or triggering side effects. They shall be used inside actions/index.ts

### actions/index.ts

Exports actions that can be used in your applications to interact with the Group Activity store.

### api.ts

Defines the API parameters and functions used by the actions to fetch or manipulate Group Activity data.

### selectors.ts

Provides functions to retrieve specific data from the Group Activity store, making it easier to access nested or derived state.
