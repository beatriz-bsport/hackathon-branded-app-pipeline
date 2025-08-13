import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { z } from "zod";

import { ControlledForm, FormField, useFormController } from "#src/index";

// Simple input component that could represent any form input (TextField, etc.)
interface SimpleInputProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
  status?: "error" | "default";
  statusText?: string;
  placeholder?: string;
  type?: string;
  "data-testid"?: string;
}

const SimpleInput = ({
  status,
  statusText,
  "data-testid": testId,
  ...props
}: SimpleInputProps) => (
  <div>
    <input {...props} data-testid={testId} />
    {status === "error" && statusText && (
      <span data-testid={`error-${testId}`}>{statusText}</span>
    )}
  </div>
);

interface TestFormProps {
  schema?: z.ZodSchema;
  defaultValues?: Record<string, unknown>;
  onSubmit: (
    data: Record<string, unknown>,
    event?: React.BaseSyntheticEvent,
  ) => void;
  id?: string;
  className?: string;
}

const TestForm = ({
  schema = z.object({ name: z.string() }),
  defaultValues = {},
  onSubmit,
  ...props
}: TestFormProps) => {
  const methods = useFormController({
    schema,
    defaultValues,
    mode: "onSubmit",
  });

  return (
    <ControlledForm {...methods} onSubmit={onSubmit} {...props}>
      <FormField
        name="name"
        mapProps={({ defaultProps }) => ({
          ...defaultProps,
          "data-testid": "input-name",
        })}
      >
        <SimpleInput />
      </FormField>
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
    </ControlledForm>
  );
};

