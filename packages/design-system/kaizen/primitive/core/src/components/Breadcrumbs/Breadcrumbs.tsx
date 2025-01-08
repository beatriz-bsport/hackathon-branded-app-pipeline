import React, { Fragment } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import BreadcrumbsItem, { BreadcrumbItemProps } from "./BreadcrumbsItem";
import Icon from "#src/components/Icon";

const defaultClasses = [
  "flex",
  "items-center",
  "gap-xs",
  "text-onsurface-default",
] as const;

const breadcrumbs = cva(defaultClasses);

export type BreadcrumbsProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof breadcrumbs> & {
    breadcrumbsItems: Array<BreadcrumbItemProps>;
  };

/**
 * React component for breadcrumbs.
 * @param props.className Classname to add to the breadcrumbs' container.
 * @param props.breadcrumbsItems List of breadcrumbs items to display.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-breadcrumbs--docs
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className,
  breadcrumbsItems,
  ...props
}) => {
  return (
    <nav aria-label="breadcrumb" {...props}>
      <ol className={breadcrumbs({ className })}>
        {breadcrumbsItems?.map((item, index) => (
          <Fragment key={item.id}>
            <BreadcrumbsItem {...item} />
            {index < breadcrumbsItems.length - 1 && (
              <li className="flex items-center">
                <Icon icon="chevron-right" size="sm" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumbs.displayName = "KaizenBreadcrumb";

export default Breadcrumbs;
