import React from 'react';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import './styles.css';

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
        key={key}
        className="bs-clickable-item__container"
        onClick={onClick}
        type="button"
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
            onClick={handleOnActionClick}
            type="button"
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
