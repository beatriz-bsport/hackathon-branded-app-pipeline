import React from "react";
import Icon, { IconName } from "../Icon";
import Link from "../Link";
import Body from "../Body";

export type BreadcrumbItemProps =
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    id: string;
    text: string;
    active?: boolean;
    iconLeft?: IconName;
  };

/**
 * A child of Breadcrumbs component that renders a single breadcrumb.
 *
 * @remarks
 * This component is used as a child of {@link Breadcrumbs} component.
 *
 * @param props.id Unique ID of the input element.
 * @param props.text Text to display in the breadcrumb.
 * @param props.active Whether the breadcrumb is active.
 * @param props.iconLeft Name of the icon to display on the left.
 */
const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  id,
  text,
  active,
  iconLeft,
  ...props
}) => {
  return (
    <li
      className="inline-flex max-w-component-breadcrumb items-center gap-xs"
      id={id}
    >
      <>
        {iconLeft && <Icon icon={iconLeft} size="sm" />}
        {active ? (
          <Body
            htmlVariant="span"
            size="sm"
            weight="stronger"
            className="overflow-hidden text-ellipsis"
          >
            {text}
          </Body>
        ) : (
          <Link {...props} color="inherit" className="text-body-sm leading-xs">
            {text}
          </Link>
        )}
      </>
    </li>
  );
};

export default BreadcrumbItem;
