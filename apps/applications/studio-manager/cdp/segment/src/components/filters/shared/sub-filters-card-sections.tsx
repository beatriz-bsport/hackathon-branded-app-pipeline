import { Fragment, type ReactNode } from "react";

import { Card } from "@bsport/kaizen-primitive-core";

import { FilterAndSeparator } from "./filter-and-separator";

export type SubFilterCardSection = {
  key: string;
  content: ReactNode;
};

type SubFiltersCardSectionsProps = {
  sections: SubFilterCardSection[];
};

/**
 * Stacks sub-filter sections inside a single card, separated by AND dividers.
 */
export const SubFiltersCardSections = ({
  sections,
}: SubFiltersCardSectionsProps) => {
  if (sections.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-xs">
        {sections.map((section, sectionIndex) => (
          <Fragment key={section.key}>
            {sectionIndex > 0 ? <FilterAndSeparator /> : null}
            {section.content}
          </Fragment>
        ))}
      </div>
    </Card>
  );
};
