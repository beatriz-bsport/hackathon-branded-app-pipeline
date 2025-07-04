import { type FC } from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useDateFormatter } from "#src/utils/use-date-formatter";

interface TasksListItemProps {
  id: string;
  title: string;
  description: string;
  memberName: string;
  dateDue: string;
}

const TasksListItem: FC<TasksListItemProps> = ({
  id,
  title,
  description,
  memberName,
  dateDue,
}) => {
  const { formatLong } = useDateFormatter();

  return (
    <a
      href={`${LEGACY_URLS.member}/${id}/info`}
      className="relative flex min-h-2xl py-xs px-md gap-xs border-b-stroke-thin border-b-stroke-divider hover:bg-surface-action-default-weak-hovered active:bg-surface-action-default-weak-pressed text-inherit no-underline"
    >
      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] w-full gap-xs items-center">
        {/* Left column with title and description */}
        <div className="flex items-center gap-xs">
          <div className="flex-1 min-w-0">
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
          </div>
        </div>

        {/* Right column with date and member name */}
        <div className="flex flex-col items-end justify-center gap-2xs">
          <Body htmlVariant="span" size="sm" color="weak">
            {formatLong(dateDue)}
          </Body>
          <Body htmlVariant="span" size="sm" color="weak">
            {memberName}
          </Body>
        </div>
      </div>
    </a>
  );
};

export default TasksListItem;
