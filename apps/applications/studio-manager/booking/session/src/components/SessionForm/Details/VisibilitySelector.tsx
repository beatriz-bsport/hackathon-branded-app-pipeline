import { clsx } from "clsx";
import React from "react";
import { type FieldPath } from "react-hook-form";
import type { z } from "zod";

import {
  FormField,
  type UseFormControllerOutput,
  useFormContext,
} from "@bsport/form";
import {
  Body,
  Button,
  Icon,
  type IconProps,
  Popover,
  RadioGroup,
  type RadioGroupProps,
} from "@bsport/kaizen-primitive-core";

enum VISIBILITY_VALUES {
  VISIBLE = "visible",
  HIDDEN = "hidden",
}

export type VisibilityOption = {
  value: string;
  label: string;
  buttonLabel: string;
  helperText?: string;
  icon: IconProps["icon"];
  iconClassName?: string;
};

export type VisibilitySelectorLabels = {
  visible: {
    label: string;
    buttonLabel: string;
    helperText?: string;
  };
  hidden: {
    label: string;
    buttonLabel: string;
    helperText?: string;
  };
};

export type VisibilitySelectorProps<
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
  TFieldName extends FieldPath<z.infer<TSchema>> = FieldPath<z.infer<TSchema>>,
> = {
  /**
   * Unique identifier prefix for form elements
   */
  fieldIdPrefix: string;
  /**
   * Title displayed above the selector button
   */
  title?: string;
  /**
   * Text content for standard visible/hidden options
   */
  labels: VisibilitySelectorLabels;
  /**
   * Additional CSS classes for the button
   */
  buttonClassName?: string;
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean;
  /**
   * Name of the field in the form
   */
  fieldName: TFieldName;
  /**
   * Custom onChange handler that receives the new value and form instance
   * Use this to perform side effects when the value changes
   */
  onFormChange?: (
    value: boolean,
    form?: UseFormControllerOutput<TSchema>,
  ) => void;
  /**
   * Additional props to pass to the RadioGroup
   */
  radioGroupProps?: Partial<RadioGroupProps>;
};

/**
 * VisibilitySelector Component
 *
 * A form-integrated visibility toggle component that allows users to switch between visible and hidden states.
 * This component assumes that the form field is a boolean where true means hidden.
 * It should be used for manager_only or similar fields.
 *
 * @example
 * ```tsx

* <ControlledForm {...methods} onSubmit={handleSubmit}>
 *   <VisibilitySelector
 *     fieldIdPrefix="session"
 *     title="Visibility"
 *     methods={methods}
 *     fieldName="manager_only"
 *     labels={{
 *       visible: {
 *         label: "Visible to members",
 *         buttonLabel: "Visible",
 *         helperText: "All members can see this"
 *       },
 *       hidden: {
 *         label: "Hidden from members",
 *         buttonLabel: "Hidden",
 *         helperText: "Only managers can see this"
 *       }
 *     }}
 *     onFormChange={(value, form) => {
 *       console.log('Visibility changed to:', value);
 *     }}
 *   />
 * </ControlledForm>
 * ```
 */
export const VisibilitySelector = <
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
  TFieldName extends FieldPath<z.infer<TSchema>> = FieldPath<z.infer<TSchema>>,
>({
  fieldIdPrefix,
  title,
  labels,
  buttonClassName,
  disabled = false,
  radioGroupProps,
  fieldName,
  onFormChange,
}: VisibilitySelectorProps<TSchema, TFieldName>): React.ReactElement => {
  const { watch } = useFormContext<TSchema>();

  const fieldValue = watch(fieldName);

  // Validate that the field value is a boolean
  if (typeof fieldValue !== "boolean") {
    throw new Error(
      `VisibilitySelector: Field "${String(fieldName)}" must be a boolean. Got ${typeof fieldValue}. ` +
        `Ensure your schema defines this field as z.boolean().`,
    );
  }

  const visibilityOptions: Record<string, VisibilityOption> = {
    visible: {
      value: VISIBILITY_VALUES.VISIBLE,
      label: labels.visible.label,
      buttonLabel: labels.visible.buttonLabel,
      helperText: labels.visible.helperText,
      icon: "circle-solid",
      iconClassName: "text-onsurface-status-positive-weak",
    },
    hidden: {
      value: VISIBILITY_VALUES.HIDDEN,
      label: labels.hidden.label,
      buttonLabel: labels.hidden.buttonLabel,
      helperText: labels.hidden.helperText,
      icon: "circle",
      iconClassName: undefined,
    },
  };

  const selectedOption = fieldValue
    ? visibilityOptions.hidden
    : visibilityOptions.visible;

  const dropdownButtonLabel =
    selectedOption?.buttonLabel ?? visibilityOptions.visible.buttonLabel;

  const radioOptions = [
    {
      value: visibilityOptions.visible.value,
      label: visibilityOptions.visible.label,
      helperText: visibilityOptions.visible.helperText,
    },
    {
      value: visibilityOptions.hidden.value,
      label: visibilityOptions.hidden.label,
      helperText: visibilityOptions.hidden.helperText,
    },
  ];

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <>
            {title && (
              <Body size="md" htmlVariant="p">
                {title}
              </Body>
            )}
            <div className="relative">
              {selectedOption?.icon && (
                <Icon
                  className={clsx(
                    "absolute top-sm left-2xs",
                    selectedOption.iconClassName,
                  )}
                  icon={selectedOption.icon}
                  size="xs"
                />
              )}
              <Button
                id={`${fieldIdPrefix}-visibility-dropdown`}
                label={dropdownButtonLabel}
                intent="default"
                color="main"
                size="md"
                iconRight="chevron-down"
                onClick={() => setIsPopoverOpened(true)}
                className={clsx(
                  "min-w-component-select justify-between",
                  buttonClassName,
                )}
                disabled={disabled}
              />
            </div>
          </>
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-left" className="max-w-xs">
        {({ setIsPopoverOpened }) => {
          return (
            <FormField<z.infer<TSchema>, TFieldName, RadioGroupProps>
              name={fieldName}
              mapProps={({ defaultProps, form }) => {
                const { value: fieldValue, ...otherDefaultProps } =
                  defaultProps;
                return {
                  ...otherDefaultProps,
                  onChange: (event) => {
                    const newValue = event.target.value;
                    const newFieldValue = newValue === VISIBILITY_VALUES.HIDDEN;
                    form.setValue(
                      fieldName,
                      newFieldValue as z.infer<TSchema>[TFieldName],
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                    onFormChange?.(newFieldValue, form);
                    setIsPopoverOpened(false);
                  },
                  value: fieldValue
                    ? VISIBILITY_VALUES.HIDDEN
                    : VISIBILITY_VALUES.VISIBLE,
                  ref: undefined,
                };
              }}
            >
              <RadioGroup
                id={`${fieldIdPrefix}-visibility-radio-group`}
                options={radioOptions}
                {...radioGroupProps}
              />
            </FormField>
          );
        }}
      </Popover.Content>
    </Popover>
  );
};

VisibilitySelector.displayName = "KaizenVisibilitySelector";
