import React from 'react';
import clsx from 'clsx';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import MenuItem from '../MenuItem';
import type { MenuItemListClasses } from '.';

import Typography from '../Typography';
import './styles.css';

export type MenuItemListProps = {
  children?:
    | React.ReactElement<typeof MenuItem>
    | React.ReactElement<typeof MenuItem>[];
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the nested elements.
   */
  classes?: MenuItemListClasses;
  /**
   * If set to true, the list will include a divider at the bottom.
   */
  hasDivider?: boolean;
  /**
   * If set to true, the list will include a group-title at the top.
   */
  groupTitle?: string;
};

const MenuItemList: React.FC<MenuItemListProps> = ({
  children,
  className,
  classes,
  hasDivider,
  groupTitle,
}) => {
  return (
    <ul className={clsx('bs-fabrique-menu-item-list-root', className)}>
      <li
        className={clsx('bs-fabrique-menu-item-list__group-title__container', {
          'bs-fabrique-menu-item-list__group-title__container--hidden':
            !groupTitle,
        })}
      >
        <Typography
          className={clsx(
            'bs-fabrique-menu-item-list__group-title',
            classes?.groupTitle,
          )}
          variant="body-xs"
        >
          {groupTitle}
        </Typography>
      </li>
      {children}
      <li
        className={clsx(
          'bs-fabrique-menu-item-list__divider',
          { 'bs-fabrique-menu-item-list__divider--hidden': !hasDivider },
          classes?.divider,
        )}
      />
    </ul>
  );
};

export const MenuItemListStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof MenuItemList>>()(MenuItemList);

export default React.memo(MenuItemList);
