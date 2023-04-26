// @ts-nocheck
import React from 'react';

import './styles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

export type Props = {
  primary?: string;
  secondary?: string;
  tertiary?: string;
  key?: string;
  actionIcon?: React.ReactElement;
  onClick?: () => void;
  onActionClick?: () => void;
};

const ClickableItem: React.FC<Props> = React.memo(
  ({
    primary,
    secondary,
    tertiary,
    key,
    actionIcon,
    onClick,
    onActionClick,
  }) => {
    const handleOnActionClick = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      event.stopPropagation();
      onActionClick();
    };

    return (
      <button
        className="bs-clickable-item__container"
        type="button"
        onClick={onClick}
        key={key}
      >
        <div className="bs-clickable-item__text__container">
          <h3 className="bs-clickable-item__primary">{primary}</h3>
          <div className="bs-clickable-item__secondary__tertiary__container">
            {secondary && (
              <span className="bs-clickable-item__secondary">{secondary}</span>
            )}
            {tertiary && (
              <span className="bs-clickable-item__tertiary">{tertiary}</span>
            )}
          </div>
        </div>

        {actionIcon && (
          <button
            className="bs-clickable-item__action"
            type="button"
            onClick={handleOnActionClick}
          >
            {actionIcon}
          </button>
        )}
      </button>
    );
  },
);

export const ClickableItemForStorybook = marketplaceCssHoc()(ClickableItem);

export default ClickableItem;
