import type { FC } from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { DetailsLayout, Divider } from "@bsport/kaizen-primitive-core";

import { PackFormAdvanced } from "#src/components/PackForm/PackFormAdvanced";
import { PackFormVisibility } from "#src/components/PackForm/PackFormVisibility";
import type { PackFormSchema } from "#src/components/PackForm/schema";

type PackDetailsPanelProps = {
  discardId: number;
  fieldIdPrefix: string;
  methods: UseFormControllerOutput<PackFormSchema>;
};

export const PackDetailsPanel: FC<PackDetailsPanelProps> = ({
  discardId,
  fieldIdPrefix,
  methods,
}) => {
  return (
    <DetailsLayout.Panel className="flex flex-col gap-sm">
      <PackFormVisibility
        discardId={discardId}
        fieldIdPrefix={fieldIdPrefix}
        methods={methods}
      />

      <Divider orientation="horizontal" weight="thin" />

      <PackFormAdvanced
        contentOnly
        fieldIdPrefix={`${fieldIdPrefix}-${discardId}`}
      />
    </DetailsLayout.Panel>
  );
};
