import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import ListLayout from "#src/components/ListLayout";

import DetailDrawer from "./DetailDrawer";

/**
 * DetailDrawer - A transient, side-mounted container for viewing or minimally editing a selected item within a broader context.
 *
 * The drawer slides in from the right side on desktop and from the bottom on mobile, providing a non-blocking overlay
 * that keeps the main page visible and interactive. It's designed for quick actions, lightweight forms, or displaying
 * metadata without disrupting the user's workflow.
 *
 * @example
 * // Basic Usage in Storybook
 * import DetailDrawer from '#src/components/DetailDrawer';
 *
 * export const Default = () => {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)} label="Open Drawer" />
 *       <DetailDrawer
 *         id="example-drawer"
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *       >
 *         <h3>Item Details</h3>
 *         <p>Content goes here...</p>
 *       </DetailDrawer>
 *     </>
 *   );
 * };
 *
 * ### Component Props
 * | Prop            | Type                | Required | Description                                    |
 * |-----------------|---------------------|----------|------------------------------------------------|
 * | id              | string              | ✓        | Unique identifier for the drawer DOM element  |
 * | isOpen          | boolean             | ✓        | Controls whether the drawer is visible        |
 * | onClose         | () => void          | ✓        | Function called when drawer should close      |
 * | children        | ReactNode           | -        | Custom content to render within the drawer    |
 * | onPrevious  | () => void          | -        | Function for previous navigation         |
 * | onNext      | () => void          | -        | Function for next navigation             |
 * | className       | string              | -        | Additional CSS classes for customization      |
 *
 * ### Key Features
 * - **Responsive Design**: Slides from right (desktop) or bottom (mobile)
 * - **Non-blocking**: Main page remains visible and interactive
 * - **Keyboard Accessible**: Escape key closes drawer
 * - **Navigation Controls**: Optional previous/next item buttons
 * - **Lightweight**: Focused on single-object interactions
 * - **Visual Separation**: Elevated shadow without backdrop
 *
 * ### Layout Behavior
 * - **Desktop**: Fixed width (420px), slides from right, full height
 * - **Mobile**: Full width, slides from bottom, maximum 90% height
 * - **Animation**: Smooth CSS transitions for open/close states
 * - **Z-index**: High z-index (50) to overlay content
 *
 * ### Integration Patterns
 * - **List Selection**: Commonly used with ListLayout for item details
 * - **Form Editing**: Lightweight forms with ≤5 fields for quick edits
 * - **Metadata Display**: Show additional information about selected items
 * - **Action Panels**: Quick actions without leaving current context
 *
 * @see {@link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-detaildrawer--docs|Storybook Docs}
 *
 * @param {string} id - Unique identifier for the drawer DOM element
 * @param {boolean} isOpen - Controls whether the drawer is visible
 * @param {() => void} onClose - Function called when drawer should close
 * @param {ReactNode} [children] - Custom content to render within the drawer
 * @param {[WithTooltip<ButtonProps>, WithTooltip<ButtonProps>]} [actionsConfig] - Custom tupple of 2 actions to add at the end of the Detail Drawer component
 * @param {string} [className] - Additional CSS classes for customization
 *
 * @remarks
 * - Drawer only closes via close button or Escape key (no outside click)
 * - Main page scrolling and interactions remain fully functional
 * - Navigation buttons only appear when corresponding functions are provided
 * - Designed for transient interactions, not persistent UI elements
 */
