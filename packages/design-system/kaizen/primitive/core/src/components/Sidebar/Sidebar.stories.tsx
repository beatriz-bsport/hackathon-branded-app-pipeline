import type { Meta, StoryObj } from "@storybook/react-vite";

import Badge from "#src/components/Badge";
import Button from "#src/components/Button";
import Divider from "#src/components/Divider";
import List from "#src/components/List";
import ListLayout from "#src/components/ListLayout";
import NavigationMenu from "#src/components/NavigationMenu";
import Title from "#src/components/Title";

import Sidebar from "./Sidebar";

/**
 * Sidebar - A responsive container for navigation and side content.
 *
 * On desktop (≥768px), displays as a fixed sidebar on the left side.
 * On mobile (<768px), shows a hamburger menu button that slides the sidebar in from the left.
 *
 * ### Key Features
 * - Responsive design with Tailwind breakpoints (md: 768px)
 * - Desktop: Always visible fixed sidebar (240px width)
 * - Mobile: Hamburger button + sliding sidebar with backdrop
 * - Keyboard accessible with Escape key support
 * - Body scroll lock when mobile menu is open
 * - Smooth slide animations
 *
 * ### Usage
 * ```tsx
 * <Sidebar>
 *   <NavigationMenu>
 *     <NavigationMenu.Item label="Dashboard" icon="home" />
 *     <NavigationMenu.Item label="Settings" icon="settings" />
 *   </NavigationMenu>
 * </Sidebar>
 * ```
 *
 * **Note:** To test mobile behavior, use Storybook's viewport toolbar or resize your browser to <768px width.
 */
const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

/**
 * Default sidebar with NavigationMenu containing multiple items, groups, and sub-items.
 * This demonstrates the typical usage pattern with a navigation menu.
 */
export const Default: Story = {
  render: () => (
    <Sidebar>
      <div className="px-xs pb-xs">
        <Title htmlVariant="h2" className="text-content-default">
          My Application
        </Title>
      </div>
      <Divider weight="thin" orientation="horizontal" />
      <div className="flex-1 overflow-y-scroll hide-scrollbar px-xs pt-xs">
        <NavigationMenu>
          <NavigationMenu.Item
            id="dashboard"
            label="Dashboard"
            icon="building-02"
          />
          <NavigationMenu.Item id="calendar" label="Calendar" icon="calendar" />
          <NavigationMenu.Divider />
          <NavigationMenu.Group label="Management" />
          <NavigationMenu.Item
            id="members"
            label="Members"
            icon="user-01"
            endSlot={<Badge size="sm" color="default" text="24" />}
          >
            <NavigationMenu.SubItem id="all-members" label="All Members" />
            <NavigationMenu.SubItem id="active" label="Active" />
            <NavigationMenu.SubItem id="pending" label="Pending" />
          </NavigationMenu.Item>
          <NavigationMenu.Item id="classes" label="Classes" icon="file-06">
            <NavigationMenu.SubItem id="scheduled" label="Scheduled" />
            <NavigationMenu.SubItem id="past" label="Past Classes" />
          </NavigationMenu.Item>
          <NavigationMenu.Item id="products" label="Products" icon="box" />
          <NavigationMenu.Divider />
          <NavigationMenu.Group label="Settings" />
          <NavigationMenu.Item
            id="settings"
            label="Settings"
            icon="settings-03"
          />
          <NavigationMenu.Item
            id="billing"
            label="Billing"
            icon="bank-note-03"
          />
        </NavigationMenu>
      </div>
    </Sidebar>
  ),
};

/**
 * Sidebar combined with ListLayout - A responsive composition showing how both components work together.
 *
 * NOTE: We shouldn't need to add a layout like this one all the time, this should be handled in sm-backbone
 *
 * On desktop (≥768px): Sidebar is fixed on the left, ListLayout occupies the remaining width
 * On mobile (<768px): Sidebar slides in from left with toggle button in top bar, ListLayout fills full width below
 *
 * **Note:** Use Storybook's viewport toolbar or resize browser to <768px to test mobile behavior.
 */
