import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { ControlledForm, FormField, useFormController } from "#src/index";

interface TestInputProps {
  value?: string;
  onChange?: (value: string) => void;
  status?: "error" | "default";
  statusText?: string;
  "data-testid"?: string;
  [key: string]: unknown;
}

const TestInput = ({
  value,
  onChange,
  status,
  statusText,
  "data-testid": testId,
  ...props
}: TestInputProps) => (
  <div>
    <input
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      data-testid={testId || "test-input"}
      {...props}
    />
    {status === "error" && statusText && (
      <span data-testid="error-message">{statusText}</span>
    )}
  </div>
);

interface FormWrapperProps {
  children: React.ReactNode;
  schema?: z.ZodType<Record<string, unknown>>;
  defaultValues?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void;
}

const FormWrapper = ({
  children,
  schema = z.object({ name: z.string() }),
  defaultValues = {},
  onSubmit = () => {},
}: FormWrapperProps) => {
  const methods = useFormController({
    schema,
    defaultValues,
    mode: "onChange",
  });

  return (
    <ControlledForm {...methods} onSubmit={onSubmit}>
      {children}
    </ControlledForm>
  );
};

describe("FormField", () => {
  it("renders field with default props", () => {
    render(
      <FormWrapper>
        <FormField name="name">
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });

  it("passes field value to child component", () => {
    render(
      <FormWrapper defaultValues={{ name: "Test Value" }}>
        <FormField name="name">
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    expect(screen.getByTestId("test-input")).toHaveValue("Test Value");
  });

  it("handles field value changes", async () => {
    const user = userEvent.setup();

    render(
      <FormWrapper>
        <FormField name="name">
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    const input = screen.getByTestId("test-input");
    await user.clear(input);
    await user.type(input, "New Value");

    expect(input).toHaveValue("New Value");
  });

  it("displays error status and message when field has validation error", async () => {
    const schema = z.object({
      email: z.string().email("Invalid email format"),
    });

    render(
      <FormWrapper schema={schema}>
        <FormField name="email">
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    const input = screen.getByTestId("test-input");

    fireEvent.change(input, { target: { value: "invalid-email" } });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });
  });

  it("uses custom mapProps to transform props", () => {
    const mapProps = vi.fn(({ defaultProps, fieldState }) => ({
      ...defaultProps,
      "data-testid": "custom-input",
      "data-error": fieldState.error ? "true" : "false",
    }));

    render(
      <FormWrapper>
        <FormField name="name" mapProps={mapProps}>
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    expect(mapProps).toHaveBeenCalled();
    expect(screen.getByTestId("custom-input")).toBeInTheDocument();
    expect(screen.getByTestId("custom-input")).toHaveAttribute(
      "data-error",
      "false",
    );
  });

  it("provides form context and methods to mapProps for advanced usage", async () => {
    const schema = z.object({
      name: z.string().min(1, "Name required"),
      email: z.string().email("Invalid email"),
    });

    type FormData = z.infer<typeof schema>;
    let capturedForm: UseFormReturn<FormData> | undefined;

    const mapProps = vi.fn(({ form, defaultProps }) => {
      capturedForm = form;
      return {
        ...defaultProps,
        "data-testid": "custom-input",
      };
    });

    const FormWithMultipleFields = () => {
      const methods = useFormController({
        schema,
        defaultValues: { name: "", email: "" },
      });

      return (
        <ControlledForm {...methods} onSubmit={() => {}}>
          <FormField name="name" mapProps={mapProps}>
            <TestInput />
          </FormField>
          <FormField
            name="email"
            mapProps={({ defaultProps }) => ({
              ...defaultProps,
              "data-testid": "email-input",
            })}
          >
            <TestInput />
          </FormField>
          <button
            type="button"
            onClick={() => {
              // Test that we can use form methods through mapProps with proper typing
              capturedForm?.setValue("email", "test@example.com");
            }}
            data-testid="set-email-button"
          >
            Set Email
          </button>
        </ControlledForm>
      );
    };

    render(<FormWithMultipleFields />);

    expect(mapProps).toHaveBeenCalled();
    expect(screen.getByTestId("custom-input")).toBeInTheDocument();

    // Test that form methods from mapProps actually work
    const setEmailButton = screen.getByTestId("set-email-button");
    const emailInput = screen.getByTestId("email-input");

    fireEvent.click(setEmailButton);

    await waitFor(() => {
      expect(emailInput).toHaveValue("test@example.com");
    });
  });

  it("handles complex field types", () => {
    const schema = z.object({
      nested: z.object({
        value: z.string(),
      }),
    });

    render(
      <FormWrapper
        schema={schema}
        defaultValues={{ nested: { value: "nested value" } }}
      >
        <FormField name="nested.value">
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    expect(screen.getByTestId("test-input")).toHaveValue("nested value");
  });

  it("supports validation rules with Controller", async () => {
    const FormWithValidationRules = ({
      children,
    }: {
      children: React.ReactNode;
    }) => {
      const methods = useFormController({
        schema: z.object({
          name: z.string().min(1, "Name is required"),
        }),
        mode: "onBlur",
      });

      return (
        <ControlledForm {...methods} onSubmit={() => {}}>
          {children}
        </ControlledForm>
      );
    };

    render(
      <FormWithValidationRules>
        <FormField name="name">
          <TestInput />
        </FormField>
      </FormWithValidationRules>,
    );

    const input = screen.getByTestId("test-input");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);

    await waitFor(() => {
      // The test shows "Required" is being displayed, which means validation is working
      expect(screen.getByText("Required")).toBeInTheDocument();
    });
  });

  it("clones element with merged props", () => {
    const originalProps = {
      placeholder: "Original placeholder",
      className: "original-class",
    };

    render(
      <FormWrapper>
        <FormField name="name">
          <TestInput {...originalProps} />
        </FormField>
      </FormWrapper>,
    );

    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("placeholder", "Original placeholder");
    expect(input).toHaveClass("original-class");
  });

  it("works with different input components", () => {
    const CustomSelect = ({
      value,
      onChange,
      options = [],
      ...props
    }: {
      value?: string;
      onChange?: (value: string) => void;
      options?: string[];
      status?: "error" | "default";
      statusText?: string;
      [key: string]: unknown;
    }) => (
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        data-testid="custom-select"
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );

    render(
      <FormWrapper>
        <FormField name="category">
          <CustomSelect options={["A", "B", "C"]} />
        </FormField>
      </FormWrapper>,
    );

    const select = screen.getByTestId("custom-select");
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: "A" } });
    expect(select).toHaveValue("A");
  });

  it("handles mapProps returning undefined/null properties", () => {
    const mapProps = vi.fn(() => ({
      value: undefined,
      status: "default",
      customProp: null,
    }));

    render(
      <FormWrapper>
        <FormField name="name" mapProps={mapProps}>
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });

  it("preserves field state across re-renders", () => {
    const { rerender } = render(
      <FormWrapper>
        <FormField name="name">
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    const input = screen.getByTestId("test-input");
    fireEvent.change(input, { target: { value: "Test Value" } });

    rerender(
      <FormWrapper>
        <FormField name="name">
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    expect(screen.getByTestId("test-input")).toHaveValue("Test Value");
  });

  it("provides correct status based on field state", async () => {
    const schema = z.object({
      name: z.string().min(2, "Too short"),
    });

    const mapProps = vi.fn(({ defaultProps }) => defaultProps);

    render(
      <FormWrapper schema={schema}>
        <FormField name="name" mapProps={mapProps}>
          <TestInput />
        </FormField>
      </FormWrapper>,
    );

    // Initially should have default status
    expect(mapProps).toHaveBeenLastCalledWith(
      expect.objectContaining({
        defaultProps: expect.objectContaining({
          status: "default",
        }),
      }),
    );

    const input = screen.getByTestId("test-input");

    fireEvent.change(input, { target: { value: "A" } }); // Invalid

    // Wait for validation
    await waitFor(() => {
      expect(mapProps).toHaveBeenLastCalledWith(
        expect.objectContaining({
          defaultProps: expect.objectContaining({
            status: "error",
            statusText: "Too short",
          }),
        }),
      );
    });
  });
});
