import assert from "node:assert/strict";

/**
 * Minimalistic expect function.
 * Asserts that the actual value is equal to the expected value.
 * @param actual The actual value to be checked.
 * @returns An object with methods to assert the value.
 */
export function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected: T) {
      assert.deepStrictEqual(actual, expected);
    },
    toThrow(expected?: RegExp | Error | string) {
      if (expected instanceof RegExp) {
        assert.throws(actual as () => void, { message: expected });
      } else if (expected instanceof Error) {
        assert.throws(actual as () => void, { message: expected.message });
      } else if (typeof expected === "string") {
        assert.throws(actual as () => void, { message: expected });
      } else {
        assert.throws(actual as () => void);
      }
    },
    not: {
      toThrow() {
        assert.doesNotThrow(actual as () => void);
      },
    },
  };
}
