import { type VariantProps, cva } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import { AnchorHTMLAttributes, useEffect, useState } from "react";

import { useMatchMedia } from "#src/hooks/use-match-media";

import {
  type ActiveTabData,
  TabsContext,
  TabsContextValue,
} from "./TabsContext";
import { TabsItem, type TabsItemProps } from "./TabsItem";
import { TabsResponsive } from "./TabsResponsive";

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

/**
 * Represents a tab configuration in the array-based (non-composable) API.
 * Combines TabsItem props with anchor element attributes for navigation.
 */
export type TabConfig = Omit<TabsItemProps, "orientation"> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export type TabsProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof tabsVariants> & {
    tabs?: Array<TabConfig>;
    TabsItems?: Array<React.ReactNode>;
    orientation: "horizontal" | "vertical";
    defaultValue?: string;
    value?: string;
    onValueChange?: (id: string) => void;
    disableResponsive?: boolean;
  };

/**
 * A component that renders a set of TabsItem in two different ways:
 * - with composition: provide an array of TabsItem through TabsItems prop
 * - with object declaration: provide an array of configs through tabs prop
 *
 * Automatically switches to a dropdown menu on mobile (below "sm" breakpoint) for better UX.
 *
 * @param props.tabs The tabs to render with object declaration API.
 * @param props.TabsItems TabItems to render with composable API.
 * @param props.orientation The orientation of the tabs. Can be "horizontal" or "vertical".
 * @param props.defaultValue [Optional] Initial selected tab. To be used if you don't need to control the state.
 * @param props.value [Optional] Currently selected tab. If `undefined`, will use `defaultValue`. Should be used with `onValueChange`.
 * @param props.onValueChange [Optional] Callback to set the selected tab.
 * @param props.disableResponsive [Optional] If true, disables responsive behavior and always shows regular tabs.
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
  disableResponsive = false,
  ...props
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const [activeTabData, setActiveTabData] = useState<
    Omit<ActiveTabData, "id"> | undefined
  >(() => {
    // Initialize activeTabData with the active tab's label and icon
    const initialActiveTab = value ?? defaultValue;
    const activeTabConfig = tabs.find((tab) => tab.id === initialActiveTab);
    return activeTabConfig
      ? { label: activeTabConfig.label, icon: activeTabConfig.icon }
      : undefined;
  });
  const isAboveSm = useMatchMedia("sm");

  // Sync activeTabData when controlled value changes (for object declaration API)
  useEffect(() => {
    if (value !== undefined && tabs.length > 0) {
      const activeTabConfig = tabs.find((tab) => tab.id === value);
      if (activeTabConfig) {
        setActiveTabData({
          label: activeTabConfig.label,
          icon: activeTabConfig.icon,
        });
      }
    }
  }, [value, tabs]);

  if (!tabs?.length && !TabsItems?.length) {
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

  // Switch to dropdown menu on mobile (below "sm" breakpoint) unless explicitly disabled
  const shouldUseResponsive = !disableResponsive && !isAboveSm;

  const isExternal = value && onValueChange;
  const currentActiveTab = isExternal ? value : activeTab;
  const currentSetActiveTab = isExternal ? onValueChange : setActiveTab;

  let tabsItems: Array<React.ReactNode>;
  const isComposableAPI = TabsItems?.length > 0;

  if (isComposableAPI) {
    tabsItems = TabsItems;
  } else {
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
          currentSetActiveTab(id);
          onClick?.();
        }
      };

    tabsItems = tabs.map(
      ({ id, icon, disabled, isActive, label, onClick, ...otherProps }) => {
        // In responsive mode, don't wrap in anchor or provide onClick
        // DropdownMenu.Item handles its own selection through context
        if (shouldUseResponsive) {
          return (
            <TabsItem
              key={id}
              id={id}
              icon={icon}
              disabled={disabled}
              isActive={isActive ?? id === currentActiveTab}
              label={label}
              orientation={orientation}
            />
          );
        }

        return (
          <a key={id} {...otherProps}>
            <TabsItem
              id={id}
              icon={icon}
              disabled={disabled}
              isActive={isActive ?? id === currentActiveTab}
              label={label}
              orientation={orientation}
              onClick={getHandleTabClick({ id, disabled, onClick })}
            />
          </a>
        );
      },
    );
  }

  const contextValue: TabsContextValue = {
    isResponsive: shouldUseResponsive,
    activeTab: currentActiveTab,
    setActiveTab: currentSetActiveTab,
    activeTabData,
    setActiveTabData: ({ id, ...others }) => {
      setActiveTab(id);
      setActiveTabData(others);
    },
    orientation,
  };

  if (shouldUseResponsive) {
    return (
      <TabsContext.Provider value={contextValue}>
        <TabsResponsive
          className={className}
          TabsItems={tabsItems}
          activeTab={currentActiveTab}
          setActiveTab={currentSetActiveTab}
          tabs={tabs}
        />
      </TabsContext.Provider>
    );
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        data-component="Kaizen-Tabs"
        className={tabsVariants({ className, orientation })}
        {...props}
      >
        {tabsItems}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = "KaizenTabs";

Tabs.Item = TabsItem;

export default Tabs;
