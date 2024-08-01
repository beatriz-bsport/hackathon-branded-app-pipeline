import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router';

import { ChevronRight } from '#src/components/untitledui';
import MenuItem from '#Fabrique/MenuItem';

import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';

type Props = {
  className?: string;
  item: SubmenuItem;
};

const SubmenuListItem: React.FC<Props> = ({ className, item }) => {
  const history = useHistory();
  const { title, leftIcon, rightIcon, isSelected, items, to, onClick } = item;

  /** A link can have an extra action, performed just before the route redirection */
  const handleClick = useCallback(
    (event) => {
      onClick?.(event);
      !!to && history.push(to);
    },
    [history, onClick, to],
  );

  const rightSlot = items?.length ? (
    <ChevronRight stroke="currentColor" />
  ) : (
    rightIcon
  );

  return (
    <MenuItem
      classes={{
        label: 'bs-fabrique-submenu-list-item__label',
      }}
      className={classNames(
        'bs-fabrique-submenu-list-item__root',
        {
          'bs-fabrique-submenu-list-item__root--selected': isSelected,
        },
        className,
      )}
      label={title}
      leftIcon={leftIcon}
      onClick={handleClick}
      rightSlot={rightSlot}
      type="text"
    />
  );
};

export default React.memo(SubmenuListItem);
