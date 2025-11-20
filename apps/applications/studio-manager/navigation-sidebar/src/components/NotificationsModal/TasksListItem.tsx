import { type FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { NavigationLink } from "#src/components/NavigationLink";
import { LEGACY_URLS } from "#src/urls";
import { useDateFormatter } from "#src/utils/use-date-formatter";

import { NotificationItemLayout } from "./NotificationItemLayout";
import { useNotificationsNavigation } from "./NotificationsNavigationContext";

export type TasksListItemProps = {
  id: string;
  memberId: string;
  title: string;
  description: string;
  memberName: string;
  dateDue: string;
};

const TasksListItem: FC<TasksListItemProps> = ({
  id,
  title,
  description,
  memberName,
  memberId,
  dateDue,
}) => {
  const { formatLong } = useDateFormatter();
  const { navigateAndClose } = useNotificationsNavigation();

  const renderItem = () => (
    <NotificationItemLayout
      leftContent={
        <>
          <Body
            htmlVariant="span"
            size="lg"
            weight="bold"
            className="block truncate break-word"
          >
            {title}
          </Body>
          <Body
            htmlVariant="span"
            size="md"
            color="weak"
            className="block truncate break-word"
          >
            {description}
          </Body>
        </>
      }
      rightContent={
        <>
          <Body htmlVariant="span" size="sm" color="weak">
            {formatLong(dateDue)}
          </Body>
          <Body htmlVariant="span" size="sm" color="weak">
            {memberName}
          </Body>
        </>
      }
    />
  );

  return (
    <NavigationLink
      item={{
        id,
        href: `${LEGACY_URLS.member}/${memberId}/info`,
        revamped: false,
      }}
      renderElement={renderItem}
      navigate={navigateAndClose}
      wrapperConfig={{
        withOnClick: true,
        className: [
          "relative flex",
          "min-h-2xl py-xs px-md gap-xs",
          "border-b-stroke-thin border-b-stroke-divider",
          "hover:bg-surface-action-default-weak-hovered",
          "hover:cursor-pointer",
          "active:bg-surface-action-default-weak-pressed",
          "text-inherit no-underline",
        ].join(" "),
        tabIndex: 0,
      }}
    />
  );
};

export default TasksListItem;
