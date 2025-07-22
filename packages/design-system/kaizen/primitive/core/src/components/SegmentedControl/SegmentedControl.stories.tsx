import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

import Badge from "../Badge";
import Button from "../Button";
import Icon, { icons } from "../Icon";
import Select, { SelectProps } from "../Select";
import TextField from "../TextField";
import Title from "../Title";
import SegmentedControl, { SegmentedOption } from "./SegmentedControl";

/**
 * SegmentedControl
 *
 * A flexible and accessible segmented control component that allows users to select one option from a set of segments,
 * similar to radio buttons but with a more visual presentation. Perfect for switching between different views or modes.
 *
 * ## Features
 * - Single selection from multiple options
 * - Support for icons, badges, and labels
 * - Controlled and uncontrolled modes
 * - Individual option disabling
 * - Full-width or auto-width layouts
 * - URL query parameter synchronization
 * - Smooth animations and hover states
 * - Accessible keyboard navigation
 *
 * ## Usage
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { label: "Day", value: "day", icon: "calendar" },
 *     { label: "Week", value: "week", icon: "calendar-week" },
 *     { label: "Month", value: "month", icon: "calendar-month" },
 *   ]}
 *   value="day"
 *   onChangeValue={(value) => console.log(value)}
 *   fullWidth
 * />
 * ```
 *
 * ## Props
 * | Name          | Type                                                        | Default   | Description                                                        |
 * |---------------|-------------------------------------------------------------|-----------|--------------------------------------------------------------------|
 * | `options`     | `Array<SegmentedOption>`                                    | —         | Array of options to display in the segmented control.             |
 * | `value`       | `string`                                                    | —         | Current selected value (controlled component).                    |
 * | `defaultValue`| `string`                                                    | —         | Default selected value (uncontrolled component).                  |
 * | `onChangeValue`| `(value: string) => void`                                  | —         | Callback fired when selection changes.                            |
 * | `fullWidth`   | `boolean`                                                   | `false`   | Whether the control should take full width of container.          |
 * | `disabled`    | `boolean`                                                   | `false`   | Whether the entire control is disabled.                           |
 * | `label`       | `string`                                                    | —         | Optional label for the segmented control (accessibility).         |
 * | `urlQueryParamName` | `string`                                                   | -   | URL Query Param Name.                       |
 * | `id`          | `string`                                                    | —         | Unique identifier for URL query parameter name.                   |
 * | `className`   | `string`                                                    | —         | Additional CSS classes for the container.                         |
 * | ...props      | `React.HTMLAttributes<HTMLDivElement>`                     | —         | Other native div attributes.                                      |
 *
 * ## SegmentedOption Properties
 * | Name       | Type        | Default | Description                                    |
 * |------------|-------------|---------|------------------------------------------------|
 * | `value`    | `string`    | —       | Unique value for the option.                  |
 * | `label`    | `string`    | —       | Display text for the option.                  |
 * | `icon`     | `IconName`  | —       | Optional icon to display with the option.     |
 * | `badge`    | `BadgeProps`| —       | Optional badge to display with the option.    |
 * | `disabled` | `boolean`   | `false` | Whether this specific option is disabled.     |
 *
 * ## URL Query Parameter Management
 *
 * The SegmentedControl supports automatic synchronization with URL query parameters, enabling:
 * - **Shareable URLs**: Users can share URLs with specific selections
 * - **Browser Navigation**: Back/forward buttons work as expected
 * - **Page Refresh**: Selections persist across page reloads
 * - **Deep Linking**: Direct navigation to specific states
 *
 * ### Setup
 *
 * ```tsx
 * <SegmentedControl
 *   id="viewMode"           // Used as query parameter name
 *   options={viewOptions}
 *   onChangeValue={handleChange}
 * />
 * ```
 *
 * ### URL Structure
 * The component uses the `id` prop as the query parameter name:
 * - **Component**: `<SegmentedControl id="filter" ... />`
 * - **URL**: `https://example.com/page?filter=active`
 * - **Multiple Controls**: `?viewMode=weekly&category=sports&status=active`
 *
 * ### Behavior Details
 *
 * #### Page Load
 * 1. Component reads query parameter value from URL
 * 2. If value matches an option, selects that option
 * 3. If no match or invalid value, uses `defaultValue` or first option
 * 4. Calls `onChangeValue` if selection was made from URL
 *
 * #### Selection Change
 * 1. Updates internal state (if uncontrolled)
 * 2. Updates URL query parameter using `history.replaceState`
 * 3. Calls `onChangeValue` callback
 * 4. Does not trigger page reload
 *
 * #### Browser Navigation
 * 1. Listens for `popstate` events (back/forward buttons)
 * 2. Reads new query parameter value
 * 3. Updates selection if value is valid
 * 4. Calls `onChangeValue` callback
 *
 * ### Examples
 *
 * ```tsx
 * // Single control with URL sync
 * <SegmentedControl
 *   id="view"
 *   options={[
 *     { label: "List", value: "list" },
 *     { label: "Grid", value: "grid" },
 *     { label: "Table", value: "table" }
 *   ]}
 * />
 * // URL: ?view=grid
 *
 * // Multiple controls
 * <SegmentedControl id="timeframe" options={timeOptions} />
 * <SegmentedControl id="category" options={categoryOptions} />
 * // URL: ?timeframe=monthly&category=reports
 *
 * // Controlled component with URL sync
 * const [filter, setFilter] = useState('all');
 *
 * <SegmentedControl
 *   id="filter"
 *   value={filter}
 *   onChangeValue={setFilter}
 *   options={filterOptions}
 * />
 * ```
 *
 * ### Limitations
 * - **Client-side only**: URL sync only works in browser environment
 * - **Query parameter conflicts**: Ensure unique `id` values to avoid conflicts
 * - **Invalid values**: Invalid query parameters are ignored (no error thrown)
 * - **Case sensitivity**: Query parameter values are case-sensitive
 *
 * ## Accessibility
 * - Uses proper ARIA attributes for screen readers
 * - Keyboard navigation support (arrow keys, space, enter)
 * - Focus management and visual focus indicators
 * - Proper labeling and role assignments
 *
 * ## See Also
 * - [FormRadioGroup](./FormRadioGroup) - For traditional radio button layouts
 * - [Button](./Button) - For single action buttons
 * - [Storybook Docs](https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-segmentedcontrol--docs)
 *
 * @component
 */

