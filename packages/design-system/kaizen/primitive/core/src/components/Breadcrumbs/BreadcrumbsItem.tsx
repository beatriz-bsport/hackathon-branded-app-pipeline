import React from "react";

import Body from "#src/components/Body";
import type { IconName } from "#src/components/Icon";
import Link from "#src/components/Link";

export type BreadcrumbItemProps = {
  href?: string;
  icon?: IconName;
  id?: string;
  isActive?: boolean;
  text: string;
};

/**
 * A child of Breadcrumbs component that renders a single breadcrumb.
 *
 * @remarks
 * This component is used as a child of {@link Breadcrumbs} component.
 * @param props.href [Optional] Href to provide to the Kaizen Link. If undefined, the Link is rendered as a div.
 * @param props.icon [Optional] Icon to display before the breadcrumb.
 * @param props.id [Optional] Id to provide to the Breadcrumb element.
 * @param props.text [Optional] Text to display in the breadcrumb.
 * @param props.isActive [Optional] Whether the breadcrumb is active.
 */
const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  href,
  icon,
  id,
  isActive,
  text,
}) => {
  return (
    <Link icon={icon} href={href} id={id}>
      {isActive ? (
        <Body
          htmlVariant="span"
          size="sm"
          weight="stronger"
          className="overflow-hidden text-ellipsis"
          aria-current="page"
        >
          {text}
        </Body>
      ) : (
        <Body htmlVariant="span" size="sm" weight="weak" color="inherit">
          {text}
        </Body>
      )}
    </Link>
  );
};

export default BreadcrumbItem;
