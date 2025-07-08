# `@bsport/http-exception` - HTTP Exception Class

This package provides a TypeScript class that extends the default Error class to provide additional HTTP-specific data with type-safe error code handling.

## Installation

1. Add to your application dependencies in `package.json` the store package name:

   ```jsonc
   {
     "dependencies": {
       "@bsport/http-exception": "workspace:*",
     },
   }
   ```

2. Run `pnpm i` in your application to finalize the link

## Usage

### Basic Usage

```typescript
import { HTTPException } from "@bsport/http-exception";

// Basic HTTP exception
const error = new HTTPException({
  message: "Resource not found",
  status: 404,
  code: 40400,
});
```

### Generic Type Safety (Recommended)

For better type safety with specific error codes, use the generic version:

```typescript
import { HTTPException } from "@bsport/http-exception";

// Define your specific error codes
type UserErrorCode = 101000 | 101001 | 101002;

// Create type-safe exception
const error = new HTTPException<UserErrorCode>({
  message: "User validation failed",
  status: 400,
  code: 101000, // TypeScript ensures this matches UserErrorCode
});

// The error.code property is now typed as UserErrorCode
if (error.code === 101000) {
  // Handle specific error case
}
```

### Integration with Store Actions

When using with store actions and `createErrorWithContext`:

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

### HTTPException<T>

Generic class that extends Error with HTTP-specific properties.

#### Type Parameters

- `T extends number = number` - The type of error codes (defaults to `number`)

#### Constructor Options

```typescript
interface HTTPExceptionOptions<T> {
  message: string; // Error message
  status: number; // HTTP status code
  code: T; // Application-specific error code
  context?: unknown; // Additional context data
}
```

#### Properties

- `message: string` - The error message
- `status: number` - HTTP status code (e.g., 400, 404, 500)
- `code: T` - Application-specific error code (typed)
- `context?: unknown` - Additional context information

## Best Practices

1. **Use Generic Types**: Always specify error code types for better type safety
2. **Consistent Error Codes**: Define error code types as union types for specific domains
3. **Meaningful Messages**: Provide clear, actionable error messages
4. **Context Data**: Include relevant context to help with debugging
5. **Integration**: Use with `createErrorWithContext` for consistent error handling across stores
