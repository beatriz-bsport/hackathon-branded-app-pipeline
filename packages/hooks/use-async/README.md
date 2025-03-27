# `useAsync` hook

Implement the loading and error state handlers.

## Installation

1. Add `@bsport/use-async` to your project dependencies :

   ```json
   {
     "dependencies": {
       "@bsport/use-async": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import the hook, your action and the fetch instance of your application. You need to provide to the hook an async function and its type, to have right type inference.

   ```tsx
   // Simple example : use the data output from the hook
   import { useAsync } from "@bsport/use-async";
   import { fetchSmth as fetchSmthAction } from "@bsport/store-something";
   import { fetch } from "#src/utils/fetch";

   const MyPage = () => {

     // Define my async function by combining my action and my fetch instance
     const fetchSmthBase = async (arg1: string, arg2: ...) => {
       return fetchSmthAction(fetch, params);
     }

     // Retrieve states and the memoized fn
     const [{ isLoading, error, data }, fetchSmth] =
       useAsync<typeof fetchSmthAction>({
         asyncFn : fetchSmthAction,
     });

     useEffect(() => {
       fetchSmth("arg1", arg2value);
     }, [fetchSmth]);
     ...
   };
   ```

3. If your need to do some specific actions with the returned value (for instance, print a toast), you can provide onSuccess or onFailure callbacks.

   ```tsx
   import { useAsync } from "@bsport/use-async";
   import { fetchSmth as fetchSmthAction } from "@bsport/store-something";
   import { fetch } from "#src/utils/fetch";

   const MyPage = () => {

     // Define my async function by combining my action and my fetch instance
     const fetchPage = async (arg1: string, arg2: ...) => {
       return fetchSmthAction(fetch, params);
     }

     // Retrieve states and the memoized fn
     const [{ isLoading, error, data }, fetchSmth] =
       useAsync<typeof fetchPage>({
         asyncFn : fetchSmthAction,
         onSuccess: ({ results, count }) => console.log(`Get ${count} total items.`),
         onError: (error) => {
          console.error(error);
          toast(...);
         },
     });

     useEffect(() => {
       fetchSmth();
     }, [fetchSmth]);
     ...
   };
   ```
