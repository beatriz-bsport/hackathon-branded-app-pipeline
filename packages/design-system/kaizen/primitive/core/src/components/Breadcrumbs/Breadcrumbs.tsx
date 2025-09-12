import { cva } from "class-variance-authority";
import React, { Fragment } from "react";

import Icon from "#src/components/Icon";

import { type BreadcrumbItemProps, BreadcrumbsItem } from "./BreadcrumbsItem";

const defaultClasses = [
  "flex",
  "items-center",
  "gap-xs",
  "text-onsurface-default",
] as const;

const breadcrumbs = cva(defaultClasses);

export type BreadcrumbsProps = React.HTMLAttributes<HTMLElement> & {
  breadcrumbsItems?: Array<BreadcrumbItemProps>;
  BreadcrumbsItems?: Array<React.ReactNode>;
};

/**
 * Render breadcrumbs with two possible configurations :
 * - with plain JS objects with `breadcrumbsItems` prop
 * - with an array of ReactNode for better composition, with `BreadcrumbsItems` prop
 *
 * @param props.className Classname to add to the breadcrumbs' container.
 * @param props.breadcrumbsItems List of breadcrumbs objects to use declarative configuration.
 * @param props.BreadcrumbsItems List of ReactNode containing BreadcrumbItems to use composable configuration.
 *
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-breadcrumbs--docs
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> & {
  Item: typeof BreadcrumbsItem;
} = ({
  className,
  breadcrumbsItems,
  BreadcrumbsItems,
  ...props
}: BreadcrumbsProps) => {
  // Build a list of BreadcrumbItem
  let items: React.ReactNode[] = [];
  if (BreadcrumbsItems) {
    // Composition with React Nodes
    items = BreadcrumbsItems;
  } else if (breadcrumbsItems) {
    // Declaration with JS object declaration : we need to build BreadcrumbItems based on the configs
    items = breadcrumbsItems.map((value, index) => {
      return <BreadcrumbsItem key={index} {...value} />;
    });
  }

  return (
    <nav aria-label="breadcrumb" {...props}>
      <ol className={breadcrumbs({ className })}>
        {items?.map((breadcrumb, index) => (
          <Fragment key={index}>
            <li
              className="inline-flex max-w-component-breadcrumb items-center gap-xs"
              id={`breadcrumb-${index}`}
            >
              {breadcrumb}
            </li>
            {index < items.length - 1 && (
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

Breadcrumbs.Item = BreadcrumbsItem;

export default Breadcrumbs;
