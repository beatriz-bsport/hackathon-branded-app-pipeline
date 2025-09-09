import React from "react";

import Body from "#src/components/Body";
import type { IconName } from "#src/components/Icon";
import Link from "#src/components/Link";

export type BreadcrumbItemProps = {
  href?: string;
  iconLeft?: IconName;
  id?: string;
  isActive?: boolean;
  text: string;
  onClick?: () => void;
};

/**
 * A child of Breadcrumbs component that renders a single breadcrumb.
 *
 * @remarks
 * This component is used as a child of {@link Breadcrumbs} component.
 * @param props.href [Optional] Href to provide to the Kaizen Link. If undefined, the Link is rendered as a div.
 * @param props.iconLeft [Optional] Icon to display before the breadcrumb.
 * @param props.id [Optional] Id to provide to the Breadcrumb element.
 * @param props.text [Optional] Text to display in the breadcrumb.
 * @param props.isActive [Optional] Whether the breadcrumb is active.
 * @param props.onClick [Optional] On click callback to provide to the Link as div
 */
export const BreadcrumbsItem: React.FC<BreadcrumbItemProps> = ({
  href,
  iconLeft,
  id,
  isActive,
  text,
  onClick,
}) => {
  return (
    <Link icon={iconLeft} href={href} id={id} onClick={onClick}>
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
