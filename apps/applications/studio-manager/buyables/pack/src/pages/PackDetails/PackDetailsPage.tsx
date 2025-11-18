import { type FC, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";
import type { Pack } from "@bsport/store-buyables-pack";

import {
  type PackFormSchema,
  usePackSchema,
} from "#src/components/PackForm/schema";

import { PackDetailsHeader } from "./PackDetailsHeader";

type PackDetailsPageProps = {
  pack: Pack;
};

export const PackDetailsPage: FC<PackDetailsPageProps> = ({ pack }) => {
  const { detailsLayoutProps, toggleIsPanelOpened } = useDetailsLayout();

  const packSchema = usePackSchema();

  const methods = useFormController<PackFormSchema>({
    mode: "onBlur",
    schema: packSchema,
    defaultValues: {
      ...pack,
      price: parseInt(pack.price),
      tax: parseInt(pack.tax),
    },
  });

  const formId = `pack-form-details-${useId()}`;

  return (
    <ControlledForm {...methods} onSubmit={console.log} id={formId}>
      <DetailsLayout {...detailsLayoutProps}>
        <PackDetailsHeader
          methods={methods}
          pack={pack}
          toggleIsPanelOpened={toggleIsPanelOpened}
        />

        <DetailsLayout.Content>
          {/** Placeholder for the layout, will be removed in the next steps */}
          <h3>Pack n°{pack.id}</h3>
          {JSON.stringify(pack)}
        </DetailsLayout.Content>

        <DetailsLayout.Panel>Placeholder for Panel</DetailsLayout.Panel>

        <DetailsLayout.Confirmation
          onDiscard={() => {
            /** @todo Replace */
            console.log("Changes discarded");
          }}
          onSave={() => {
            /** @todo Replace */
            console.log("Changes saved");
          }}
        />
      </DetailsLayout>
    </ControlledForm>
  );
};
