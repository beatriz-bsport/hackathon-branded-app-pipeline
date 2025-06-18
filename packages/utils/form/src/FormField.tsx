import React from "react";
import {
  Controller,
  type ControllerProps,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form";

import { type TextFieldProps } from "@bsport/kaizen-primitive-core";

type DefaultFormFieldProps<
  FormValues extends FieldValues = FieldValues,
  FormName extends FieldPath<FormValues> = FieldPath<FormValues>,
> = ControllerRenderProps<FormValues, FormName> & {
  status: "error" | "default";
  statusText?: string;
};

export const FormField = <
  FormValues extends FieldValues = FieldValues,
  FormName extends FieldPath<FormValues> = FieldPath<FormValues>,
  FormInputProps = TextFieldProps,
>({
  children,
  name,
  rules,
  mapProps,
  ...props
}: Omit<ControllerProps<FormValues, FormName>, "render"> & {
  children: React.ReactElement<FormInputProps>;
  mapProps?: (
    props: Parameters<ControllerProps<FormValues, FormName>["render"]>[0] & {
      form: UseFormReturn<FormValues>;
      defaultProps: DefaultFormFieldProps<FormValues, FormName>;
    },
  ) => Partial<FormInputProps>;
}) => {
  const { control } = useFormContext<FormValues>();
  const form = useFormContext<FormValues>();

  return (
    <Controller<FormValues, FormName>
      name={name}
      rules={rules}
      {...props}
      control={control}
      render={({ field, fieldState, formState }) => {
        const defaultProps: DefaultFormFieldProps<FormValues, FormName> = {
          ...field,
          status: fieldState.error ? "error" : "default",
          statusText: fieldState.error?.message,
        };

        const fieldProps = mapProps
          ? mapProps({
              field,
              fieldState,
              formState,
              form,
              defaultProps,
            })
          : defaultProps;

        return React.cloneElement<typeof fieldProps>(children, fieldProps);
      }}
    />
  );
};
