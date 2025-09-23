import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import type { IconName } from "../Icon";
import ToggleButton from "./ToggleButton";

/**
 * ToggleButton
 *
 * A flexible and accessible toggle button component that represents a binary choice or state switch,
 * perfect for enabling/disabling features, switching between modes, or controlling application settings.
 *
 * ## Features
 * - Binary state management (on/off, enabled/disabled)
 * - Dynamic labels and icons that change based on state (unchecked/checked configs)
 * - Automatic icon display with smart positioning
 * - Multiple size variants (sm, md)
 * - Full width option for layout flexibility
 * - Controlled and uncontrolled modes
 * - Full accessibility support with ARIA attributes
 * - Keyboard navigation (Space/Enter to toggle)
 * - Visual feedback for hover, focus, and disabled states
 * - Flexible styling with className support
 *
 * ## Usage
 * ```tsx
 * <ToggleButton
 *   id="notifications"
 *   uncheckedConfig={{ label: "Enable Notifications" }}
 *   checkedConfig={{ label: "Notifications Enabled", icon: "bell-03" }}
 *   checked={isEnabled}
 *   onChange={(checked) => setIsEnabled(checked)}
 * />
 * ```
 */
const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
  title: "Components/ToggleButton",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A toggle button component that switches between checked and unchecked states with configurable labels, icons, and tooltips for each state.