const meta: Meta<typeof DetailDrawer> = {
  component: DetailDrawer,
  title: "Components/DetailDrawer",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A transient, side-mounted container for viewing or minimally editing a selected item within a broader context.

The drawer slides in from the right side on desktop and from the bottom on mobile, providing a non-blocking overlay that keeps the main page visible and interactive.

---

## Usage

\`\`\`jsx
// Basic implementation
const [isOpen, setIsOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

return (
  <>
    <ItemList onItemSelect={(item) => {
      setSelectedItem(item);
      setIsOpen(true);
    }} />
    <DetailDrawer
      id="item-drawer"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ItemDetails item={selectedItem} />
    </DetailDrawer>
  </>
);
\`\`\`

## With Navigation Controls

\`\`\`jsx
// With previous/next navigation
<DetailDrawer
  id="product-drawer"
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  actionsConfig={[{
    id: "previous-button",
    label: "Previous",
    onClick: () => selectPreviousProduct(),
    iconLeft: "chevron-left",
    intent: "default"
    tooltipProps: {
      label: "Previous Product",
      placement: "bottom-left",
    },
  }, {
    id: "next-button",
    label: "Next",
    onClick: () => selectNextProduct(),
    iconLeft: "chevron-right",
    intent: "default"
    tooltipProps: {
      label: "Previous Product",
      placement: "bottom-left",
    },
  }]}
>
  <ProductDetails product={selectedProduct} />
</DetailDrawer>
\`\`\`

## Integration with Lists

\`\`\`jsx
// Common pattern with ListLayout
const handleItemClick = (item) => {
  setSelectedItem(item);
  setIsDrawerOpen(true);
};

return (
  <ListLayout>
    <ListLayout.Content>
      {items.map(item => (
        <ListItem
          key={item.id}
          onClick={() => handleItemClick(item)}
          selected={selectedItem?.id === item.id}
        >
          {item.name}
        </ListItem>
      ))}
    </ListLayout.Content>
  </ListLayout>
);
\`\`\`

---

## Component Props

- **id**: Unique identifier for the drawer DOM element (required)
- **isOpen**: Controls whether the drawer is visible (required)
- **onClose**: Function called when drawer should close (required)
- **children**: Custom content to render within the drawer
- **actionsConfig**: Array of action button configurations
- **className**: Additional CSS classes for customization

---

## Behavior

- **Responsive**: Slides from right on desktop, bottom on mobile
- **Non-blocking**: Main page remains interactive (no backdrop)
- **Keyboard**: Escape key closes drawer
- **Navigation**: Previous/next buttons appear when functions provided
- **Animation**: Smooth CSS transitions for open/close states
- **Focus**: Maintains accessibility without focus trapping

---

## Design Principles

- **Transient**: Intended for temporary interactions
- **Context-aware**: Maintains visual connection to triggering element
- **Non-modal**: Doesn't block access to underlying page
- **Focused**: Scoped to single-object interactions
- **Lightweight**: Designed for quick actions and minimal forms

[See full docs](https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-detaildrawer--docs)
        `,
      },
    },
  },
  argTypes: {
    id: {
      control: "text",
      description: "Unique identifier for the drawer DOM element",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    isOpen: {
      control: "boolean",
      description: "Controls whether the drawer is visible",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onClose: {
      action: "closed",
      description: "Function called when drawer should close",
      table: {
        type: { summary: "() => void" },
      },
    },
    children: {
      control: { type: "text" },
      description: "Custom content to render within the drawer",
      table: {
        type: { summary: "ReactNode" },
        defaultValue: { summary: "undefined" },
      },
    },
    actionsConfig: {
      description: "Tupple of 2 actions buttons configurations",
      table: {
        type: {
          summary: "[WithTooltip<ButtonProps>, WithTooltip<ButtonProps>]",
        },
        defaultValue: { summary: "undefined" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes for customization",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DetailDrawer>;

export const Primary: Story = {
  name: "DetailDrawer",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-md min-h-[400px]">
        <Button
          intent="default"
          color="main"
          size="md"
          label="Open Drawer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <DetailDrawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="space-y-md">
            <h2 className="text-lg font-semibold">Item Details</h2>
            <Body size="sm" color="weak">
              This is a simple detail drawer example. You can add any content
              here, such as forms, text, or other components.
            </Body>
            <Button
              intent="call-to-action"
              color="main"
              size="md"
              label="Action Button"
              onClick={() => console.log("Action clicked")}
            />
          </div>
        </DetailDrawer>
      </div>
    );
  },
};

type FakeUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  lastLogin: string;
};

export const WithListIntegration: Story = {
  name: "DetailDrawer with List Integration",
  render: () => {
    const [selectedUser, setSelectedUser] = useState<FakeUser | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const users = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin",
        status: "Active",
        department: "Engineering",
        lastLogin: "2024-01-15",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Manager",
        status: "Active",
        department: "Design",
        lastLogin: "2024-01-14",
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        role: "Developer",
        status: "Inactive",
        department: "Engineering",
        lastLogin: "2024-01-10",
      },
      {
        id: 4,
        name: "Alice Brown",
        email: "alice.brown@example.com",
        role: "Designer",
        status: "Active",
        department: "Design",
        lastLogin: "2024-01-15",
      },
    ];

    const handleUserClick = (user: FakeUser) => {
      if (selectedUser?.id === user.id) {
        setIsDrawerOpen(false);
        setSelectedUser(null);
      } else {
        setSelectedUser(user);
        setIsDrawerOpen(true);
      }
    };

    const handleDrawerClose = () => {
      setIsDrawerOpen(false);
    };

    const handleSelectNextUser = () => {
      const currentIndex = users.findIndex((u) => u.id === selectedUser?.id);
      const nextIndex = (currentIndex + 1) % users.length;
      setSelectedUser(users[nextIndex]);
    };

    const handleSelectPreviousUser = () => {
      const currentIndex = users.findIndex((u) => u.id === selectedUser?.id);
      const previousIndex = (currentIndex - 1 + users.length) % users.length;
      setSelectedUser(users[previousIndex]);
    };

    return (
      <div className="h-screen">
        <ListLayout>
          <ListLayout.Header pageTitle="User Management" />

          <ListLayout.Content>
            <div className="p-md space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className={`p-md border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedUser?.id === user.id
                      ? "bg-surface-action-main-selected-rest border-stroke-main shadow-sm"
                      : "bg-surface-default-elevated hover:bg-surface-action-default-weak-hovered border-stroke-default"
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleUserClick(user);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-sm mb-xs">
                        <h3 className="font-semibold text-onsurface-default-strong">
                          {user.name}
                        </h3>
                        <span
                          className={`px-xs py-2xs text-xs rounded-full ${
                            user.status === "Active"
                              ? "bg-surface-status-positive-weak text-onsurface-status-positive-weak"
                              : "bg-surface-status-neutral-weak text-onsurface-status-neutral-weak"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                      <Body size="sm" color="weak">
                        {user.email}
                      </Body>
                      <Body size="sm" color="weaker">
                        {user.department} • {user.role}
                      </Body>
                    </div>
                    <div className="text-right">
                      <Body size="sm" color="weak">
                        Last login: {user.lastLogin}
                      </Body>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ListLayout.Content>
        </ListLayout>

        <DetailDrawer
          id="user-detail-drawer"
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          actionsConfig={[
            {
              id: "previous-user",
              onClick: handleSelectPreviousUser,
              iconLeft: "chevron-left",
              intent: "default",
              size: "sm",
              color: "main",
              label: "Previous User",
              tooltipProps: {
                label: "Previous User",
                placement: "bottom-left",
              },
            },
            {
              id: "next-user",
              onClick: handleSelectNextUser,
              iconLeft: "chevron-right",
              intent: "default",
              size: "sm",
              color: "main",
              label: "Next User",
              tooltipProps: {
                label: "Next User",
                placement: "bottom-right",
              },
            },
          ]}
        >
          <h2 className="text-lg font-semibold">
            {selectedUser?.name || "User Details"}
          </h2>
          <Body size="sm" color="weak">
            {selectedUser
              ? `${selectedUser.role} at ${selectedUser.department}`
              : "Select a user to view details."}
          </Body>
          <div className="mt-md">
            <Body size="sm" color="weak">
              Email: {selectedUser?.email || "N/A"}
            </Body>
            <Body size="sm" color="weak">
              Last Login: {selectedUser?.lastLogin || "N/A"}
            </Body>
            <Body size="sm" color="weak">
              Status: {selectedUser?.status || "N/A"}
            </Body>
          </div>
        </DetailDrawer>
      </div>
    );
  },
};

export const WithCustomContent: Story = {
  name: "DetailDrawer with Custom Content",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const user = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Senior Developer",
      department: "Engineering",
      joinDate: "2022-03-15",
      projects: 12,
      completedTasks: 89,
    };

    return (
      <div className="p-md min-h-[400px]">
        <Button
          intent="default"
          color="main"
          size="md"
          label="View User Profile"
          onClick={() => setIsOpen(!isOpen)}
        />

        <DetailDrawer
          id="user-detailed-view"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="space-y-lg">
            <div className="flex items-center gap-md">
              <div className="w-16 h-16 rounded-full bg-surface-action-main-weak flex items-center justify-center">
                <span className="text-lg font-bold text-onsurface-action-main-onweak">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <Body size="sm" color="weak">
                  {user.department}
                </Body>
                <Body size="sm" color="weaker">
                  Joined {user.joinDate}
                </Body>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-md">
              <div className="text-center p-md bg-surface-default-elevated rounded-lg">
                <div className="text-2xl font-bold text-onsurface-default-strong">
                  {user.projects}
                </div>
                <Body size="sm" color="weak">
                  Active Projects
                </Body>
              </div>
              <div className="text-center p-md bg-surface-default-elevated rounded-lg">
                <div className="text-2xl font-bold text-onsurface-default-strong">
                  {user.completedTasks}
                </div>
                <Body size="sm" color="weak">
                  Completed Tasks
                </Body>
              </div>
            </div>

            <div className="space-y-sm">
              <h4 className="font-semibold">Quick Actions</h4>
              <div className="space-y-xs">
                <Button
                  intent="flat"
                  color="main"
                  size="sm"
                  label="Send Message"
                  iconLeft="save"
                  fullWidth
                />
                <Button
                  intent="flat"
                  color="default"
                  size="sm"
                  label="View Projects"
                  iconLeft="archive"
                  fullWidth
                />
                <Button
                  intent="flat"
                  color="onstrong"
                  size="sm"
                  label="Performance Review"
                  iconLeft="upload-cloud-02"
                  fullWidth
                />
              </div>
            </div>

            <div className="space-y-sm">
              <h4 className="font-semibold">Contact Information</h4>
              <div className="space-y-xs">
                <div className="flex justify-between">
                  <Body size="sm" color="weak">
                    Email
                  </Body>
                  <Body size="sm">{user.email}</Body>
                </div>
                <div className="flex justify-between">
                  <Body size="sm" color="weak">
                    Department
                  </Body>
                  <Body size="sm">{user.department}</Body>
                </div>
                <div className="flex justify-between">
                  <Body size="sm" color="weak">
                    Role
                  </Body>
                  <Body size="sm">{user.role}</Body>
                </div>
              </div>
            </div>
          </div>
        </DetailDrawer>
      </div>
    );
  },
};

export const ResponsiveDemo: Story = {
  name: "DetailDrawer Responsive Behavior",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-md min-h-[400px]">
        <div>
          <div>
            <h2 className="text-lg font-bold mb-sm">Responsive Behavior</h2>
            <Body size="sm" color="weak">
              The drawer slides from the right on desktop and from the bottom on
              mobile. Resize your browser window to see the difference.
            </Body>
          </div>

          <Button
            intent="call-to-action"
            color="main"
            size="md"
            label="Test Responsive Drawer"
            onClick={() => setIsOpen(!isOpen)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md p-md bg-surface-default-elevated rounded-lg">
            <div>
              <h3 className="font-semibold mb-xs">Desktop Behavior</h3>
              <Body size="sm" color="weak">
                • Slides in from the right • Fixed width (420px) • Full height •
                Overlay with shadow
              </Body>
            </div>
            <div className="flex flex-col gap-md">
              <h3 className="font-semibold mb-xs">Mobile Behavior</h3>
              <Body size="lg" htmlVariant="p">
                CurrentWidth : {window.innerWidth}px
              </Body>
              <Body size="lg" htmlVariant="p">
                Breakpoint width to go in mobile mode: 1024px
              </Body>
              <Body size="sm" color="weak">
                • Slides up from bottom • Full width • Maximum 90% height •
                Overlay with shadow
              </Body>
            </div>
          </div>
        </div>

        <DetailDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          id="responsive-drawer"
        >
          <div className="space-y-md">
            <h2 className="text-lg font-semibold">Responsive Detail Drawer</h2>
            <Body size="sm" color="weak">
              This drawer adapts to screen size, sliding in from the right on
              desktop and from the bottom on mobile.
            </Body>
            <div className="p-md bg-surface-default-elevated rounded-lg">
              <h4 className="font-semibold mb-sm">Current Behavior</h4>
              <Body size="sm" color="weak">
                Resize your browser window to see how the drawer animation
                changes between desktop and mobile breakpoints.
              </Body>
            </div>
          </div>
        </DetailDrawer>
      </div>
    );
  },
};
