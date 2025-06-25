import React from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

export type ControlledFormProps<
  FormFieldValues extends FieldValues = FieldValues,
> = {
  onSubmit: SubmitHandler<FormFieldValues>;
  children: React.ReactNode;
  id?: string;
  className?: string;
} & UseFormReturn<FormFieldValues>;

export const ControlledForm = <
  FormFieldValues extends FieldValues = FieldValues,
>({
  onSubmit,
  children,
  id,
  className,
  ...props
}: ControlledFormProps<FormFieldValues>) => {
  return (
    <FormProvider {...props}>
      <form
        id={id}
        className={className}
        onSubmit={props.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
};
