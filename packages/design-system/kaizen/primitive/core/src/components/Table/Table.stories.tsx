import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Table, { Column } from "./Table";
import Button from "#src/components/Button";
import Chip from "#src/components/Chip";
import AvatarImage from "#src/components/Avatar/assets/avatar.jpeg";

/**
 * The Table component is used to render a flexible, customizable data table that displays rows and columns of information.<br>
 * It allows different configurations such as selectable rows with checkboxes, different row heights, and vertical borders between cells.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=2023-14889" target="_blank">Figma</a>
 */
const meta: Meta<typeof Table> = {
  component: Table,
};

export default meta;

type DataRow = {
  id: string;
  avatar: { src: string; alt: string } | string;
  name: string;
  registeredDate: Date;
  status: Array<{ label: string; color: "positive" | "critical" | "warning" }>;
  amount: number;
  actions: string[];
  profile: {
    link: { href: string; label: string };
  };
};

const rows: DataRow[] = [
  {
    id: "row-1",
    avatar: AvatarImage,
    name: "John Doe",
    registeredDate: new Date("2024-01-15T14:30:00Z"),
    status: [
      { label: "Active", color: "positive" },
      { label: "Verified", color: "warning" },
    ],
    amount: 120000,
    actions: ["Edit", "Delete"],
    profile: {
      link: {
        href: "/profile/johndoe",
        label: "View Profile",
      },
    },
  },
  {
    id: "row-2",
    avatar: {
      src: AvatarImage,
      alt: "Jane Smith",
    },
    name: "Jane Smith",
    registeredDate: new Date("2023-08-20T09:00:00Z"),
    status: [{ label: "Inactive", color: "critical" }],
    amount: 98000,
    actions: ["Edit"],
    profile: {
      link: {
        href: "/profile/janesmith",
        label: "View Profile",
      },
    },
  },
  {
    id: "row-3",
    avatar: {
      src: AvatarImage,
      alt: "Alice Brown",
    },
    name: "Alice Brown",
    registeredDate: new Date("2024-03-10T10:15:00Z"),
    status: [],
    amount: 75000,
    actions: ["Edit", "View"],
    profile: {
      link: {
        href: "/profile/alicebrown",
        label: "View Profile",
      },
    },
  },
];

const columns: Column<DataRow>[] = [
  {
    id: "avatar",
    keyPath: "avatar",
    header: "Avatar",
    type: "avatar",
    size: "sm",
  },
  {
    id: "name",
    keyPath: "name",
    header: "Name",
    type: "string",
  },
  {
    id: "registeredDate",
    keyPath: "registeredDate",
    header: "Registered Date",
    type: "datetime",
  },
  {
    id: "status",
    keyPath: "status",
    header: "Status",
    type: "custom",
    render: (row: DataRow) => (
      <div className="flex gap-sm">
        {row.status.map((status, index) => (
          <Chip
            key={index}
            label={status.label}
            color={status.color}
            size="sm"
            type="weak"
          />
        ))}
      </div>
    ),
  },
  {
    id: "amount",
    keyPath: "amount",
    header: "Amount",
    type: "number",
    align: "center",
  },
  {
    id: "actions",
    keyPath: "actions",
    header: "Actions",
    type: "custom",
    align: "end",
    render: (row: DataRow) => (
      <div className="flex gap-sm">
        {row.actions.map((action, index) => (
          <Button
            key={index}
            intent="call-to-action"
            color="main"
            size="sm"
            onClick={() => console.log(`${action} clicked for ${row.name}`)}
            label={action}
          />
        ))}
      </div>
    ),
  },
  {
    id: "profileLink",
    keyPath: "profile.link",
    header: "Profile Link",
    type: "link",
    align: "end",
    target: "_blank",
    label: (row: DataRow) => row.profile.link.label,
  },
];

export const Primary: StoryObj<typeof Table> = {
  args: {
    columns: columns as Column<{ id: string }>[],
    rows,
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
  },
};
