import React from 'react';
import { useTranslation } from 'react-i18next';
import { Notifications, NotificationsOff } from '@material-ui/icons';
import { Badge, IconButton } from '@material-ui/core';
import ToolTip from '#components/Tooltip.component';

type OwnProps = {
  badgeContent: number;
  isDisabled?: boolean;
  onClick: () => void;
};
type Props = OwnProps;
export const NotificationBellWithBadge: React.FC<Props> = ({
  badgeContent,
  isDisabled,
  onClick,
}) => {
  const { t } = useTranslation(['marketing']);
  const toolTipTitle = React.useMemo(() => {
    if (!badgeContent) {
      return 'notifications.create';
    }
    if (isDisabled) {
      return 'notifications.noNotification';
    }
    return 'notifications.handleNotification';
  }, [isDisabled, badgeContent]);

  return (
    <>
      <IconButton onClick={onClick}>
        <Badge showZero badgeContent={badgeContent} color="primary">
          <ToolTip title={t(toolTipTitle)}>
            {isDisabled || !badgeContent ? (
              <NotificationsOff />
            ) : (
              <Notifications />
            )}
          </ToolTip>
        </Badge>
      </IconButton>
    </>
  );
};
NotificationBellWithBadge.defaultProps = {
  isDisabled: false,
};
export default NotificationBellWithBadge;
