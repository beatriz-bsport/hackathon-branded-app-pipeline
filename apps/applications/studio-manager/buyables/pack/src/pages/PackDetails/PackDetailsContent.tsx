import type { FC } from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { PackFormDescription } from "#src/components/PackForm/PackFormIdentity";
import { PackFormPricing } from "#src/components/PackForm/PackFormPricing";
import type { PackFormSchema } from "#src/components/PackForm/schema";

type PackDetailsContentProps = {
  fieldIdPrefix: string;
  methods: UseFormControllerOutput<PackFormSchema>;
};

export const PackDetailsContent: FC<PackDetailsContentProps> = ({
  fieldIdPrefix,
  methods,
}) => {
  return (
    <DetailsLayout.Content className="flex flex-col gap-lg">
      <PackFormDescription fieldIdPrefix={fieldIdPrefix} />
      <PackFormPricing fieldIdPrefix={fieldIdPrefix} methods={methods} />
    </DetailsLayout.Content>
  );
};