export const SidebarAndListLayout: Story = {
  name: "Sidebar + ListLayout",
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const SidebarContent = () => (
      <>
        <div className="px-xs pb-xs">
          <Title htmlVariant="h2" className="text-content-default">
            My Application
          </Title>
        </div>
        <Divider weight="thin" orientation="horizontal" />
        <div className="flex-1 overflow-y-scroll hide-scrollbar px-xs pt-xs">
          <NavigationMenu>
            <NavigationMenu.Item
              id="dashboard"
              label="Dashboard"
              icon="building-02"
            />
            <NavigationMenu.Item
              id="calendar"
              label="Calendar"
              icon="calendar"
            />
            <NavigationMenu.Divider />
            <NavigationMenu.Group label="Management" />
            <NavigationMenu.Item
              id="members"
              label="Members"
              icon="user-01"
              endSlot={<Badge size="sm" color="default" text="24" />}
            >
              <NavigationMenu.SubItem id="all-members" label="All Members" />
              <NavigationMenu.SubItem id="active" label="Active" />
              <NavigationMenu.SubItem id="pending" label="Pending" />
            </NavigationMenu.Item>
            <NavigationMenu.Item id="classes" label="Classes" icon="file-06">
              <NavigationMenu.SubItem id="scheduled" label="Scheduled" />
              <NavigationMenu.SubItem id="past" label="Past Classes" />
            </NavigationMenu.Item>
            <NavigationMenu.Item id="products" label="Products" icon="box" />
            <NavigationMenu.Divider />
            <NavigationMenu.Group label="Settings" />
            <NavigationMenu.Item
              id="settings"
              label="Settings"
              icon="settings-03"
            />
            <NavigationMenu.Item
              id="billing"
              label="Billing"
              icon="bank-note-03"
            />
          </NavigationMenu>
        </div>
      </>
    );

    const memberItems = Array.from({ length: 20 }).map((_, i) => ({
      id: `member-${i + 1}`,
      title: `Member ${i + 1}`,
      description: `member${i + 1}@example.com`,
    }));

    return (
      <div className="h-screen md:flex">
        <Sidebar>
          <SidebarContent />
        </Sidebar>

        <ListLayout className="flex-1 h-layout-content-mobile md:h-layout-content-desktop">
          <ListLayout.Header
            pageTitle="Members List"
            breadcrumbsItems={[
              {
                id: "breadcrumb-management",
                text: "Management",
                href: "#",
              },
              {
                id: "breadcrumb-members",
                text: "Members",
                href: "#",
              },
            ]}
            callToActionButton={
              <Button
                key="add-member"
                iconLeft="plus"
                color="main"
                intent="call-to-action"
                size="md"
                label="Add Member"
              />
            }
            filterConfig={{
              filters: [
                { id: "is", label: "is" },
                { id: "is-not", label: "is not" },
              ],
              fields: {
                status: {
                  id: "status",
                  label: "Status",
                  availableFilters: ["is", "is-not"],
                  values: [
                    { id: "active", label: "Active" },
                    { id: "pending", label: "Pending" },
                    { id: "inactive", label: "Inactive" },
                  ],
                  multiSelect: false,
                },
                membership: {
                  id: "membership",
                  label: "Membership",
                  availableFilters: ["is", "is-not"],
                  values: [
                    { id: "premium", label: "Premium" },
                    { id: "basic", label: "Basic" },
                  ],
                  multiSelect: true,
                },
              },
              selectFieldLabel: "Filter by",
              onFilterChange: (filters) =>
                console.log("Filters changed:", filters),
            }}
          />
          <ListLayout.Content>
            <List id="members-list" items={memberItems} />
          </ListLayout.Content>
        </ListLayout>
      </div>
    );
  },
};
