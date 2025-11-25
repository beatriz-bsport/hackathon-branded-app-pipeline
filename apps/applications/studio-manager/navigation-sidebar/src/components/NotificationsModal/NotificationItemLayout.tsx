import type { FC, ReactNode } from "react";

type NotificationItemLayoutProps = {
  leftContent: ReactNode;
  rightContent?: ReactNode;
};

/**
 * NotificationItemLayout provides a consistent responsive grid layout for notification list items.
 *
 * This component encapsulates the responsive grid structure used across all notification types,
 * ensuring 320px mobile screen compatibility. It handles both single-column notifications
 * (left content only) and two-column notifications (left and right content).
 *
 * The layout uses `grid-cols-[minmax(0,1fr)_auto]` to allow the right column to size based on
 * its content while the left column takes remaining space, preventing overflow on narrow screens.
 *
 * @param {NotificationItemLayoutProps} props - The component props
 * @param {ReactNode} props.leftContent - Content for the left column (title, description, etc.)
 * @param {ReactNode} props.rightContent - Optional content for the right column (dates, amounts, etc.)
 *
 * @returns {JSX.Element} A responsive grid layout for notification items
 */
export const NotificationItemLayout: FC<NotificationItemLayoutProps> = ({
  leftContent,
  rightContent,
}) => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto] w-full gap-xs items-center">
    <div className="flex items-center gap-xs">
      <div className="flex-1 min-w-0">{leftContent}</div>
    </div>
    {rightContent && (
      <div className="flex flex-col items-end justify-center gap-2xs">
        {rightContent}
      </div>
    )}
  </div>
);
