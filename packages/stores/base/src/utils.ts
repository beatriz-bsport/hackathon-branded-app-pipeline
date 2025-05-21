import { HTTPException, type Serializable } from "@bsport/http-exception";

/**
 * A function to verify that the provided value is an error.
 * If not, it creates an error.
 * @param value The object expected to be an error.
 * @returns Either the created error, or the value if it's directly an error
 */
function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";
  try {
    stringified = JSON.stringify(value);
  } catch {
    // Skip
  }

  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`,
  );
  return error;
}

/**
 * Returns an HTTPException augmented with a context.
 * @param error The source HTTPException error, containing endpoint information
 * @param context A Serializable object to add context informations to understand the failure
 * @returns HTTPException
 *
 * @example
 * ```ts
 * const someUsefulParams = { anId, aName, ... };
 * return Result.try(
 *  async () => { ... },
 *  (error) => {
 *    return createErrorWithContext(error, someUsefulParams);
 *  }
 * )
 * ```
 */
export function createErrorWithContext(
  error: HTTPException | unknown,
  context: Serializable,
) {
  if (error !== null && error instanceof Object && "statusCode" in error) {
    const httpException = error as Partial<HTTPException>;
    return new HTTPException({
      path: httpException.path ?? "Unexpected error",
      customErrorCodes: httpException.customErrorCodes,
      message: httpException.message,
      name: httpException.name,
      statusCode: httpException.statusCode,
      cause: ensureError(httpException),
      context,
    });
  }
  // Should not happen, but in case, there is a fallback
  return new HTTPException({
    path: "Unexpected error",
    cause: ensureError(error),
    context,
  });
}
