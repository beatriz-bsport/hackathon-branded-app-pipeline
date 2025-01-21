import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router';

import { ChevronRight } from '#src/components/untitledui';
import MenuItem from '#Fabrique/MenuItem';
import Submenu from '#Fabrique/Submenu';
import useViewport from '#src/components/css-only/Fabrique/hooks/useViewport';

import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';

import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';

type Props = {
  className?: string;
  item: SubmenuItem;
};

const SubmenuListItem: React.FC<Props> = ({ className, item }) => {
  const { title, leftIcon, rightIcon, isSelected, items, to, onClick } = item;

  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const { width } = useViewport();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const openNestedSubmenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (items?.length > 0) {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
      }
    },
    [items?.length],
  );

  const closeNestedSubmenu = useCallback(() => {
    if (items?.length > 0) {
      setAnchorEl(null);
    }
  }, [items?.length]);

  /** A link can have an extra action, performed just before the route redirection */
  const handleClick = useCallback(
    (event) => {
      onClick?.(event);
      !!to && history.push(to);
    },
    [history, onClick, to],
  );

  const rightSlot =
    (items ?? []).length > 0 ? (
      <ChevronRight stroke="currentColor" />
    ) : (
      rightIcon
    );

  return (
    <div
      className="bs-fabrique-submenu-list-item__container__root"
      onClick={openNestedSubmenu}
      role="button"
    >
      <MenuItem
        classes={{
          label: 'bs-fabrique-submenu-list-item__label',
        }}
        className={clsx(
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

      {item.items?.length > 0 && (
        <Submenu
          isAnchorMode
          anchorEl={anchorEl}
          anchorOriginHorizontal="right"
          anchorOriginVertical="bottom"
          className={clsx('bs-fabrique-submenu-list-item__nested__root', {
            'bs-fabrique-submenu-list-item__nested__root--hidden': isMobile,
          })}
          items={items}
          onClose={closeNestedSubmenu}
          transformOriginHorizontal="left"
          transformOriginVertical="bottom"
        />
      )}
    </div>
  );
};

export default React.memo(SubmenuListItem);
