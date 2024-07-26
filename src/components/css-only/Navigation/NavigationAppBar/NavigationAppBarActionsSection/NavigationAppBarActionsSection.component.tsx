import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import IconButton from '#src/components/css-only/Fabrique/IconButton';

import type { NavigationAppBarProps } from '#src/components/css-only/Navigation/NavigationAppBar/types';

import './styles.css';

const NavigationAppBarActionsSection: React.FC<
  Pick<NavigationAppBarProps, 'actions' | 'isMobile'>
> = ({ actions, isMobile }) => {
  return (
    <div
      className={classNames('bs-navigation-app-bar__actions-section__root', {
        'bs-navigation-app-bar__actions-section__root--hidden':
          !actions?.length,
      })}
    >
      {(actions ?? []).map((button) => {
        if (isMobile) {
          return (
            <IconButton
              key={button.label}
              color={button.color}
              onClick={button.onClick}
              size="md"
              variant={button.variant}
            >
              {button.leftIcon}
            </IconButton>
          );
        }
        return (
          <Button
            key={button.label}
            badgeValue={button.badgeValue}
            color={button.color}
            leftIcon={button.leftIcon}
            onClick={button.onClick}
            size="md"
            variant={button.variant}
          >
            {button.label}
          </Button>
        );
      })}
    </div>
  );
};

export const NavigationAppBarActionsSectionStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof NavigationAppBarActionsSection>
>()(NavigationAppBarActionsSection);
export default React.memo(NavigationAppBarActionsSection);
