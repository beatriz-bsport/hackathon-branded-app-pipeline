import { cx } from "class-variance-authority";
import React from "react";

import Body from "#src/components/Body";

const defaultClasses = [
  "group",
  "h-xl min-h-xl w-full",
  "rounded-md",
  "p-xs",
  "justify-between",
  "border-none outline-none",
  "flex flex-row items-center justify-start",
  "text-onsurface-default font-size-body-md font-stronger",
];

export type GroupProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

/**
 * Group
 *
 * A component representing a group header in a navigation menu.
 * This component uses the same styling as NavigationMenuItem but without interactive states.
 *
 * @param props.label - Text content to display in the group header.
 * @param props.className - Additional CSS classes for custom styling.
 */
const Group: React.FC<GroupProps> = ({ label, className, ...props }) => {
  return (
    <div
      data-component="Kaizen-NavigationMenu-Group"
      className={cx(defaultClasses, className)}
      {...props}
    >
      {!!label && (
        <Body htmlVariant="span" size="sm" weight="strong" color="weak">
          {label}
        </Body>
      )}
    </div>
  );
};

Group.displayName = "KaizenNavigationMenuGroup";

export default Group;
