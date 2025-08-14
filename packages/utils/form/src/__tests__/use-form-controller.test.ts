import { renderHook } from "@testing-library/react";
import { z } from "zod";

import { useFormController } from "#src/index";

describe("useFormController", () => {
  const testSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    age: z.number().min(18, "Must be at least 18 years old"),
  });

  it("returns form methods with Zod resolver", () => {
    const { result } = renderHook(() =>
      useFormController({ schema: testSchema }),
    );

    expect(result.current.register).toBeDefined();
    expect(result.current.handleSubmit).toBeDefined();
    expect(result.current.formState).toBeDefined();
    expect(result.current.control).toBeDefined();
    expect(result.current.setValue).toBeDefined();
    expect(result.current.getValues).toBeDefined();
    expect(result.current.reset).toBeDefined();
    expect(result.current.trigger).toBeDefined();
  });

  it("accepts and applies default values", () => {
    const defaultValues = {
      name: "John Doe",
      email: "john@example.com",
      age: 25,
    };

    const { result } = renderHook(() =>
      useFormController({
        schema: testSchema,
        defaultValues,
      }),
    );

    const values = result.current.getValues();
    expect(values).toEqual(defaultValues);
  });

  it("validates data using Zod schema", async () => {
    const { result } = renderHook(() =>
      useFormController({ schema: testSchema }),
    );

    // Test with invalid data - validation should fail
    result.current.setValue("name", "A"); // Too short
    result.current.setValue("email", "invalid-email"); // Invalid format
    result.current.setValue("age", 16); // Too young
    let isValid = await result.current.trigger();

    expect(isValid).toBe(false);

    // Test with valid data - validation should pass
    result.current.setValue("name", "John Doe");
    result.current.setValue("email", "john@example.com");
    result.current.setValue("age", 25);
    isValid = await result.current.trigger();

    expect(isValid).toBe(true);
  });

  it("passes validation with valid data", async () => {
    const { result } = renderHook(() =>
      useFormController({ schema: testSchema }),
    );

    result.current.setValue("name", "John Doe");
    result.current.setValue("email", "john@example.com");
    result.current.setValue("age", 25);

    const isValid = await result.current.trigger();

    expect(isValid).toBe(true);
    expect(result.current.formState.errors).toEqual({});
  });

  it("supports different validation modes", () => {
    const { result } = renderHook(() =>
      useFormController({
        schema: testSchema,
        mode: "onChange",
      }),
    );

    expect(result.current.formState).toBeDefined();
    // Mode is applied internally by react-hook-form
  });

  it("supports reValidateMode configuration", () => {
    const { result } = renderHook(() =>
      useFormController({
        schema: testSchema,
        mode: "onSubmit",
        reValidateMode: "onChange",
      }),
    );

    expect(result.current.formState).toBeDefined();
  });

  it("works with different schema types", async () => {
    const simpleSchema = z.object({
      text: z.string().min(1, "Text required"),
    });

    const { result } = renderHook(() =>
      useFormController({ schema: simpleSchema }),
    );

    result.current.setValue("text", "Valid text");

    const isValid = await result.current.trigger();

    expect(isValid).toBe(true);
    expect(result.current.getValues()).toEqual({ text: "Valid text" });
  });

  it("handles complex nested schemas", async () => {
    const nestedSchema = z.object({
      user: z.object({
        profile: z.object({
          firstName: z.string().min(1, "First name required"),
          lastName: z.string().min(1, "Last name required"),
        }),
        preferences: z.object({
          theme: z.enum(["light", "dark"]),
        }),
      }),
    });

    const { result } = renderHook(() =>
      useFormController({ schema: nestedSchema }),
    );

    result.current.setValue("user.profile.firstName", "John");
    result.current.setValue("user.profile.lastName", "Doe");
    result.current.setValue("user.preferences.theme", "dark");

    const isValid = await result.current.trigger();

    expect(isValid).toBe(true);
    expect(result.current.getValues()).toEqual({
      user: {
        profile: {
          firstName: "John",
          lastName: "Doe",
        },
        preferences: {
          theme: "dark",
        },
      },
    });
  });

  it("handles array schemas", async () => {
    const arraySchema = z.object({
      items: z
        .array(
          z.object({
            name: z.string().min(1, "Name required"),
            value: z.number().min(0, "Must be positive"),
          }),
        )
        .min(1, "At least one item required"),
    });

    const { result } = renderHook(() =>
      useFormController({ schema: arraySchema }),
    );

    result.current.setValue("items", [
      { name: "Item 1", value: 10 },
      { name: "Item 2", value: 20 },
    ]);

    const isValid = await result.current.trigger();

    expect(isValid).toBe(true);
    expect(result.current.getValues().items).toHaveLength(2);
  });

  it("supports optional fields in schema", async () => {
    const schemaWithOptional = z.object({
      required: z.string().min(1, "Required field"),
      optional: z.string().optional(),
      withDefault: z.string().default("default value"),
    });

    const { result } = renderHook(() =>
      useFormController({ schema: schemaWithOptional }),
    );

    result.current.setValue("required", "Required value");
    // Leave optional fields unset

    const isValid = await result.current.trigger();

    expect(isValid).toBe(true);
    const values = result.current.getValues();
    expect(values.required).toBe("Required value");
    expect(values.optional).toBeUndefined();
  });

  it("handles form reset with new values", () => {
    const initialValues = {
      name: "Initial",
      email: "initial@test.com",
      age: 20,
    };
    const newValues = { name: "New", email: "new@test.com", age: 30 };

    const { result } = renderHook(() =>
      useFormController({
        schema: testSchema,
        defaultValues: initialValues,
      }),
    );

    expect(result.current.getValues()).toEqual(initialValues);

    result.current.reset(newValues);

    expect(result.current.getValues()).toEqual(newValues);
  });

  it("supports custom validation messages in schema", async () => {
    const customMessageSchema = z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username cannot exceed 20 characters")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores",
        ),
    });

    const { result } = renderHook(() =>
      useFormController({ schema: customMessageSchema }),
    );

    // Test minimum length validation
    result.current.setValue("username", "ab");
    let isValid = await result.current.trigger();

    expect(isValid).toBe(false);

    // Test regex validation
    result.current.setValue("username", "invalid-username!");
    isValid = await result.current.trigger();

    expect(isValid).toBe(false);

    // Test valid username
    result.current.setValue("username", "valid_username123");
    isValid = await result.current.trigger();

    expect(isValid).toBe(true);
  });

  it("maintains type safety with TypeScript", () => {
    const { result } = renderHook(() =>
      useFormController({ schema: testSchema }),
    );

    // TypeScript should infer the correct types
    const values = result.current.getValues();

    // These should be properly typed
    result.current.setValue("name", "String value"); // Should accept string
    result.current.setValue("age", 25); // Should accept number
    // result.current.setValue('name', 123); // Should cause TypeScript error
    // result.current.setValue('nonexistent', 'value'); // Should cause TypeScript error

    expect(typeof values.name === "string" || values.name === undefined).toBe(
      true,
    );
    expect(typeof values.age === "number" || values.age === undefined).toBe(
      true,
    );
  });
});
