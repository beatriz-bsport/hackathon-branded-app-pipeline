# Form Utilities

React Hook Form abstractions designed to reduce boilerplate and integrate seamlessly with Kaizen design system components.

## Components

### Form

Simple form wrapper for cases where you don't need to access form state (like `isDirty`, `isValid`) outside the form context.

```tsx
import { z } from "zod";

import { Form, FormField } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export const MyForm = () => {
  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  return (
    <Form schema={schema} onSubmit={handleSubmit}>
      <FormField name="name">
        <TextField label="Name" />
      </FormField>
      <FormField name="email">
        <TextField label="Email" type="email" />
      </FormField>
      <button type="submit">Submit</button>
    </Form>
  );
};
```

### ControlledForm + useFormController

Use this combination when you need access to form state outside the form context :

- `isDirty`: Set to true after the user modifies any of the inputs.
- `isValid`: Set to true if the form doesn't have any errors.
- `watch`: This method will watch specified inputs and return their values.

```tsx
import { z } from "zod";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { Button, TextField } from "@bsport/kaizen-primitive-core";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export const MyControlledForm = () => {
  const methods = useFormController({ schema });
  const { isDirty, watch } = methods;

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  const nameValue = watch("name");

  return (
    <div>
      <p>Form is dirty: {isDirty ? "Yes" : "No"}</p>
      <p>Name value: {nameValue}</p>

      <ControlledForm {...methods} onSubmit={handleSubmit}>
        <FormField name="name">
          <TextField label="Name" />
        </FormField>
        <FormField name="email">
          <TextField label="Email" type="email" />
        </FormField>
        <Button type="submit" disabled={!isDirty}>
          Save Changes
        </Button>
      </ControlledForm>
    </div>
  );
};
```

### FormField

Wrapper component that connects Kaizen components to React Hook Form with automatic validation and error handling.

```tsx
// Basic usage
<FormField name="fieldName">
  <TextField label="Field Label" />
</FormField>

// With custom prop mapping
<FormField
  name="description"
  mapProps={({ defaultProps, fieldState }) => ({
    ...defaultProps,
    rows: 4,
    placeholder: "Enter description...",
  })}
>
  <TextArea label="Description" />
</FormField>
```

## Key Features

- **Zod Integration**: Automatic schema validation with TypeScript types
- **Kaizen Components**: Seamless integration with design system components
- **Error Handling**: Automatic error state and message display
- **TypeScript**: Full type safety with inferred types from Zod schemas
- **Flexible**: Choose between simple Form or controlled approach based on your needs

## API Reference

### Form Props

- `schema`: Zod schema for validation
- `onSubmit`: Submit handler function
- `children`: Form content
- `id?`: Form element ID
- `className?`: CSS classes
- All other `useForm` props (except `resolver`)

### ControlledForm Props

- `onSubmit`: Submit handler function
- `children`: Form content
- `id?`: Form element ID
- `className?`: CSS classes
- All `UseFormReturn` properties from React Hook Form

### FormField Props

- `name`: Field name (typed based on schema)
- `children`: Single React element (Kaizen component)
- `mapProps?`: Function to customize props passed to the child component
- All other `Controller` props (except `render`)

### useFormController

Hook that wraps `useForm` with Zod resolver integration.

- `schema`: Zod schema for validation
- All other `useForm` props (except `resolver`)
