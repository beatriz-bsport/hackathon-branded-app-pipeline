import React from 'react';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { StatusMessageWithIconSkeleton } from '.';

import './styles.css';

export type Props = {
  isLoading: boolean;
  title: string;
  message: string;
  icon?: React.ReactElement;
  actions?: React.ReactElement;
};

const StatusMessageWithIcon: React.FC<Props> = ({
  isLoading,
  title,
  message,
  icon,
  actions,
}) => {
  if (isLoading) {
    return <StatusMessageWithIconSkeleton />;
  }

  return (
    <div className="bs-status-message-with-icon__container">
      {!!icon && (
        <div className="bs-status-message-with-icon__icon__container">
          {icon}
        </div>
      )}

      <div className="bs-status-message-with-icon__text__container">
        <div className="bs-status-message-with-icon__title">{title}</div>
        <div className="bs-status-message-with-icon__message">{message}</div>
      </div>

      {!!actions && (
        <div className="bs-status-message-with-icon__actions__container">
          {actions}
        </div>
      )}
    </div>
  );
};

export const StatusMessageWithIconForStorybook = marketplaceCssHoc()(
  StatusMessageWithIcon,
);

export default React.memo(StatusMessageWithIcon);
