import { cva, cx } from "class-variance-authority";
import React from "react";

import Body from "#src/components/Body";
import Icon, { type IconName } from "#src/components/Icon";

const tabsItemContainer = cva(["py-xs"], {
  variants: {
    orientation: {
      vertical: "pr-sm border-r-stroke-regular",
      horizontal:
        "border-b-stroke-regular border-b-stroke-action-main-selected",
    },
    isActive: {
      true: "text-onsurface-action-weak-main font-strong",
      false: "text-onsurface-action-main-rest border-none",
    },
    disabled: {
      true: "cursor-not-allowed opacity-sm",
      false: "cursor-pointer",
    },
  },
});

const tabsItemContent = cva(["flex gap-xs", "px-xs py-2xs", "rounded-sm"], {
  variants: {
    isActive: {
      true: [
        "hover:bg-surface-action-main-weak-hovered",
        "active:bg-surface-action-main-weak-pressed",
      ],
      false: [
        "hover:bg-surface-action-default-weak-hovered",
        "active:bg-surface-action-default-weak-pressed",
      ],
    },
  },
});

export type TabsItemProps = {
  id: string;
  disabled?: boolean;
  icon?: IconName;
  isActive?: boolean;
  label: string;
  onClick?: () => void;
  orientation?: "vertical" | "horizontal";
};

export const TabsItem: React.FC<TabsItemProps> = ({
  disabled = false,
  icon,
  id,
  isActive = false,
  label,
  onClick,
  orientation = "horizontal",
}) => {
  return (
    <div
      className={tabsItemContainer({ isActive, disabled, orientation })}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      role="tab"
      onClick={onClick}
      id={id}
    >
      <div
        className={tabsItemContent({
          isActive: disabled ? undefined : isActive,
        })}
      >
        {icon && (
          <Icon
            icon={icon}
            size="sm"
            className={cx({
              "text-onsurface-main-strong": isActive,
              "text-onsurface-default": !isActive,
            })}
          />
        )}
        <Body
          htmlVariant="span"
          size="md"
          color="inherit"
          className="flex-1 truncate"
        >
          {label}
        </Body>
      </div>
    </div>
  );
};
