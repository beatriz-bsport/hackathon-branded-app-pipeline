import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { BadgeProps } from "#src/components/Badge";
import Badge from "#src/components/Badge";
import type { IconName } from "#src/components/Icon";
import Icon from "#src/components/Icon";

const MINIMUM_OPTIONS_NUMBER = 2;
const MAXIMUM_OPTIONS_NUMBER = 6;

// Define option types
export type SegmentedOption = {
  value: string;
  label?: string;
  icon?: IconName;
  badge?: BadgeProps;
  disabled?: boolean;
};

const defaultClasses = [
  "text-body-sm",
  "flex flex-row",
  "rounded-md",
  "bg-surface-default-elevated",
  "border-stroke-thin",
  "border-stroke-default",
  "border-solid",
  "p-2xs",
  "font-medium",
  "relative",
] as const;

const variants = {
  fullWidth: {
    true: ["w-full"],
    false: ["w-fit"],
  },
  disabled: {
    true: ["opacity-50", "cursor-not-allowed", "pointer-events-none"],
    false: [],
  },
} as const;

const segmentedControl = cva(defaultClasses, {
  variants,
  defaultVariants: {
    fullWidth: false,
    disabled: false,
  },
});

const segmentItemClasses = cva(
  [
    "relative",
    "p-xs",
    "gap-xs",
    "transition-all",
    "duration-200",
    "flex",
    "items-center",
    "justify-center",
    "rounded-sm",
  ],
  {
    variants: {
      active: {
        true: ["bg-surface-main-weak", "text-onsurface-main-onweak"],
        false: [
          "bg-surface-action-default-weak-rest",
          "text-onsurface-action-weak-default",
          "hover:text-onsurface-action-weak-default",
          "hover:bg-surface-action-default-weak-hovered",
          "active:text-onsurface-action-weak-default",
          "active:bg-surface-action-default-weak-pressed",
        ],
      },
      disabled: {
        true: ["opacity-md", "cursor-not-allowed"],
        false: [],
      },
      fullWidth: {
        true: ["flex-1"],
        false: ["w-fit", "max-w-[140px]"],
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  },
);

export type SegmentedControlProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof segmentedControl> & {
    /** Array of options to display in the segmented control */
    options: SegmentedOption[];
    /** Current selected value (controlled component) */
    value?: string;
    /** Default selected value (uncontrolled component) */
    defaultValue?: string;
    /** Callback fired when selection changes */
    onChangeValue?: (value: string) => void;
    /** Whether the control should take full width of its container */
    fullWidth?: boolean;
    /** Whether the entire control is disabled */
    disabled?: boolean;
    /** Optional label for the segmented control (used for accessibility) */
    label?: string;
    /** The url query param name to use to set the segmented control navigation in the URL. If not set, then the URL will not change while using it */
    urlQueryParamName?: string;
    /** Unique identifier used as the query parameter name when it is not deactivated */
    id: string;
  };

/**
 * SegmentedControl - A flexible and accessible segmented control component for single selection from multiple options.
 *
 * This component allows users to select one option from a set of segments, similar to radio buttons but with
 * a more visual presentation. It supports both controlled and uncontrolled modes, URL synchronization,
 * and rich content including icons and badges.
 *
 * ## Features
 * - Single selection from multiple options
 * - Support for icons, badges, and labels
 * - Controlled and uncontrolled modes
 * - Individual option disabling
 * - Full-width or auto-width layouts
 * - URL query parameter synchronization
 * - Accessible keyboard navigation
 * - Smooth animations and hover states
 *
 * ## URL Query Parameter Management
 *
 * When `useUrlQuery` is enabled and an `id` is provided, the component will:
 * - Use the `id` as the query parameter name
 * - Sync the selected value with the URL query parameter
 * - Restore selection from URL on page load/refresh
 * - Update URL when selection changes (without page reload)
 * - Respond to browser back/forward navigation
 *
 * ### URL Management Examples:
 * ```tsx
 * // Basic URL sync - adds ?view=weekly to URL
 * <SegmentedControl
 *   id="view"
 *   useUrlQuery={true}
 *   options={[
 *     { label: "Daily", value: "daily" },
 *     { label: "Weekly", value: "weekly" },
 *     { label: "Monthly", value: "monthly" }
 *   ]}
 * />
 *
 * // Multiple controls with different query params
 * <SegmentedControl id="timeframe" useUrlQuery options={timeOptions} />
 * <SegmentedControl id="category" useUrlQuery options={categoryOptions} />
 * // URL: ?timeframe=weekly&category=sports
 * ```
 *
 * ### URL Behavior:
 * - **Page Load**: Reads query parameter and selects matching option
 * - **Selection Change**: Updates URL without page reload using `history.replaceState`
 * - **Invalid Values**: Ignores query parameters that don't match any option value
 * - **Browser Navigation**: Responds to back/forward button clicks
 * - **Multiple Controls**: Each control manages its own query parameter independently
 *
 * @component
 * @example
 * // Basic usage (uncontrolled)
 * <SegmentedControl
 *   options={[
 *     { label: "Day", value: "day" },
 *     { label: "Week", value: "week" },
 *     { label: "Month", value: "month" }
 *   ]}
 *   defaultValue="week"
 *   onChangeValue={(value) => console.log(value)}
 * />
 *
 * @example
 * // Controlled with state
 * const [view, setView] = useState("day");
 * <SegmentedControl
 *   options={viewOptions}
 *   value={view}
 *   onChangeValue={setView}
 *   fullWidth
 * />
 *
 * @example
 * // With icons and badges
 * <SegmentedControl
 *   options={[
 *     {
 *       label: "Inbox",
 *       value: "inbox",
 *       icon: "mail",
 *       badge: { text: "12", size: "sm", color: "primary" }
 *     },
 *     {
 *       label: "Sent",
 *       value: "sent",
 *       icon: "send"
 *     }
 *   ]}
 * />
 *
 * @example
 * // Without URL synchronization
 * <SegmentedControl
 *   id="filter"
 *   disableUrlMutation={true}
 *   options={filterOptions}
 *   onChangeValue={handleFilterChange}
 * />
 *
 * @param {SegmentedOption[]} options - Array of options to display. Each option must have a unique `value`.
 * @param {string} [value] - Current selected value for controlled component. When provided, component becomes controlled.
 * @param {string} [defaultValue] - Default selected value for uncontrolled component. Used only when `value` is not provided.
 * @param {(value: string) => void} [onChangeValue] - Callback fired when selection changes. Receives the selected option's value.
 * @param {boolean} [fullWidth=false] - Whether the control should take full width of its container. When true, options distribute evenly.
 * @param {boolean} [disabled=false] - Whether the entire control is disabled. When true, prevents all interactions.
 * @param {string} [label] - Optional label for accessibility. Used as `aria-label` for the radiogroup.
 * @param {boolean} [urlQueryParamName] - Optional The url query param name to use to set the segmented control navigation in the URL. If not set, then the URL will not change while using it.
 * @param {string} [id] - Unique identifier used as query parameter name. Required for URL sync.
 * @param {string} [className] - Additional CSS classes to apply to the container.
 * @param {React.HTMLAttributes<HTMLDivElement>} [...props] - Additional HTML attributes passed to the container element.
 *
 * @returns {JSX.Element} The rendered segmented control component.
 *
 * @see Badge - For badge configuration options
 * @see Icon - For available icon names
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-segmentedcontrol--docs
 */
const SegmentedControl: React.FC<SegmentedControlProps> = ({
  className,
  options,
  value,
  defaultValue,
  onChangeValue,
  fullWidth = false,
  disabled = false,
  label,
  urlQueryParamName,
  id,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to get current query parameter value
  const getCurrentQueryValue = useCallback((): string | null => {
    if (typeof window === "undefined" || !urlQueryParamName) return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(urlQueryParamName);
  }, [urlQueryParamName]);

  // Helper function to get initial value based on URL query or props
  const getInitialValue = useCallback((): string | undefined => {
    if (urlQueryParamName) {
      const queryValue = getCurrentQueryValue();
      // Check if query value exists in options1
      if (queryValue && options.some((option) => option.value === queryValue)) {
        return queryValue;
      }
    }
    return value !== undefined
      ? value
      : defaultValue || (options[0]?.value ?? undefined);
  }, [urlQueryParamName, getCurrentQueryValue, value, defaultValue, options]);

  // State for uncontrolled usage
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined,
  );

  // Determine current active value
  const activeValue = value !== undefined ? value : selectedValue;

  const removeUrlQueryParam = useCallback(() => {
    if (typeof window === "undefined" || !urlQueryParamName) return;
    const url = new URL(window.location.href);
    url.searchParams.delete(urlQueryParamName);
    window.history.replaceState(null, "", url.toString());
  }, [urlQueryParamName]);

  // Update URL query parameter when selection changes
  const updateUrlQuery = useCallback(
    (newValue: string) => {
      if (urlQueryParamName && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set(urlQueryParamName, newValue);
        window.history.replaceState(null, "", url.toString());
      }
    },
    [urlQueryParamName],
  );

  // Handle popstate events (browser back/forward)
  useEffect(() => {
    if (!urlQueryParamName) return;

    const handlePopState = () => {
      const queryValue = getCurrentQueryValue();
      if (queryValue && options.some((option) => option.value === queryValue)) {
        // Only update if value is not controlled from parent
        if (value === undefined) {
          setSelectedValue(queryValue);
        }
        // Notify parent component
        onChangeValue?.(queryValue);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [urlQueryParamName, getCurrentQueryValue, options, value, onChangeValue]);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
      // Update URL query if enabled
      if (urlQueryParamName) {
        updateUrlQuery(value);
      }
    }
  }, [value, urlQueryParamName, updateUrlQuery]);

  // Initialize from URL query on mount
  useEffect(() => {
    if (urlQueryParamName && value === undefined) {
      const queryValue = getCurrentQueryValue();
      // If query value exists in options, set
      if (queryValue && options.some((option) => option.value === queryValue)) {
        setSelectedValue(queryValue);
        onChangeValue?.(queryValue);
      }
    }
  }, [urlQueryParamName, value, getCurrentQueryValue, options, onChangeValue]);

  const handleSelect = useCallback(
    (option: SegmentedOption) => {
      if (disabled || option.disabled) return;

      const newValue = option.value;

      // Update internal state for uncontrolled component
      if (value === undefined) {
        setSelectedValue(newValue);
      }

      // Update URL query if enabled
      if (urlQueryParamName) {
        updateUrlQuery(newValue);
      }

      // Notify parent component via onChange callback
      onChangeValue?.(newValue);
    },
    [disabled, onChangeValue, value, urlQueryParamName, updateUrlQuery],
  );

  useEffect(() => {
    const initialValue = getInitialValue();
    if (initialValue) {
      setSelectedValue(initialValue);
      // If URL query is enabled, update it with initial value
      if (urlQueryParamName) {
        updateUrlQuery(initialValue);
      }
      // Notify parent component if initial value is set
      // onChangeValue?.(initialValue);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      const currentOptions = options.filter((opt) => !opt.disabled);
      const currentIndex = currentOptions.findIndex(
        (opt) => opt.value === activeValue,
      );

      let newIndex = currentIndex;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          newIndex = (currentIndex + 1) % currentOptions.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          newIndex =
            (currentIndex - 1 + currentOptions.length) % currentOptions.length;
          break;
        case "Home":
          event.preventDefault();
          newIndex = 0;
          break;
        case "End":
          event.preventDefault();
          newIndex = currentOptions.length - 1;
          break;
        default:
          return;
      }

      const newOption = currentOptions[newIndex];
      if (newOption) {
        handleSelect(newOption);

        // Focus the newly selected option
        const element = containerRef.current?.querySelector<HTMLDivElement>(
          `[role="radio"][data-value="${newOption.value}"]`,
        );
        element?.focus();
      }
    },
    [activeValue, disabled, handleSelect, options],
  );

  useEffect(() => {
    if (options.length < MINIMUM_OPTIONS_NUMBER) {
      console.warn(
        "SegmentedControl: Not enough options provided. At least 2 option are required.",
      );
    }
    if (!options.every((opt) => opt.value)) {
      console.warn(
        "SegmentedControl: All options must have a unique 'value' property.",
      );
    }
    if (options.length >= MAXIMUM_OPTIONS_NUMBER) {
      console.warn(
        "SegmentedControl: Consider using a Select for more than 6 options to avoid clutter.",
      );
    }
  }, [options]);

  useEffect(() => {
    return () => {
      removeUrlQueryParam();
    };
  }, []);

  return (
    <div
      id={id}
      ref={containerRef}
      role="radiogroup"
      aria-label={label}
      className={segmentedControl({
        fullWidth,
        className,
      })}
      {...props}
    >
      {options.map((option) => {
        const isActive = option.value === activeValue;
        const isDisabled = disabled || option.disabled;

        return (
          <div
            key={option.value}
            role="radio"
            aria-checked={isActive}
            aria-label={option.label || `Option ${option.value}`}
            data-value={option.value}
            tabIndex={isDisabled ? -1 : 0}
            onClick={() => handleSelect(option)}
            onKeyDown={(e) => handleKeyDown(e)}
            className={classNames(
              segmentItemClasses({
                active: isActive,
                disabled: isDisabled,
                fullWidth: fullWidth,
              }),
              {
                "pointer-events-none": isDisabled,
                "cursor-pointer": !isDisabled,
              },
            )}
          >
            {option.icon && <Icon icon={option.icon} size="sm" />}
            {option.label && (
              <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                {option.label}
              </p>
            )}
            {option.badge ? <Badge {...option.badge} /> : null}
          </div>
        );
      })}
    </div>
  );
};

SegmentedControl.displayName = "KaizenSegmentedControl";

export default SegmentedControl;
