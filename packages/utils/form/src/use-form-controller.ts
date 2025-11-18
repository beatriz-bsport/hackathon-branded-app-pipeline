import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormProps, UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

type FormProps<Schema extends z.ZodTypeAny = z.ZodTypeAny> = {
  schema: Schema;
} & Omit<UseFormProps<z.infer<Schema>>, "resolver">;

export const useFormController = <Schema extends z.ZodTypeAny>({
  schema,
  ...props
}: FormProps<Schema>) => {
  return useForm<z.infer<Schema>>({
    ...props,
    resolver: zodResolver(schema),
  });
};

export type UseFormControllerOutput<Schema extends z.ZodTypeAny> =
  UseFormReturn<z.TypeOf<Schema>, z.ZodTypeAny, z.TypeOf<Schema>>;