describe("ControlledForm", () => {
  it("renders form element with children", () => {
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    const form = screen.getByTestId("input-name").closest("form");
    expect(form).toBeInTheDocument();
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
  });

  it("applies custom id and className to form element", () => {
    const onSubmit = vi.fn();

    render(
      <TestForm
        onSubmit={onSubmit}
        id="custom-form-id"
        className="custom-form-class"
      />,
    );

    const form = screen.getByTestId("input-name").closest("form");
    expect(form).toHaveAttribute("id", "custom-form-id");
    expect(form).toHaveClass("custom-form-class");
  });

  it("sets noValidate attribute on form element", () => {
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    const form = screen.getByTestId("input-name").closest("form");
    expect(form).toHaveAttribute("noValidate");
  });

  it("integrates with FormField to provide form functionality", () => {
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    expect(screen.getByTestId("input-name")).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByTestId("input-name");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(input, { target: { value: "Test Name" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { name: "Test Name" },
        expect.any(Object),
      );
    });
  });

  it("prevents form submission when validation fails and shows errors", async () => {
    const schema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
    });
    const onSubmit = vi.fn();

    render(<TestForm schema={schema} onSubmit={onSubmit} />);

    const input = screen.getByTestId("input-name");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(input, { target: { value: "A" } }); // Invalid - too short
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("error-input-name")).toBeInTheDocument();
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("handles form reset through form methods", async () => {
    const onSubmit = vi.fn();
    const schema = z.object({ name: z.string() });

    const FormWithReset = () => {
      const methods = useFormController({
        schema,
        defaultValues: { name: "" },
      });

      return (
        <ControlledForm {...methods} onSubmit={onSubmit}>
          <FormField
            name="name"
            mapProps={({ defaultProps }) => ({
              ...defaultProps,
              "data-testid": "input-name",
            })}
          >
            <SimpleInput />
          </FormField>
          <button
            type="button"
            onClick={() => methods.reset({ name: "Reset Value" })}
            data-testid="reset-button"
          >
            Reset
          </button>
        </ControlledForm>
      );
    };

    render(<FormWithReset />);

    const input = screen.getByTestId("input-name");
    const resetButton = screen.getByTestId("reset-button");

    fireEvent.change(input, { target: { value: "Changed Value" } });
    expect(input).toHaveValue("Changed Value");

    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(input).toHaveValue("Reset Value");
    });
  });

  it("supports form methods like setValue and getValues", async () => {
    const onSubmit = vi.fn();
    const schema = z.object({ name: z.string() });

    const FormWithMethods = () => {
      const methods = useFormController({
        schema,
        defaultValues: { name: "Initial" },
      });

      return (
        <ControlledForm {...methods} onSubmit={onSubmit}>
          <FormField
            name="name"
            mapProps={({ defaultProps }) => ({
              ...defaultProps,
              "data-testid": "input-name",
            })}
          >
            <SimpleInput />
          </FormField>
          <button
            type="button"
            onClick={() => methods.setValue("name", "Set by button")}
            data-testid="set-value-button"
          >
            Set Value
          </button>
          <button
            type="button"
            onClick={() => {
              const values = methods.getValues();
              expect(values.name).toBe("Set by button");
            }}
            data-testid="get-values-button"
          >
            Get Values
          </button>
        </ControlledForm>
      );
    };

    render(<FormWithMethods />);

    const input = screen.getByTestId("input-name");
    const setValueButton = screen.getByTestId("set-value-button");
    const getValuesButton = screen.getByTestId("get-values-button");

    expect(input).toHaveValue("Initial");

    fireEvent.click(setValueButton);
    await waitFor(() => {
      expect(input).toHaveValue("Set by button");
    });

    fireEvent.click(getValuesButton); // This will trigger the expectation inside the onClick
  });

  it("handles multiple field types and complex schemas", async () => {
    const complexSchema = z.object({
      name: z.string().min(1, "Name required"),
      email: z.string().email("Invalid email"),
      age: z.number().min(18, "Must be 18+"),
    });

    const ComplexForm = () => {
      const methods = useFormController({
        schema: complexSchema,
        defaultValues: { name: "", email: "", age: 0 },
      });

      return (
        <ControlledForm {...methods} onSubmit={vi.fn()}>
          <FormField
            name="name"
            mapProps={({ defaultProps }) => ({
              ...defaultProps,
              "data-testid": "input-name",
            })}
          >
            <SimpleInput />
          </FormField>
          <FormField
            name="email"
            mapProps={({ defaultProps }) => ({
              ...defaultProps,
              "data-testid": "input-email",
              type: "email",
            })}
          >
            <SimpleInput />
          </FormField>
          <FormField
            name="age"
            mapProps={({ defaultProps }) => ({
              ...defaultProps,
              "data-testid": "input-age",
              type: "number",
            })}
          >
            <SimpleInput />
          </FormField>
          <button type="submit" data-testid="submit-button">
            Submit
          </button>
        </ControlledForm>
      );
    };

    render(<ComplexForm />);

    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByTestId("input-age")).toBeInTheDocument();
  });

  it("preserves form state across re-renders", () => {
    const onSubmit = vi.fn();

    const { rerender } = render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByTestId("input-name");
    fireEvent.change(input, { target: { value: "Persistent Value" } });

    rerender(<TestForm onSubmit={onSubmit} />);

    expect(screen.getByTestId("input-name")).toHaveValue("Persistent Value");
  });

  it("handles form submission event correctly", async () => {
    const onSubmit = vi.fn();
    const schema = z.object({ name: z.string() });

    const FormWithController = () => {
      const methods = useFormController({
        schema,
        defaultValues: { name: "Test Value" },
      });

      return (
        <ControlledForm {...methods} onSubmit={onSubmit}>
          <FormField
            name="name"
            mapProps={({ defaultProps }) => ({
              ...defaultProps,
              "data-testid": "input-name",
            })}
          >
            <SimpleInput />
          </FormField>
          <button type="submit" data-testid="submit-button">
            Submit
          </button>
        </ControlledForm>
      );
    };

    render(<FormWithController />);

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { name: "Test Value" },
        expect.any(Object),
      );
    });
  });

  it("integrates with form controller for complete form behavior", async () => {
    // This test focuses purely on form behavior without testing React Hook Form internals
    const onSubmit = vi.fn();
    const schema = z.object({
      username: z.string().min(3, "Username too short"),
      password: z.string().min(6, "Password too short"),
    });

    let formMethods: ReturnType<typeof useFormController>;

    const BehavioralForm = () => {
      formMethods = useFormController({
        schema,
        defaultValues: { username: "", password: "" },
        mode: "onSubmit",
      });

      return (
        <ControlledForm {...formMethods} onSubmit={onSubmit}>
          <div>
            <input
              name="username"
              data-testid="username-input"
              onChange={(e) => formMethods.setValue("username", e.target.value)}
            />
            <input
              name="password"
              type="password"
              data-testid="password-input"
              onChange={(e) => formMethods.setValue("password", e.target.value)}
            />
            <button type="submit" data-testid="submit-button">
              Submit
            </button>
            <div data-testid="form-errors">
              {Object.entries(formMethods.formState.errors).map(
                ([field, error]) => (
                  <span key={field} data-testid={`error-${field}`}>
                    {String((error as { message?: string })?.message)}
                  </span>
                ),
              )}
            </div>
          </div>
        </ControlledForm>
      );
    };

    render(<BehavioralForm />);

    // Test form validation behavior
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-username")).toHaveTextContent(
        "Username too short",
      );
      expect(screen.getByTestId("error-password")).toHaveTextContent(
        "Password too short",
      );
    });

    expect(onSubmit).not.toHaveBeenCalled();

    // Test successful submission behavior
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { username: "testuser", password: "password123" },
        expect.any(Object),
      );
    });
  });

  it("enables child components to access form functionality through FormField", async () => {
    const onSubmit = vi.fn();
    const schema = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
    });

    const FormWithMultipleFields = () => {
      const methods = useFormController({
        schema,
        defaultValues: { name: "", email: "" },
      });

      return (
        <ControlledForm {...methods} onSubmit={onSubmit}>
          <FormField
            name="name"
            mapProps={({ defaultProps }) => ({
              ...defaultProps,
              "data-testid": "input-name",
            })}
          >
            <SimpleInput />
          </FormField>
          <FormField
            name="email"
            mapProps={({ defaultProps }) => ({
              ...defaultProps,
              "data-testid": "input-email",
              type: "email",
            })}
          >
            <SimpleInput />
          </FormField>
          <button
            type="button"
            onClick={() => methods.setValue("name", "Set via methods")}
            data-testid="set-name"
          >
            Set Name
          </button>
          <button type="submit" data-testid="submit-button">
            Submit
          </button>
        </ControlledForm>
      );
    };

    render(<FormWithMultipleFields />);

    // Test that FormField components can show validation errors
    const nameInput = screen.getByTestId("input-name");
    const emailInput = screen.getByTestId("input-email");
    const submitButton = screen.getByTestId("submit-button");

    // Test form validation through FormField
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("error-input-name")).toBeInTheDocument();
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    // Test setValue through form methods
    const setNameButton = screen.getByTestId("set-name");
    fireEvent.click(setNameButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue("Set via methods");
    });

    // Test that form can be successfully submitted with valid data
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { name: "Set via methods", email: "test@example.com" },
        expect.any(Object),
      );
    });
  });
});