const meta: Meta<typeof SegmentedControl> = {
  component: SegmentedControl,
  title: "Components/SegmentedControl",
  tags: ["autodocs"],
  argTypes: {
    options: {
      description: "Array of options to display in the segmented control",
      control: "object",
      table: {
        type: {
          summary: "Array<SegmentedOption>",
          detail: `Array of {
  value: string;
  label?: string;
  icon?: IconName;
  badge?: { text: string; size: "sm" | "md"; color: "default" | "primary" | "secondary" };
  disabled?: boolean;
}`,
        },
      },
    },
    value: {
      description: "Current selected value (controlled component)",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    defaultValue: {
      description: "Default selected value (uncontrolled component)",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    onChange: {
      description: "Callback fired when selection changes",
      action: "changed",
      table: {
        type: { summary: "(value: string) => void" },
      },
    },
    onChangeValue: {
      description: "Alternative callback name for selection changes",
      action: "valueChanged",
      table: {
        type: { summary: "(value: string) => void" },
      },
    },
    fullWidth: {
      control: "boolean",
      description:
        "Whether the control should take full width of its container",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the entire control is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description: "Optional label for the segmented control",
      table: {
        type: { summary: "string" },
      },
    },
    urlQueryParamName: {
      control: "text",
      description:
        "URL Query Param Name. Used to synchronize the selected value with the URL.",
      table: {
        type: { summary: "string" },
      },
    },
    id: {
      control: "text",
      description: "Unique identifier",
      table: {
        type: { summary: "string" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the container",
      table: {
        type: { summary: "string" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
A flexible and accessible segmented control component that allows users to select one option from a set of segments, similar to radio buttons but with a more visual presentation.

## When to Use

- **View Switching**: Perfect for switching between different views or modes (day/week/month views)
- **Filter Options**: When you need to filter content by categories  
- **Tab-like Navigation**: As an alternative to traditional tabs with fewer options and with no page changes
- **Settings Toggles**: For switching between different application states or preferences

## Features

- ✅ **Single Selection**: Only one option can be selected at a time
- ✅ **Rich Content**: Support for icons, badges, and labels
- ✅ **Flexible Layout**: Full-width or auto-width layouts
- ✅ **Individual Control**: Disable specific options independently
- ✅ **URL Synchronization**: Automatic URL query parameter management
- ✅ **Accessibility**: Full keyboard navigation and screen reader support
- ✅ **Controlled/Uncontrolled**: Works in both modes

## Basic Usage

\`\`\`tsx
import { SegmentedControl } from '@bsport/kaizen-primitive-core';

// Simple usage
<SegmentedControl
  options={[
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ]}
  defaultValue="weekly"
  onChangeValue={(value) => console.log(value)}
/>

// With icons and badges
<SegmentedControl
  options={[
    { 
      label: "Inbox", 
      value: "inbox", 
      icon: "mail",
      badge: { text: "12", size: "sm", color: "primary" }
    },
    { 
      label: "Sent", 
      value: "sent", 
      icon: "send",
      badge: { text: "3", size: "sm", color: "default" }
    }
  ]}
  fullWidth
/>
\`\`\`

## URL Query Parameter Management

The SegmentedControl supports automatic synchronization with URL query parameters, enabling shareable URLs and persistent state across page reloads.

### Setup

\`\`\`tsx
<SegmentedControl
  id="viewMode"           // Used as query parameter name
  options={viewOptions}
  onChangeValue={handleChange}
/>
\`\`\`

### URL Structure
- **Component**: \`<SegmentedControl id="filter" ... />\`
- **URL**: \`https://example.com/page?filter=active\`
- **Multiple Controls**: \`?viewMode=weekly&category=sports&status=active\`

### Behavior
- **Page Load**: Reads query parameter and selects matching option
- **Selection Change**: Updates URL without page reload using \`history.replaceState\`
- **Browser Navigation**: Responds to back/forward button clicks
- **Invalid Values**: Ignores query parameters that don't match any option value

### Examples
\`\`\`tsx
// Single control with URL sync
<SegmentedControl
  id="view"
  options={[
    { label: "List", value: "list" },
    { label: "Grid", value: "grid" },
    { label: "Table", value: "table" }
  ]}
/>
// URL: ?view=grid

// Multiple controls
<SegmentedControl id="timeframe" options={timeOptions} />
<SegmentedControl id="category" options={categoryOptions} />
// URL: ?timeframe=monthly&category=reports

// Controlled component with URL sync
const [filter, setFilter] = useState('all');
<SegmentedControl
  id="filter"
  value={filter}
  onChangeValue={setFilter}
  options={filterOptions}
/>
\`\`\`

## SegmentedOption Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| \`value\` | \`string\` | ✅ | Unique identifier for the option |
| \`label\` | \`string\` | ❌ | Display text (can be omitted for icon-only) |
| \`icon\` | \`IconName\` | ❌ | Icon to display with the option |
| \`badge\` | \`BadgeProps\` | ❌ | Badge configuration object |
| \`disabled\` | \`boolean\` | ❌ | Whether this option is disabled |

## Badge Configuration

\`\`\`tsx
badge: {
  text: string;           // Badge text content
  size: "sm" | "md";      // Badge size
  color: "default" | "primary" | "secondary";  // Badge color variant
}
\`\`\`

## Variants

- **Text Only**: Simple labels without icons - clean and minimal
- **Icon + Text**: Icons with descriptive labels - provides visual context  
- **Icon Only**: Icons without labels - compact design (ensure proper accessibility)
- **With Badges**: Include notification counts or status indicators
- **Mixed States**: Some options disabled, others enabled
- **Full Width**: Options distribute evenly across container width
- **Auto Width**: Compact layout that fits content

## Accessibility

- **Keyboard Navigation**: Arrow keys, Space, and Enter for selection
- **Screen Readers**: Proper ARIA labels and role assignments (\`radiogroup\`, \`radio\`)
- **Focus Management**: Clear visual focus indicators and logical tab order
- **State Announcements**: Selection changes are announced to assistive technologies
- **Disabled States**: Properly communicated to screen readers

## Best Practices

### ✅ Do
- Use 2-5 options for optimal usability
- Provide clear, concise labels (2-3 words maximum)
- Use icons consistently across all options or none
- Consider the content width when using \`fullWidth\`
- Disable options that are temporarily unavailable
- Use URL sync for filters and view modes that users might want to share
- Ensure unique \`id\` values when using multiple controls with URL sync

### ❌ Don't  
- Use for more than 7 options (consider a Select dropdown instead)
- Mix labeled and unlabeled options inconsistently
- Use overly long labels that cause text wrapping
- Disable all options (disable the entire component instead)
- Use for navigation between different pages (use proper navigation components)
- Forget to handle URL parameter conflicts when using multiple controls

## Performance Considerations

- **URL Sync**: Only works in browser environment (client-side only)
- **State Management**: Controlled mode re-renders on every parent state change
- **Badge Updates**: Badge text changes trigger re-renders of affected options
- **Event Handling**: Uses passive event listeners for optimal performance

## Integration Examples

### With State Management
\`\`\`tsx
// Redux/Zustand integration
const filter = useSelector(state => state.filter);
const dispatch = useDispatch();

<SegmentedControl
  options={filterOptions}
  value={filter}
  onChangeValue={(value) => dispatch(setFilter(value))}
/>
\`\`\`

### With React Router
\`\`\`tsx
// URL state management with React Router
const [searchParams, setSearchParams] = useSearchParams();
const view = searchParams.get('view') || 'list';

<SegmentedControl
  options={viewOptions}
  value={view}
  onChangeValue={(value) => setSearchParams({ view: value })}
/>
\`\`\`

### With Form Libraries
\`\`\`tsx
// React Hook Form integration
const { control, watch } = useForm();
const watchedValue = watch('viewMode');

<Controller
  name="viewMode"
  control={control}
  render={({ field }) => (
    <SegmentedControl
      options={options}
      value={field.value}
      onChangeValue={field.onChange}
    />
  )}
/>
\`\`\`

## See Also
- [FormRadioGroup](./FormRadioGroup) - For traditional radio button layouts
- [Select](./Select) - For dropdown selection with many options
- [Button](./Button) - For single action buttons
- [Badge](./Badge) - For notification indicators
- [Icon](./Icon) - For available icon options
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SegmentedControl>;

const items: SegmentedOption[] = [
  { label: "Daily", value: "daily", icon: "alert-circle" },
  { label: "Weekly", value: "weekly", icon: "arrow-left" },
  { label: "Monthly", value: "monthly", icon: "book-closed" },
];

// Basic example
export const Basic: Story = {
  render: (args) => {
    const [customItems, setCustomItems] = useState<SegmentedOption[]>([
      ...items,
    ]);
    const [value, setValue] = useState<string>("weekly");
    const [newOption, setNewOption] = useState<SegmentedOption>({
      value: "",
      label: "",
      icon: undefined,
      badge: undefined,
      disabled: false,
    });

    const handleAddOption = (e: React.FormEvent) => {
      e.preventDefault();
      if (newOption.value) {
        setCustomItems([...customItems, { ...newOption }]);
        setNewOption({
          value: "",
          label: "",
          icon: undefined,
          badge: undefined,
          disabled: false,
        });
      }
    };

    const handleRemoveOption = (valueToRemove: string) => {
      setCustomItems(
        customItems.filter((item) => item.value !== valueToRemove),
      );
      if (value === valueToRemove) {
        setValue(customItems[0]?.value || "");
      }
    };

    const iconItems = Object.keys(icons).map((icon) => ({
      label: icon,
      id: icon,
    }));

    return (
      <div className="flex flex-col gap-lg">
        <div className="flex flex-col gap-md border-stroke-thin border rounded-md p-md">
          <Title htmlVariant="h4">Add New Segmented Option</Title>
          <form onSubmit={handleAddOption} className="flex flex-col gap-md">
            <div className="flex flex-row gap-md">
              <TextField
                id="option-value"
                label="Value (required)"
                placeholder="e.g., yearly"
                value={newOption.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewOption({ ...newOption, value: e.target.value })
                }
                required
              />
              <TextField
                id="option-label"
                label="Label (optional)"
                placeholder="e.g., Yearly"
                value={newOption.label || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewOption({ ...newOption, label: e.target.value })
                }
              />
              <Select
                className="min-w-[150px]"
                id="option-icon"
                label="Icon (optional)"
                items={iconItems as SelectProps["items"]}
                value={newOption.icon || ""}
                onSelect={(option: string) => {
                  console.log(option);
                  setNewOption({
                    ...newOption,
                    icon: option
                      ? (option as SegmentedOption["icon"])
                      : undefined,
                  });
                }}
              />
              <TextField
                id="option-badge-text"
                label="Badge Text (optional)"
                placeholder="e.g., New"
                value={newOption.badge?.text || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewOption({
                    ...newOption,
                    badge: e.target.value
                      ? {
                          text: e.target.value,
                          size: "sm" as const,
                          color: "default" as const,
                        }
                      : undefined,
                  })
                }
              />
              <div className="flex items-center gap-2xs">
                <input
                  type="checkbox"
                  id="option-disabled"
                  checked={newOption.disabled || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewOption({ ...newOption, disabled: e.target.checked })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="option-disabled"
                  className="text-sm font-medium"
                >
                  Disabled
                </label>
              </div>
            </div>

            <Button
              type="submit"
              color="main"
              size="md"
              intent="call-to-action"
              id="add-option-button"
              label="Add Option"
              disabled={!newOption.value}
            />
          </form>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Title htmlVariant="h4" className="font-semibold">
                Current Options ({customItems.length})
              </Title>
              <button
                onClick={() => setCustomItems([...items])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset to Default
              </button>
            </div>

            <div className="space-y-2">
              {customItems.map((item) => (
                <div
                  key={item.value}
                  className="w-fit flex items-center justify-between p-2 bg-gray-100 rounded"
                >
                  <div className="flex flex-row gap-sm items-center">
                    {item.icon && <Icon size="sm" icon={item.icon} />}
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge
                        size="sm"
                        text={item?.badge?.text || ""}
                        color="default"
                      />
                    )}
                    {item.disabled && (
                      <span className="text-xs bg-red-100 px-2 py-1 rounded">
                        disabled
                      </span>
                    )}
                  </div>
                  <Button
                    intent="flat"
                    color="critical"
                    iconRight="x-close"
                    size="lg"
                    onClick={() => handleRemoveOption(item.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-md border-stroke-thin border rounded-md p-md">
          <h4 className="font-semibold">SegmentedControl Preview</h4>
          <SegmentedControl
            id="custom-segmented-control-basic"
            options={customItems}
            value={value}
            onChangeValue={setValue}
            fullWidth={args.fullWidth}
          />
          <div className="text-sm text-gray-500">
            Selected value: <code>{value}</code>
          </div>
        </div>
      </div>
    );
  },
  args: {
    options: items,
    defaultValue: "weekly",
  },
};

// With icons
export const WithIcons: Story = {
  args: {
    options: [
      { label: "Daily", value: "daily", icon: "alert-circle" },
      { label: "Weekly", value: "weekly", icon: "arrow-left" },
      { label: "Monthly", value: "monthly", icon: "book-closed" },
    ],
    defaultValue: "weekly",
  },
};

// With icons and badges
export const WithIconsAndBadge: Story = {
  args: {
    options: [
      {
        label: "Tab",
        value: "tab1",
        icon: "atom-02",
        badge: { text: "10", size: "sm", color: "default" },
      },
      {
        label: "Tab",
        value: "tab2",
        icon: "atom-02",
        badge: { text: "10", size: "sm", color: "default" },
      },
      {
        label: "Tab",
        value: "tab3",
        icon: "atom-02",
        badge: { text: "10", size: "sm", color: "default" },
      },
    ],
    defaultValue: "tab1",
  },
};

// Without label
export const WithoutLabel: Story = {
  args: {
    options: [
      {
        value: "daily",
        icon: "alert-circle",
        badge: { text: "10", size: "sm", color: "default" },
      },
      {
        value: "weekly",
        icon: "arrow-left",
        badge: { text: "99+", size: "sm", color: "default" },
      },
      {
        value: "monthly",
        icon: "book-closed",
        badge: { text: "28", size: "sm", color: "default" },
      },
    ],
    defaultValue: "weekly",
  },
};

// Solo icons
export const SoloIcons: Story = {
  args: {
    options: [
      {
        value: "daily",
        icon: "alert-circle",
      },
      {
        value: "weekly",
        icon: "arrow-left",
      },
      {
        value: "monthly",
        icon: "book-closed",
      },
    ],
    defaultValue: "weekly",
    fullWidth: true,
  },
};

// Individual options disabled
export const IndividualDisabled: Story = {
  args: {
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2", disabled: true },
      { label: "Option 3", value: "opt3" },
    ],
    defaultValue: "opt1",
  },
};

// Controlled component example
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string>("profile");

    return (
      <div className="space-y-4">
        <SegmentedControl
          id="controlled-segmented-control-individual-disabled"
          options={[
            { label: "Profile", value: "profile", icon: "user-01" },
            {
              label: "Settings",
              value: "settings",
              icon: "dots-vertical",
            },
          ]}
          value={value}
          onChangeValue={setValue}
        />
        <div className="p-4 border rounded-md">
          {value === "profile" && <div>Profile Content</div>}
          {value === "settings" && <div>Settings Content</div>}
        </div>
        <div className="text-sm text-gray-500">
          Selected value: <code>{value}</code>
        </div>
      </div>
    );
  },
};

// Interactive example with content switching
export const InteractiveExample: Story = {
  render: () => {
    const [view, setView] = useState<string>("day");

    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Calendar View</h3>
        <SegmentedControl
          id="interactive-segmented-control-calendar-view"
          options={[
            { label: "Day", value: "day" },
            { label: "Week", value: "week" },
            { label: "Month", value: "month" },
            { label: "Year", value: "year", disabled: true },
          ]}
          value={view}
          onChangeValue={(option: string) => setView(option)}
        />

        <div className="p-4 border rounded-md min-h-[100px]">
          {view === "day" && <div>Day View Content</div>}
          {view === "week" && <div>Week View Content</div>}
          {view === "month" && <div>Month View Content</div>}
          {view === "year" && <div>Year View Content (Disabled)</div>}
        </div>
        <div className="text-sm text-gray-500">
          Selected view: <code>{view}</code>
        </div>
      </div>
    );
  },
};

// Add this new story to the existing SegmentedControl.stories.tsx file

// URL Query Parameters Testing
export const UrlQueryIntegration: Story = {
  render: () => {
    const [currentUrl, setCurrentUrl] = useState<string>("");
    const [viewMode, setViewMode] = useState<string>("day");
    const [category, setCategory] = useState<string>("sports");

    // Update URL display whenever it changes
    useEffect(() => {
      const updateUrl = () => {
        if (typeof window !== "undefined") {
          setCurrentUrl(window.location.href);
        }
      };

      updateUrl();
      window.addEventListener("popstate", updateUrl);

      // Also listen for URL changes via history.replaceState
      const originalReplaceState = window.history.replaceState;
      window.history.replaceState = function (...args) {
        originalReplaceState.apply(window.history, args);
        updateUrl();
      };

      return () => {
        window.removeEventListener("popstate", updateUrl);
        window.history.replaceState = originalReplaceState;
      };
    }, []);

    const getCurrentQueryParams = () => {
      if (typeof window === "undefined") return {};
      const params = new URLSearchParams(window.location.search);
      const result: Record<string, string> = {};
      params.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    };

    const [queryParams, setQueryParams] = useState<Record<string, string>>({});

    useEffect(() => {
      setQueryParams(getCurrentQueryParams());
    }, [currentUrl]);

    const handleViewModeChange = (value: string) => {
      setViewMode(value);
      setQueryParams(getCurrentQueryParams());
    };

    const handleCategoryChange = (value: string) => {
      setCategory(value);
      setQueryParams(getCurrentQueryParams());
    };

    const clearAllParams = () => {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.search = "";
        window.history.replaceState(null, "", url.toString());
        setCurrentUrl(window.location.href);
        setQueryParams({});
      }
    };

    const setExampleParams = () => {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("viewMode-segmented-control", "week");
        url.searchParams.set("category-segmented-control", "technology");
        window.history.replaceState(null, "", url.toString());
        setCurrentUrl(window.location.href);
        setQueryParams(getCurrentQueryParams());
      }
    };

    return (
      <div className="flex flex-col gap-lg">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            🧪 URL Query Parameters Testing
          </h3>
          <p className="text-blue-700 text-sm mb-4">
            This story demonstrates how SegmentedControl integrates with URL
            query parameters. Watch the URL change as you select different
            options, and try refreshing the page to see how the selections
            persist.
          </p>

          <div className="flex gap-sm">
            <Button
              intent="default"
              color="main"
              size="sm"
              onClick={clearAllParams}
              label="Clear All Params"
            />
            <Button
              intent="call-to-action"
              color="main"
              size="sm"
              onClick={setExampleParams}
              label="Set Example Params"
            />
          </div>
        </div>

        {/* Current URL Display */}
        <div className="bg-gray-50 border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Current URL:</h4>
          <code className="text-sm bg-white p-2 rounded border block break-all">
            {currentUrl}
          </code>

          {Object.keys(queryParams).length > 0 && (
            <div className="flex flex-col gap-md">
              <h5 className="font-medium mb-2">Query Parameters:</h5>
              <div className="space-y-1">
                {Object.entries(queryParams)
                  .filter(
                    (_entry) =>
                      _entry[0] === "viewMode" || _entry[0] === "category",
                  )
                  .map(([key, value]) => (
                    <div key={key} className="flex gap-2 text-sm">
                      <span className="font-mono text-[#2466d6] px-2 py-1 rounded">
                        {key}
                      </span>
                      <span>=</span>
                      <span className="font-mono text-[#c22c21] px-2 py-1 rounded">
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* SegmentedControl Examples */}
        <div className="flex flex-row gap-lg">
          {/* View Mode Selector */}
          <div className="flex flex-col gap-md">
            <div>
              <h4 className="font-semibold">View Mode Selector</h4>
              <p className="text-sm text-gray-600">
                Query parameter: <code>viewMode</code>
              </p>
            </div>

            <SegmentedControl
              id="viewMode"
              urlQueryParamName="viewMode-segmented-control"
              options={[
                { label: "Day", value: "day", icon: "calendar" },
                { label: "Week", value: "week", icon: "calendar" },
                { label: "Month", value: "month", icon: "calendar" },
                { label: "Year", value: "year", icon: "calendar" },
              ]}
              value={viewMode}
              onChangeValue={handleViewModeChange}
              fullWidth
            />

            <div className="p-3 bg-gray-100 rounded">
              <p className="text-sm">
                Selected:{" "}
                <code className="bg-white px-2 py-1 rounded">{viewMode}</code>
              </p>
            </div>
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-md">
            <div>
              <h4 className="font-semibold">Category Filter</h4>
              <p className="text-sm text-gray-600">
                Query parameter: <code>category</code>
              </p>
            </div>

            <SegmentedControl
              id="category"
              urlQueryParamName="category-segmented-control"
              options={[
                {
                  label: "Sports",
                  value: "sports",
                  icon: "video-recorder",
                  badge: { text: "12", size: "sm", color: "main" },
                },
                {
                  label: "Tech",
                  value: "technology",
                  icon: "archive",
                  badge: { text: "8", size: "sm", color: "main" },
                },
                {
                  label: "News",
                  value: "news",
                  icon: "edit-02",
                  badge: { text: "24", size: "sm", color: "default" },
                },
              ]}
              value={category}
              onChangeValue={handleCategoryChange}
            />

            <div className="p-3 bg-gray-100 rounded">
              <p className="text-sm">
                Selected:{" "}
                <code className="bg-white px-2 py-1 rounded">{category}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">
            🧭 Testing Instructions
          </h4>
          <div className="text-yellow-700 text-sm space-y-2">
            <p>
              <strong>1. URL Updates:</strong> Click different options and watch
              the URL change in real-time
            </p>
            <p>
              <strong>2. Page Refresh:</strong> Refresh the page and see how
              selections are preserved
            </p>
            <p>
              <strong>3. Direct Navigation:</strong> Manually add query
              parameters to the URL (e.g.,{" "}
              <code>?viewMode=week&category=technology</code>)
            </p>
            <p>
              <strong>4. Browser Navigation:</strong> Use browser back/forward
              buttons to test navigation
            </p>
            <p>
              <strong>5. Multiple Controls:</strong> Both controls work
              independently with their own query parameters
            </p>
            <p>
              <strong>6. Invalid Values:</strong> Try setting invalid query
              values - the component should ignore them
            </p>
          </div>
        </div>

        {/* Content based on selections */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Dynamic Content</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-[#2466d6]">
                View Mode: <span className="text-[#c22c21]">{viewMode}</span>
              </h3>{" "}
              <div className="mt-2 p-3 bg-blue-50 rounded">
                {viewMode === "day" &&
                  "📅 Showing daily view with hourly breakdown"}
                {viewMode === "week" &&
                  "📊 Showing weekly view with daily summaries"}
                {viewMode === "month" &&
                  "🗓️ Showing monthly view with weekly summaries"}
                {viewMode === "year" &&
                  "📈 Showing yearly view with monthly summaries"}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-[#2466d6]">
                Category: <span className="text-[#c22c21]">{category}</span>
              </h3>
              <div className="mt-2 p-3 bg-green-50 rounded">
                {category === "sports" && "⚽ Sports content and live scores"}
                {category === "technology" && "💻 Latest tech news and reviews"}
                {category === "news" && "📰 Breaking news and current events"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Uncontrolled with URL Query (simpler example)
export const UncontrolledWithUrlQuery: Story = {
  render: () => {
    const [currentUrl, setCurrentUrl] = useState<string>("");

    useEffect(() => {
      if (typeof window !== "undefined") {
        setCurrentUrl(window.location.href);

        const handleUrlChange = () => setCurrentUrl(window.location.href);
        window.addEventListener("popstate", handleUrlChange);

        // Override replaceState to catch programmatic URL changes
        const originalReplaceState = window.history.replaceState;
        window.history.replaceState = function (...args) {
          originalReplaceState.apply(window.history, args);
          handleUrlChange();
        };

        return () => {
          window.removeEventListener("popstate", handleUrlChange);
          window.history.replaceState = originalReplaceState;
        };
      }
    }, []);

    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            Simple URL Query Integration
          </h3>
          <p className="text-green-700 text-sm">
            This is an uncontrolled SegmentedControl that automatically syncs
            with URL query parameter <code>filter</code>. Try refreshing the
            page or sharing the URL!
          </p>
        </div>

        <SegmentedControl
          id="filter"
          urlQueryParamName="filter-segmented-control"
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Completed", value: "completed" },
            { label: "Archived", value: "archived", disabled: true },
          ]}
          defaultValue="all"
        />

        <div className="text-sm text-gray-600">
          <strong>Current URL:</strong>
          <br />
          <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
            {currentUrl}
          </code>
        </div>
      </div>
    );
  },
};
