# `useAsync` hook

A generic React hook to encapsulate the loading, success, and error states around an asynchronous function that returns a [`Result`](https://www.npmjs.com/package/typescript-result).

---

## ✅ Features

- Manages `isLoading`, `error`, and `data` states.
- Automatically handles `Result` objects (from `typescript-result`).
- Strongly typed and works with async functions of any shape.
- Supports optional `onSuccess` and `onFailure` callbacks, with access to original arguments and extra metadata.
- Supports automatic data refetching at specified intervals.

---

## 📦 Installation

Add `@bsport/use-async` to your project dependencies:

```json
{
  "dependencies": {
    "@bsport/use-async": "workspace:*"
  }
}
```

## 🔧 Usage

### 1. Basic usage

```tsx
import { fetchSmthAction } from "@bsport/store-something";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const MyPage = () => {
  const fetchSmth = async (id: string) => {
    return fetchSmthAction(fetch, id);
  };

  const [{ isLoading, error, data }, runFetch] = useAsync({
    asyncFn: fetchSmth,
  });

  useEffect(() => {
    runFetch("user-id-123");
  }, [runFetch]);

  return <>{isLoading ? "Loading..." : JSON.stringify(data)}</>;
};
```

### 2. Using onSuccess and onFailure callbacks

You can provide `onSuccess` and `onFailure` callbacks. These callbacks can use 2 different arguments :

- the data returned by the `asyncFn`, encapsulated in the `value` variable
- the args provided to the `asyncFn`, encapsulated in the `args` variable

```tsx
import { fetchSmth as fetchSmthAction } from "@bsport/store-something";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { toast } from "#src/utils/toast";

const MyPage = () => {
  const fetchPage = async (page: number, perPage: number) => {
    return fetchSmthAction(fetch, { page, perPage });
  };

  const [{ isLoading, error, data }, fetchSmth] = useAsync<typeof fetchPage>({
    asyncFn: fetchPage,
    onSuccess: ({ value, args }) => {
      const [page, perPage] = args;
      console.log(`Fetched page ${page} :`, value);
    },
    onFailure: ({ error, args }) => {
      toast(`Failed to fetch with args ${JSON.stringify(args)}.`, {
        type: "error",
      });
      console.error("Fetch failed:", error);
    },
  });

  useEffect(() => {
    fetchSmth(1, 20);
  }, [fetchSmth]);

  return <>{isLoading ? "Loading..." : JSON.stringify(data)}</>;
};
```

### 3. Using refetchInterval for automatic data refresh

You can provide a `refetchInterval` (in milliseconds) to automatically refetch data at regular intervals:

```tsx
import { fetchUserData } from "@bsport/store-user";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const UserProfile = ({ userId }: { userId: string }) => {
  const [{ isLoading, error, data }, fetchUser] = useAsync({
    asyncFn: (id: string) => fetchUserData(fetch, id),
    refetchInterval: 30000, // Refetch every 30 seconds
    onSuccess: ({ value }) => {
      console.log("User data updated:", value);
    },
  });

  useEffect(() => {
    fetchUser(userId);
  }, [fetchUser, userId]);

  return <>{isLoading ? "Loading..." : JSON.stringify(data)}</>;
};
```

**Note:** The interval automatically clears when the component unmounts or when `refetchInterval` changes. Set `refetchInterval` to `0` or `undefined` to disable automatic refetching.
