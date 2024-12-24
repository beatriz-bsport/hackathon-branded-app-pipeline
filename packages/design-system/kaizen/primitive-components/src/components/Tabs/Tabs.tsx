import React, { AnchorHTMLAttributes, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import mapValues from "lodash/mapValues";
import Icon, { IconName } from "#src/components/Icon";

const defaultClasses = [
  "flex",
  "leading-xs",
  "overflow-auto",
  "whitespace-nowrap",
] as const;

const variants = {
  orientation: {
    horizontal: ["flex-row"],
    vertical: ["flex-col"],
  },
} as const;

export const orientations = mapValues(
  variants.orientation,
  (_, key) => key,
) as {
  [key in keyof typeof variants.orientation]: key;
};

const tabsVariants = cva(defaultClasses, { variants });

export type TabsProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof tabsVariants> & {
    tabs: {
      label: string;
      href?: string;
      target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
      disabled?: boolean;
      icon?: IconName;
      extraProps?: Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        "href" | "target"
      >;
    }[];
    orientation: keyof typeof orientations;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
  };

/**
 * A component that renders a set of tabs.
 * One tab is composed of a unique label and reprensented by an anchor tag that may be used to navigate to another page.
 * @param props.tabs The tabs to render.
 * @param props.orientation The orientation of the tabs. Can be "horizontal" or "vertical".
 * @param props.defaultValue Initial selected tab. To be used if you don't need to control the state.
 * @param props.value Currently selected tab. If `undefined`, will use `defaultValue`. Should be used with `onValueChange`.
 * @param props.onValueChange Callback to set the selected tab.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-tabs--docs
 */
const Tabs: React.FC<TabsProps> = ({
  className,
  tabs,
  orientation,
  defaultValue,
  value,
  onValueChange,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value);

  const handleTabClick = (label: string) => {
    const clickedTab = tabs?.find((tab) => tab.label === label);
    if (!clickedTab?.disabled) {
      setActiveTab(label);
      onValueChange?.(label);
    }
  };

  if (!tabs) {
    console.warn("The Tabs component should have at least one tab to render.");
  }
  if ((value && !onValueChange) || (!value && onValueChange)) {
    console.warn(
      "The Tabs component should have both `value` and `onValueChange` props if you want to control the state.",
    );
  }

  return (
    <div className={tabsVariants({ className, orientation })} {...props}>
      {tabs?.map(({ label, icon, disabled, ...tabProps }) => (
        <a
          key={label}
          className={classNames(
            "py-xs",
            {
              "border-b-stroke-regular border-b-stroke-action-main-selected":
                orientation === "horizontal",
              "pr-sm border-r-stroke-regular": orientation === "vertical",
            },
            {
              "text-onsurface-action-weak-main font-strong":
                activeTab === label,
              "text-onsurface-action-main-rest border-none":
                activeTab !== label,
            },
            {
              "cursor-not-allowed opacity-sm": disabled,
              "cursor-pointer": !disabled,
            },
          )}
          aria-selected={activeTab === label}
          tabIndex={activeTab === label ? 0 : -1}
          role="tab"
          onClick={() => handleTabClick(label)}
          {...tabProps}
        >
          <div
            className={classNames("flex px-xs py-2xs gap-xs rounded-sm", {
              "hover:bg-surface-action-main-weak-hovered active:bg-surface-action-main-weak-pressed":
                !disabled && activeTab === label,
              "hover:bg-surface-action-default-weak-hovered active:bg-surface-action-default-weak-pressed":
                !disabled && activeTab !== label,
            })}
          >
            {icon && (
              <Icon
                icon={icon}
                size="sm"
                className={classNames({
                  "text-onsurface-main-strong": activeTab === label,
                  "text-onsurface-default": activeTab !== label,
                })}
              />
            )}
            <span className="flex-1 truncate">{label}</span>
          </div>
        </a>
      ))}
    </div>
  );
};

Tabs.displayName = "KaizenTabs";

export default Tabs;
