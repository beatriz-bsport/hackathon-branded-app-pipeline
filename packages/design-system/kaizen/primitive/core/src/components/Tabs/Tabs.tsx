import { type VariantProps, cva } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import React, { AnchorHTMLAttributes, useState } from "react";

import { TabsItem, type TabsItemProps } from "./TabsItem";

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
    tabs?: Array<
      Omit<TabsItemProps, "orientation"> &
        AnchorHTMLAttributes<HTMLAnchorElement>
    >;
    TabsItems?: Array<React.ReactNode>;
    orientation: "horizontal" | "vertical";
    defaultValue?: string;
    value?: string;
    onValueChange?: (id: string) => void;
  };

/**
 * A component that renders a set of TabsItem in two different ways
 * - with composition : provide an array of TabsItem through TabsItems prop
 * - with object declaration : provide an array of configs through tabs prop
 *
 * @param props.tabs The tabs to render with object declaration API.
 * @param props.TabsItems TabItems to render with composable API.
 * @param props.orientation The orientation of the tabs. Can be "horizontal" or "vertical".
 * @param props.defaultValue [Optional] Initial selected tab. To be used if you don't need to control the state.
 * @param props.value [Optional] Currently selected tab. If `undefined`, will use `defaultValue`. Should be used with `onValueChange`.
 * @param props.onValueChange [Optional] Callback to set the selected tab.
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-tabs--docs
 */
const Tabs: React.FC<TabsProps> & { Item: typeof TabsItem } = ({
  className,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  tabs = [],
  TabsItems = [],
  value,
  ...props
}: TabsProps) => {
  // Internal state to manage the active tab
  const [_activeTab, _setActiveTab] = useState(defaultValue);

  if (!tabs?.length || !TabsItems?.length) {
    console.warn(
      "The Tabs component should have at least one tab or TabItem to render.",
    );
    return null;
  }
  if ((value && !onValueChange) || (!value && onValueChange)) {
    console.warn(
      "The Tabs component should have both `value` and `onValueChange` props if you want to control the state.",
    );
  }

  let tabsItems: Array<React.ReactNode>;
  if (TabsItems?.length > 0) {
    // Composable API - Use TabItems
    tabsItems = TabsItems;
  } else {
    // Object Declaration API - Use tabs

    // Use the adequate state manager for the selected tab
    const useExternal = value && onValueChange;
    const activeTab = useExternal ? value : _activeTab;
    const setActiveTab = useExternal ? onValueChange : _setActiveTab;

    const getHandleTabClick =
      ({
        id,
        disabled,
        onClick,
      }: {
        id: string;
        disabled?: boolean;
        onClick?: () => void;
      }) =>
      () => {
        if (!disabled) {
          // Update the internal or external state
          setActiveTab(id);
          // Additional callback
          onClick?.();
        }
      };

    // Create an array of TabItem
    tabsItems = tabs.map(
      ({ id, icon, disabled, isActive, label, onClick, ...otherProps }) => (
        <a key={id} {...otherProps}>
          <TabsItem
            id={id}
            icon={icon}
            disabled={disabled}
            isActive={isActive ?? id === activeTab}
            label={label}
            orientation={orientation}
            onClick={getHandleTabClick({ id, disabled, onClick })}
          />
        </a>
      ),
    );
  }

  return (
    <div className={tabsVariants({ className, orientation })} {...props}>
      {tabsItems}
    </div>
  );
};

Tabs.displayName = "KaizenTabs";

Tabs.Item = TabsItem;

export default Tabs;
