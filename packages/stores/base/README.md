# `@bsport/store-base` - Base store package

This package provides the base utilities needed to create a store package, including type-safe error handling utilities.

📚 [Read the docs](https://www.notion.so/bright-shovel-41b/State-management-197137e4c640806db70fdd501ff42af7)

## Installation

Add to your application dependencies in `package.json`:

```jsonc
{
  "dependencies": {
    "@bsport/store-base": "workspace:*",
  },
}
```

## Error Handling Utilities

### `createErrorWithContext<T>`

Creates a type-safe HTTPException with additional context information. This utility is designed to work seamlessly with the generic `HTTPException<T>` class.

#### Basic Usage

```typescript
import { createErrorWithContext } from "@bsport/store-base";

// Basic error with context
const error = createErrorWithContext(originalError, {
  action: "deleteUser",
  userId: "123",
});
```

#### Generic Type Safety (Recommended)

For better type safety with specific error codes:

```typescript
import { createErrorWithContext } from "@bsport/store-base";

// Define your specific error codes
type UserDeletionErrorCode = 101000 | 101001 | 101002;

// Create type-safe error with context
const error = createErrorWithContext<UserDeletionErrorCode>(originalError, {
  action: "deleteUser",
  userId: "123",
  timestamp: Date.now(),
});

// The resulting error.code is now typed as UserDeletionErrorCode
```

#### Store Action Integration

Common pattern for store actions:

```typescript
import { type HTTPException, createErrorWithContext } from "@bsport/store-base";

type SmartlistDeletionErrorCode = 101000 | 101001 | 101002;

export const deleteSmartlistAction: Action<
  GeneralSmartlistParams,
  boolean,
  HTTPException<SmartlistDeletionErrorCode>
> = async (fetch, params) => {
  const [uri, init] = deleteSmartlistAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);

      return true;
    },
    (error) => {
      return createErrorWithContext<SmartlistDeletionErrorCode>(error, {
        message: `Failed to delete smartlist with ID ${params.id}`,
        params,
      });
    },
  );
};
```

## API Reference

### `createErrorWithContext<T>(error, context)`

Creates an HTTPException with additional context information.

#### Type Parameters

- `T extends number = number` - The type of error codes (defaults to `number`)

#### Parameters

- `error: unknown` - The original error to wrap
- `context: Record<string, unknown>` - Additional context data to include

#### Returns

- `HTTPException<T>` - A type-safe HTTPException with the provided context

#### Behavior

- If the original error is already an `HTTPException`, it merges the new context with existing context
- If the original error is a regular `Error`, it creates a new `HTTPException` with status 500
- For other error types, it creates a generic error message

## Best Practices

1. **Use Generic Types**: Always specify error code types for domain-specific operations
2. **Consistent Context**: Include relevant action and resource identifiers in context
3. **Error Propagation**: Use in store actions to maintain type safety throughout the error handling chain
4. **Meaningful Context**: Add context that helps with debugging and error tracking

## Store Binding Utilities

### `bindStore(store)`

Creates a React hook for a Zustand vanilla store with built-in shallow comparison.

```typescript
import { bindStore } from '@bsport/store-base';
import { createStore } from 'zustand/vanilla';

// Create your vanilla store
const myStore = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Bind the store to create a React hook
const useMyStore = bindStore(myStore);

// Use in React components
function MyComponent() {
  // Get entire state
  const state = useMyStore();

  // Or select specific parts
  const count = useMyStore((state) => state.count);
  const increment = useMyStore((state) => state.increment);

  return <button onClick={increment}>Count: {count}</button>;
}
```

## URL Parameter Utilities

### `buildUrlParams(params)`

Converts an object to URL query string parameters.

```typescript
import { type URLParams, buildUrlParams } from "@bsport/store-base";

const params: URLParams = {
  page: 1,
  size: 10,
  tags: ["fitness", "yoga"],
  active: true,
};

const queryString = buildUrlParams(params);
// Returns: "?page=1&size=10&tags=fitness%2Cyoga&active=true"
```

#### Type: `URLParams`

```typescript
type URLParams = Record<string, Primitive | Array<Primitive>>;
// where Primitive = string | number | boolean
```

## Data Utilities

### `buildById(options)`

Builds a normalized object from an array of items with IDs, useful for state management.

```typescript
import { buildById } from "@bsport/store-base";

const existingItems = { 1: { id: 1, name: "Item 1" } };
const newItems = [
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
];

const normalized = buildById({
  initial: existingItems,
  newItems: newItems,
});

// Result: { 1: { id: 1, name: 'Item 1' }, 2: { id: 2, name: 'Item 2' }, 3: { id: 3, name: 'Item 3' } }
```

### `serializeContext(data)`

Safely serializes data for error context, with fallback handling.

```typescript
import { serializeContext } from "@bsport/store-base";

const complexData = { user: { id: 1, settings: { theme: "dark" } } };
const serialized = serializeContext(complexData);
// Returns: '{"user":{"id":1,"settings":{"theme":"dark"}}}'

// Handles circular references gracefully
const circularData = {};
circularData.self = circularData;
const safeSerialized = serializeContext(circularData);
// Returns: "Unable to serialize data"
```

## Type Definitions

The package exports comprehensive TypeScript types for common patterns:

### API Types

```typescript
import type {
  Action,
  Fetch,
  ResponseType,
  Xhr,
  XhrAction,
} from "@bsport/store-base";

// Standard API response structure
type ResponseType<T> = {
  data: T;
  status: number;
  backgroundTaskUuid: string | null;
};

// Fetch function type
type Fetch<T = string> = (
  uri: string,
  init?: RequestInit & { responseType?: "text" | "json" | "buffer" },
) => Promise<ResponseType<T>>;
```

### Response Types

```typescript
import type { PaginatedResponse, SearchResponse } from "@bsport/store-base";

// Paginated API responses
type PaginatedResponse<T> = {
  count: number;
  links: { next: number | null; previous: number | null };
  next_page: number | null;
  page: number;
  results: Array<T>;
};

// Search API responses
type SearchResponse<T> = {
  results: Array<T>;
  count: number;
  next: string | null;
  previous: string | null;
};
```

### State Types

```typescript
import type { DeepPartial, PaginatedState } from "@bsport/store-base";

// Normalized paginated state structure
type PaginatedState<M> = {
  byId: { [key: number]: M };
  count: number;
  ids: number[];
  page: number;
};

// Deep partial utility type
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
```

## Constants

```typescript
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@bsport/store-base";

// DEFAULT_PAGE = 1
// DEFAULT_PAGE_SIZE = 10
```

## Integration with HTTPException

This package works seamlessly with `@bsport/http-exception` to provide end-to-end type safety from API to component.

### Example Flow

**1. Define Error Codes and Action**

First, define your domain-specific error codes and create a store action that throws a typed `HTTPException` on failure.

```typescript
// In your store's constants.ts
export const SM_DELETE_IS_USED_IN_CADENCE = 101000;
export type SmartlistDeletionErrorCode = typeof SM_DELETE_IS_USED_IN_CADENCE | 101001;

// In your store's actions.ts
import { createErrorWithContext, type Action, type HTTPException } from '@bsport/store-base';
import { Result } from 'typescript-result';
import { SM_DELETE_IS_USED_IN_CADENCE, type SmartlistDeletionErrorCode } from './constants';

export const deleteSmartlistAction: Action<
  { id: string },
  boolean,
  HTTPException<SmartlistDeletionErrorCode>
> = async (fetch, params) => {
  const [uri, init] = deleteSmartlistAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);
      return true;
    },
    (error) => {
      // createErrorWithContext wraps the original error with more details
      return createErrorWithContext<SmartlistDeletionErrorCode>(error, {
        message: `Failed to delete smartlist with ID ${params.id}`,
        params,
      });
    },
  );
};
```

**2. Consume in a Component and Handle Typed Errors**

In your UI, use the `useAsync` hook to call the action. The hook returns the state (`isLoading`, `error`) and a trigger function. The `error` object will be the typed `HTTPException`, allowing you to safely check for specific error codes in the `onFailure` callback.

```typescript
// In your DeleteSmartlistModal.tsx
import { useState } from 'react';
import { useAsync } from '@bsport/hooks-use-async';
import {
  deleteSmartlistAction,
  SM_DELETE_IS_USED_IN_CADENCE,
  type SmartlistDeletionErrorCode,
} from '@bsport/store-cdp-smartlist';
import { type HTTPException } from '@bsport/store-base';
import { CadencesModal } from './CadencesModal';

export const DeleteSmartlistModal = ({ smartlist, onClose, onDelete }) => {
  const [showCadencesModal, setShowCadencesModal] = useState(false);

  const [{ isLoading: isDeleting }, triggerDelete] = useAsync({
    asyncFn: deleteSmartlistAction,
    onSuccess: () => {
      onDelete?.();
      onClose();
    },
    onFailure: ({ error }: { error: HTTPException<SmartlistDeletionErrorCode> }) => {
      if (error?.customErrorCodes?.includes(SM_DELETE_IS_USED_IN_CADENCE)) {
        // This specific error means we should show a different modal
        setShowCadencesModal(true);
      } else {
        // For other errors, you might show a toast and close the modal
        onClose();
      }
    },
  });

  const handleDelete = () => {
    triggerDelete({ id: smartlist.id });
  };

  if (showCadencesModal) {
    // When the specific error occurs, render a different modal
    return (
      <CadencesModal
        isOpen
        smartlistId={smartlist.id}
        onClose={() => {
          setShowCadencesModal(false);
          onClose();
        }}
      />
    );
  }

  return (
    <Modal
      open={isOpen}
      title="Delete Smartlist"
      onClose={onClose}
      confirmButton={{
        label: 'Delete',
        onClick: handleDelete,
        disabled: isDeleting,
      }}
      // ... other modal props
    />
  );
};
```
