import React from 'react';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { StatusMessageWithIconSkeleton } from '.';

import './styles.css';
import Button, { ButtonColor, ButtonVariant } from '../Fabrique/Button';

type ActionButton = {
  label: string;
  onClick: () => void;
};

export type Props = {
  isLoading: boolean;
  title: string;
  message: string;
  icon?: React.ReactElement;
  actions?: {
    cancel?: ActionButton;
    confirm?: ActionButton;
  };
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
          {!!actions?.cancel && (
            <Button
              classes={{
                root: 'bs-status-message-with-icon__action',
              }}
              onClick={actions.cancel.onClick}
              variant={ButtonVariant.OUTLINED}
            >
              {actions.cancel.label}
            </Button>
          )}
          {!!actions?.confirm && (
            <Button
              classes={{
                root: 'bs-status-message-with-icon__action',
              }}
              color={ButtonColor.PRIMARY}
              onClick={actions.confirm.onClick}
            >
              {actions.confirm.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const StatusMessageWithIconForStorybook = marketplaceCssHoc()(
  StatusMessageWithIcon,
);

export default React.memo(StatusMessageWithIcon);
