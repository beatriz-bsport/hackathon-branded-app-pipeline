import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";

import { Form, FormField } from "#src/index";

interface TestInputProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  status?: "error" | "default";
  statusText?: string;
  type?: string;
  name?: string;
  [key: string]: unknown;
}

const TestInput = ({
  value,
  onChange,
  status,
  statusText,
  type,
  name,
  ...props
}: TestInputProps) => (
  <div>
    <input
      value={value || ""}
      onChange={(e) =>
        onChange?.(type === "number" ? Number(e.target.value) : e.target.value)
      }
      data-testid={`input-${name}`}
      type={type}
      name={name}
      {...props}
    />
    {status === "error" && statusText && (
      <span data-testid={`error-${name}`}>{statusText}</span>
    )}
  </div>
);

describe("Form", () => {
  const testSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    age: z.number().min(18, "Must be at least 18 years old"),
  });

  it("renders form with children", () => {
    const onSubmit = vi.fn();

    render(
      <Form schema={testSchema} onSubmit={onSubmit}>
        <div data-testid="form-content">Form content</div>
      </Form>,
    );

    expect(screen.getByTestId("form-content")).toBeInTheDocument();
  });

  it("applies custom id and className to form element", () => {
    const onSubmit = vi.fn();

    render(
      <Form
        schema={testSchema}
        onSubmit={onSubmit}
        id="test-form"
        className="custom-form-class"
      >
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </Form>,
    );

    const form = screen.getByTestId("submit-button").closest("form");
    expect(form).toHaveAttribute("id", "test-form");
    expect(form).toHaveClass("custom-form-class");
  });

  it("handles form submission with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <Form schema={testSchema} onSubmit={onSubmit}>
        <FormField name="name">
          <TestInput />
        </FormField>
        <FormField name="email">
          <TestInput />
        </FormField>
        <FormField name="age">
          <TestInput type="number" />
        </FormField>
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </Form>,
    );

    const nameInput = screen.getByTestId("input-name");
    const emailInput = screen.getByTestId("input-email");
    const ageInput = screen.getByTestId("input-age");
    const submitButton = screen.getByTestId("submit-button");

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(ageInput, "25");

    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          name: "John Doe",
          email: "john@example.com",
          age: 25,
        },
        expect.any(Object),
      );
    });
  });

  it("displays validation errors for invalid data", async () => {
    const onSubmit = vi.fn();

    render(
      <Form schema={testSchema} onSubmit={onSubmit}>
        <FormField name="name">
          <TestInput />
        </FormField>
        <FormField name="email">
          <TestInput />
        </FormField>
        <FormField name="age">
          <TestInput type="number" />
        </FormField>
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </Form>,
    );

    const nameInput = screen.getByTestId("input-name");
    const emailInput = screen.getByTestId("input-email");
    const ageInput = screen.getByTestId("input-age");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(nameInput, { target: { value: "A" } }); // Too short
    fireEvent.change(emailInput, { target: { value: "invalid-email" } }); // Invalid format
    fireEvent.change(ageInput, { target: { value: "16" } }); // Too young

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
      expect(
        screen.getByText("Must be at least 18 years old"),
      ).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("accepts default values", () => {
    const onSubmit = vi.fn();
    const defaultValues = {
      name: "Default Name",
      email: "default@example.com",
      age: 25,
    };

    render(
      <Form
        schema={testSchema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      >
        <FormField name="name">
          <TestInput />
        </FormField>
        <FormField name="email">
          <TestInput />
        </FormField>
        <FormField name="age">
          <TestInput type="number" />
        </FormField>
      </Form>,
    );

    const nameInput = screen.getByTestId("input-name");
    const emailInput = screen.getByTestId("input-email");
    const ageInput = screen.getByTestId("input-age");

    expect(nameInput).toHaveValue("Default Name");
    expect(emailInput).toHaveValue("default@example.com");
    expect(ageInput).toHaveValue(25);
  });

  it("handles form mode (onChange/onBlur/onSubmit)", async () => {
    const onSubmit = vi.fn();

    render(
      <Form schema={testSchema} onSubmit={onSubmit} mode="onChange">
        <FormField name="name">
          <TestInput />
        </FormField>
        <FormField name="email">
          <TestInput />
        </FormField>
      </Form>,
    );

    const nameInput = screen.getByTestId("input-name");

    fireEvent.change(nameInput, { target: { value: "A" } }); // Too short

    // In onChange mode, validation should happen immediately
    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
    });
  });

  it("works with different schema types", async () => {
    const stringSchema = z.object({
      text: z.string(),
    });

    const onSubmit = vi.fn();

    render(
      <Form schema={stringSchema} onSubmit={onSubmit}>
        <FormField name="text">
          <TestInput />
        </FormField>
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </Form>,
    );

    const textInput = screen.getByTestId("input-text");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(textInput, { target: { value: "Test text" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          text: "Test text",
        },
        expect.any(Object),
      );
    });
  });

  it("supports reValidateMode configuration", async () => {
    const onSubmit = vi.fn();

    render(
      <Form
        schema={testSchema}
        onSubmit={onSubmit}
        mode="onSubmit"
        reValidateMode="onChange"
      >
        <FormField name="name">
          <TestInput />
        </FormField>
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </Form>,
    );

    const nameInput = screen.getByTestId("input-name");
    const submitButton = screen.getByTestId("submit-button");

    // First submission with invalid data
    fireEvent.change(nameInput, { target: { value: "A" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
    });

    // After first validation error, onChange revalidation should work
    fireEvent.change(nameInput, { target: { value: "Valid Name" } });

    await waitFor(() => {
      expect(
        screen.queryByText("Name must be at least 2 characters"),
      ).not.toBeInTheDocument();
    });
  });
});
