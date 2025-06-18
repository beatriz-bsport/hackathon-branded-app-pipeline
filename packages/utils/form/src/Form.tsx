import React from "react";
import { SubmitHandler, UseFormProps } from "react-hook-form";
import { z } from "zod";

import { ControlledForm } from "./ControlledForm";
import { useFormController } from "./use-form-controller";

export type FormProps<Schema extends z.ZodTypeAny = z.ZodTypeAny> = {
  schema: Schema;
  onSubmit: SubmitHandler<z.infer<Schema>>;
  children: React.ReactNode;
  id?: string;
  className?: string;
} & Omit<UseFormProps<z.infer<Schema>>, "resolver">;

export const Form = <Schema extends z.ZodTypeAny>({
  schema,
  onSubmit,
  children,
  id,
  className,
  ...props
}: FormProps<Schema>) => {
  const methods = useFormController<Schema>({
    ...props,
    schema,
  });

  return (
    <ControlledForm
      id={id}
      className={className}
      {...methods}
      onSubmit={onSubmit}
    >
      {children}
    </ControlledForm>
  );
};
