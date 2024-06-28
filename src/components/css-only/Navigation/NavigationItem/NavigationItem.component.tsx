import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import MenuItem from '#src/components/css-only/Fabrique/MenuItem';
import { Link } from 'react-router-dom';

import type { NavigationItem as NavigationItemType } from '#src/libs/consumer-space/components/reworked/@Navigation/types';

import './styles.css';

const NavigationItem: React.FC<NavigationItemType> = ({
  title,
  goTo,
  icon,
  rightSlot,
  onClick,
  buildUrl,
  isCurrentRoute,
}) => {
  if (!goTo)
    return (
      <MenuItem
        className={classNames('bs-navigation__navigation-item', {
          'bs-navigation__navigation-item--selected': isCurrentRoute,
        })}
        label={title}
        leftIcon={icon}
        onClick={onClick}
        rightSlot={rightSlot}
        type="text"
      />
    );

  return (
    <Link className="bs-navigation-list-root__link" to={buildUrl(goTo)}>
      <MenuItem
        className={classNames('bs-navigation__navigation-item', {
          'bs-navigation__navigation-item--selected': isCurrentRoute,
        })}
        label={title}
        leftIcon={icon}
        onClick={onClick}
        rightSlot={rightSlot}
        type="text"
      />
    </Link>
  );
};

export const NavigationItemStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof NavigationItem>>()(
    NavigationItem,
  );
export default React.memo(NavigationItem);
