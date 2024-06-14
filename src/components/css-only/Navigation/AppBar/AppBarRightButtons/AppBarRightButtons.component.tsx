import React from 'react';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import IconButton from '#src/components/css-only/Fabrique/IconButton';
import type { AppBarRightButtons as RightButtons } from '#src/components/css-only/Navigation/types';

type Props = {
  rightButtons: RightButtons;
};

const AppBarRightButtons: React.FC<Props> = ({ rightButtons }) => {
  if (!rightButtons?.length) return null;
  return (
    <div className="bs-app-bar-right-buttons__root">
      {rightButtons.map((button) => {
        if (button.isIconButton)
          return (
            <IconButton
              key={button.label}
              color={button.color}
              onClick={button.onClick}
              size="md"
              variant="text"
            >
              {button.leftIcon}
            </IconButton>
          );
        return (
          <Button
            key={button.label}
            color={button.color}
            leftIcon={button.leftIcon}
            onClick={button.onClick}
            size="md"
            variant="text"
          >
            {button.label}
          </Button>
        );
      })}
    </div>
  );
};

export const AppBarRightButtonsStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof AppBarRightButtons>>()(
    AppBarRightButtons,
  );
export default React.memo(AppBarRightButtons);
