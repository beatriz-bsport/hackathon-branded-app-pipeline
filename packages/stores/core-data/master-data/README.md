# Core Data | Masterdata store package

Existing Zustand store package for Master data entities. Use it where consumers still depend on store hooks/actions/selectors. For new API client modules in this area, prefer `packages/api` and TanStack Query.

## Installation

1. Add to your application dependencies in `package.json` the store package name :

   ```jsonc
   {
     "dependencies": {
       "@bsport/store-core-data-masterdata": "workspace:*",
     },
   }
   ```

2. Run `pnpm i` in your application to finalize the link

## Usage

Here's a basic example of how to use the store in your application:

```tsx
import {
  fetchSportCategoriesAction,
  selectSportCategories,
  useSportCategoryStore,
} from "@bsport/store-core-data-masterdata";
import fetch from "#src/utils/fetch";

const MyComponent = () => {
    // Retrieve data from the store
    const sportCategories = useSportCategoryStore(selectSportCategories);

    // Inject fetch in the action
    const fetchCategories = useCallback(async () => {
        return fetchSportCategoriesAction(fetch, { ...params});
    }, [... deps])
    ...
};
```

## Files

### types.ts

Defines the TypeScript types for the objects retrieved from the backend API related to the Master data entities.

### store.ts

Implements the Zustand store and provides a hook to bind it to your components.

### actions/store.ts

Contains actions to interact with the Zustand store, such as updating state or triggering side effects. They shall be used inside actions/index.ts

### actions/index.ts

Exports actions that can be used in your applications to interact with the Master data store.

### api.ts

Defines the API parameters and functions used by the actions to fetch or manipulate Master data.

### selectors.ts

Provides functions to retrieve specific data from the Master data store, making it easier to access nested or derived state.
