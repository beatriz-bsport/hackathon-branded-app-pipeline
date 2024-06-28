import React from 'react';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import MenuItem from '#src/components/css-only/Fabrique/MenuItem';
import { Link } from 'react-router-dom';
import type { NavigationItem as NavigationItemType } from '#src/libs/consumer-space/components/reworked/@Navigation/types';

import './styles.css';

const NavigationItem: React.FC<NavigationItemType> = ({
  className,
  title,
  goTo,
  icon,
  rightSlot,
  onClick,
  buildUrl,
}) => {
  if (!goTo)
    return (
      <MenuItem
        className={className}
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
        className={className}
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
