# :zap: Query params hooks

This package implements hooks that are useful to interact with the URL and store information in it.
These hooks rely on `react-router`.

## :flags: Structure

This folder contains :

- a `base` pkg, containing utils to manage easily search params, that can be used in different hooks.
- one pkg per hook

## :rocket: How to create and use a new hook

### Create

1. Create a new pkg (you can use `pnpm run -w project:create`) in the `query-params` folder. If your pkg is about `XYZ`, you may name your folder `use-xyz` and the pkg `use-xyz-query-params`.

2. Add `@bsport/base-query-params`, `react`, `react-dom` and `react-router` to your dependencies

   ```json
   {
     "dependencies": {
       "@bsport/base-query-params": "workspace:*",
       "react": "^19.0.0",
       "react-dom": "^19.0.0",
       "react-router": "^7.2.0"
     }
   }
   ```

3. Export your hook in `src/index.ts` with a named (not default) export. Implement the core of your hook in a separated file named `useXYZQueryParams.hook.ts`, so that we can easily search it in the IDE.

4. Add a section about this hook in this even README.md file.

### Usage

This use case can be reproduced with any existing hook of the `query-params` folder.

1. In your application where you want to use the hook, add the pkg to your dependencies :

   ```json
   {
     "dependencies": {
       "@bsport/use-xyz-query-params": "workspace:*",
       "react": "^19.0.0",
       "react-dom": "^19.0.0",
       "react-router": "^7.2.0"
     }
   }
   ```

Please note that your application must have `react`, `react-router` and `react-dom` as these deps are not included in the bundle of `@bsport/use-xyz-query-params`.

2. Import utilities from the package

   ```tsx
   import { useXYZQueryParams } from "@bsport/use-xyz-query-params";
   ```

## :computer: Hooks

### `usePaginationQueryParams`

This hook initializes values and handlers required to handle pagination with Kaizen `Table` or `List`.

```tsx
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";
import { List } from "@bsport/kaizen-primitive-core";

const MyPaginatedList = () => {
    const { currentPage, currentPageSize, setPageSettings } = usePaginationQueryParams();

    return (
        <List
            items={[...]}
            paginationProps={{
                currentPage,
                rowsPerPage: currentPageSize,
                onPageSettingsChange : setPageSettings,
                // Other attributes
                totalItems: totalItems,
                showRowsPerPageSelector: true,
            }}
        />
    )
}
```
