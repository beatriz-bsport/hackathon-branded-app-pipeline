import React from "react";

import { PackFormDescription } from "./PackFormDescription";
import { PackFormName } from "./PackFormName";

type PackFormIdentityProps = {
  fieldIdPrefix: string;
};

/**
 * Form Section to edit :
 * - the name of the pack (limited to 200 characters)
 * - the description of the pack (limited to 2000 characters)
 */
export const PackFormIdentity: React.FC<PackFormIdentityProps> = ({
  fieldIdPrefix,
}) => {
  return (
    <section className="flex flex-col gap-md">
      <PackFormName fieldIdPrefix={fieldIdPrefix} />
      <PackFormDescription fieldIdPrefix={fieldIdPrefix} />
    </section>
  );
};