### Key Features
- **Dual State Configuration**: Separate \`checkedConfig\` and \`uncheckedConfig\` objects for complete state customization
- **Icons Support**: Optional icons for either or both states
- **Tooltips**: Individual tooltip configuration for each state  
- **Multiple Sizes**: Supports all Button component sizes
- **Full Width**: Optional full-width layout
- **Controlled/Uncontrolled**: Works in both controlled and uncontrolled modes
- **Accessibility**: Full keyboard and screen reader support

### API Structure
Each state is configured using a config object with:
- \`label\`: Required display text
- \`icon\`: Optional icon name (from Icon component)
- \`tooltipConfig\`: Optional tooltip configuration

### Usage Examples
\`\`\`tsx
// Basic toggle
<ToggleButton
  id="basic-toggle"
  checkedConfig={{ label: "On" }}
  uncheckedConfig={{ label: "Off" }}
/>

// With icons and tooltips
<ToggleButton
  id="advanced-toggle"
  checkedConfig={{
    label: "Connected",
    icon: "wifi",
    tooltipConfig: { label: "Click to disconnect", placement: "top" }
  }}
  uncheckedConfig={{
    label: "Disconnected",
    tooltipConfig: { label: "Click to connect", placement: "top" }
  }}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Controlled checked state. If undefined, component is uncontrolled.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "undefined" },
      },
    },
    checkedConfig: {
      control: "object",
      description: "Configuration object for the checked state",
      table: {
        type: {
          summary:
            "{ label: string; icon?: IconName; tooltipConfig?: TooltipProps }",
        },
      },
    },
    uncheckedConfig: {
      control: "object",
      description: "Configuration object for the unchecked state",
      table: {
        type: {
          summary:
            "{ label: string; icon?: IconName; tooltipConfig?: TooltipProps }",
        },
      },
    },
    size: {
      control: { type: "radio" },
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the toggle button (matches Button component)",
      table: {
        type: { summary: "ButtonProps['size']" },
        defaultValue: { summary: "md" },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "Whether the button should take full width of its container",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    id: {
      control: "text",
      description: "Unique identifier for the button element (required)",
      table: {
        type: { summary: "string" },
      },
    },
    onChange: {
      description: "Callback fired when checked state changes",
      table: {
        type: {
          summary: "({ event: MouseEvent, checked: boolean }) => void",
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ToggleButton>;

// Primary story (default)
export const Primary: Story = {
  args: {
    id: "primary-toggle",
    checked: false,
    checkedConfig: {
      label: "Feature Enabled",
      icon: "check" as IconName,
    },
    uncheckedConfig: {
      label: "Feature Disabled",
    },
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The primary example showing a toggle button with icon in checked state.",
      },
    },
  },
};

// Basic usage
export const Basic: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked || false);
    return (
      <div className="flex flex-col gap-lg">
        <div className="flex flex-col gap-md border-stroke-thin border rounded-md p-md">
          <h3 className="font-semibold">Basic Toggle Button</h3>
          <p className="text-sm text-gray-600">
            Simple toggle button with state management. Click to toggle between
            enabled/disabled states. Notice how the label changes based on the
            state.
          </p>
          <ToggleButton
            {...args}
            checked={checked}
            onChange={({ checked }) => setChecked(checked)}
          />
          <div className="text-sm text-gray-500">
            Current state:{" "}
            <code className="bg-gray-100 px-1 rounded">
              {checked ? "enabled" : "disabled"}
            </code>
          </div>
        </div>
      </div>
    );
  },
  args: {
    id: "basic-toggle",
    checked: false,
    checkedConfig: {
      label: "Enabled",
    },
    uncheckedConfig: {
      label: "Disabled",
    },
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Simple toggle button with just text labels for each state.",
      },
    },
  },
};

// All sizes demonstration
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-md items-start">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ToggleButton
          key={size}
          id={`${size}-toggle`}
          checked={false}
          checkedConfig={{
            label: `${size.toUpperCase()} Enabled`,
            icon: "check" as IconName,
          }}
          uncheckedConfig={{
            label: `${size.toUpperCase()} Disabled`,
          }}
          size={size}
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Toggle buttons in all available sizes (xs, sm, md, lg, xl).",
      },
    },
  },
};

// With icons in different configurations
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <div>
        <h4 className="text-sm font-medium mb-2">Icon only when checked:</h4>
        <ToggleButton
          id="icon-checked-only"
          checked={false}
          checkedConfig={{
            label: "Connected",
            icon: "wifi" as IconName,
          }}
          uncheckedConfig={{
            label: "Disconnected",
          }}
          size="md"
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">
          Different icons for each state:
        </h4>
        <ToggleButton
          id="icon-both-states"
          checked={true}
          checkedConfig={{
            label: "Online",
            icon: "wifi" as IconName,
          }}
          uncheckedConfig={{
            label: "Offline",
            icon: "wifi-off" as IconName,
          }}
          size="md"
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Icon only when unchecked:</h4>
        <ToggleButton
          id="icon-unchecked-only"
          checked={false}
          checkedConfig={{
            label: "Notifications On",
          }}
          uncheckedConfig={{
            label: "Notifications Off",
            icon: "bell-off" as IconName,
          }}
          size="md"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Examples showing different icon configurations for checked and unchecked states.",
      },
    },
  },
};

// With tooltips
export const WithTooltips: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <ToggleButton
        id="tooltip-toggle"
        checked={false}
        checkedConfig={{
          label: "Auto-save On",
          icon: "save" as IconName,
          tooltipConfig: {
            label: "Auto-save is currently enabled. Click to disable.",
            placement: "top",
          },
        }}
        uncheckedConfig={{
          label: "Auto-save Off",
          tooltipConfig: {
            label: "Auto-save is currently disabled. Click to enable.",
            placement: "top",
          },
        }}
        size="md"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Toggle button with different tooltips for each state providing contextual help.",
      },
    },
  },
};

// Full width demonstration
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <ToggleButton
        id="fullwidth-toggle"
        checked={false}
        checkedConfig={{
          label: "Full Width Enabled",
          icon: "check" as IconName,
        }}
        uncheckedConfig={{
          label: "Full Width Disabled",
        }}
        size="md"
        fullWidth
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "A toggle button that takes the full width of its container.",
      },
    },
  },
};

// Disabled states
export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <div>
        <h4 className="text-sm font-medium mb-2">Disabled while unchecked:</h4>
        <ToggleButton
          id="disabled-unchecked"
          checked={false}
          checkedConfig={{ label: "Enabled" }}
          uncheckedConfig={{ label: "Disabled" }}
          size="md"
          disabled
        />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Disabled while checked:</h4>
        <ToggleButton
          id="disabled-checked"
          checked={true}
          checkedConfig={{
            label: "Enabled",
            icon: "check" as IconName,
          }}
          uncheckedConfig={{ label: "Disabled" }}
          size="md"
          disabled
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Toggle buttons in disabled state, showing both checked and unchecked disabled states.",
      },
    },
  },
};

// Controlled vs Uncontrolled
export const ControlledVsUncontrolled: Story = {
  render: () => {
    const [controlledValue, setControlledValue] = useState(false);

    return (
      <div className="flex flex-col gap-lg">
        <div>
          <h4 className="text-sm font-medium mb-2">
            Controlled (external state management):
          </h4>
          <div className="flex items-center gap-md">
            <ToggleButton
              id="controlled-toggle"
              checked={controlledValue}
              checkedConfig={{
                label: "Controlled On",
                icon: "check" as IconName,
              }}
              uncheckedConfig={{
                label: "Controlled Off",
              }}
              size="md"
              onChange={({ checked }) => setControlledValue(checked)}
            />
            <button
              onClick={() => setControlledValue(!controlledValue)}
              className="text-sm text-blue-600 underline"
            >
              Toggle externally
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">
            Uncontrolled (internal state management):
          </h4>
          <ToggleButton
            id="uncontrolled-toggle"
            checkedConfig={{
              label: "Uncontrolled On",
              icon: "check" as IconName,
            }}
            uncheckedConfig={{
              label: "Uncontrolled Off",
            }}
            size="md"
            onChange={({ checked }) =>
              console.log("Uncontrolled value:", checked)
            }
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Comparison between controlled (with checked prop) and uncontrolled (without checked prop) usage patterns.",
      },
    },
  },
};

// Interactive playground
export const InteractivePlayground: Story = {
  render: (args) => {
    const [toggleState, setToggleState] = useState(false);
    return (
      <ToggleButton
        {...args}
        size={args.size || "md"}
        checkedConfig={args.checkedConfig}
        uncheckedConfig={args.uncheckedConfig}
        id={args.id || "playground-toggle"}
        checked={toggleState}
        onChange={({ checked: newChecked }) => setToggleState(newChecked)}
      />
    );
  },
  args: {
    id: "primary-toggle",
    checked: false,
    checkedConfig: {
      label: "Active",
      icon: "check" as IconName,
      tooltipConfig: {
        label: "Click to deactivate",
        placement: "top",
      },
    },
    uncheckedConfig: {
      label: "Inactive",
      tooltipConfig: {
        label: "Click to activate",
        placement: "top",
      },
    },
    size: "md",
    fullWidth: false,
    disabled: false,
  },
  argTypes: {
    checkedConfig: {
      control: "object",
      description:
        "Configuration for checked state: { label: string, icon?: IconName, tooltipConfig?: TooltipProps }",
    },
    uncheckedConfig: {
      control: "object",
      description:
        "Configuration for unchecked state: { label: string, icon?: IconName, tooltipConfig?: TooltipProps }",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground to test different toggle button configurations. Use the controls panel to modify props and see changes in real-time.",
      },
    },
  },
};
