import React from 'react';
import classNames from 'classnames';

import { PortalContainer } from '#Fabrique/PortalContainer';
import {
  useCloseModal,
  usePopoverPositioning,
} from '#src/components/css-only/Fabrique/hooks';

import SubmenuDivider from '#src/components/css-only/Fabrique/SubmenuDivider';
import SubmenuListItem from '#src/components/css-only/Fabrique/SubmenuListItem';

import type {
  Horizontal,
  Vertical,
} from '#src/components/css-only/Fabrique/Types';
import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';
import type { AllOrNothing } from '#src/libs/types';

import { DELAY_DURATION } from '#src/components/css-only/Fabrique/constants';
import { SUBMENU_MARGIN } from '#src/components/css-only/Fabrique/Submenu/constants';

import './styles.css';

type SubmenuPortalModeProps = {
  /**
   * Refers to the x coordinate on the anchor where the menu will attach to.
   * @type {Horizontal}
   */
  anchorOriginHorizontal: Horizontal;
  /**
   * Refers to the y coordinate on the anchor where the menu will attach to.
   * @type {Vertical}
   */
  anchorOriginVertical: Vertical;
  /**
   * Refers to the x coordinate of the menu that will attach to the anchor's origin.
   * @type {Horizontal}
   */
  transformOriginHorizontal: Horizontal;
  /**
   * Refers to the y coordinate of the menu that will attach to the anchor's origin.
   * @type {Vertical}
   */
  transformOriginVertical: Vertical;
  /** If true, the component will behave as a floating submenu */
  isAnchorMode: boolean;
  onClose: () => void;
  /** If provided, this HTML Element will be used to set the position of the menu */
  anchorEl: HTMLElement;
};

type Props = {
  className?: string;
  items: SubmenuItem[];
  handleSetRecursiveItems?: (items: SubmenuItem[]) => void;
} & AllOrNothing<SubmenuPortalModeProps>;

type SubmenuItemElementProps = { item: SubmenuItem; index: number } & Pick<
  Props,
  'handleSetRecursiveItems'
>;

/**
 * Handles the rendering of a submenu item according to its properties
 * Current available elements are: List item, Divider
 */
const SubmenuItemElement: React.FC<SubmenuItemElementProps> = React.memo(
  ({ item, index, handleSetRecursiveItems }) => {
    const handleListItemClick = () => {
      if (item.items?.length && !!handleSetRecursiveItems) {
        return handleSetRecursiveItems(item.items);
      }
      return item.onClick?.();
    };

    if (item.isDivider) {
      return <SubmenuDivider key={index} />;
    }

    if (!!item.onClick || !!item.to || item.items?.length) {
      return (
        <SubmenuListItem
          key={index}
          className={item.className}
          item={{
            ...item,
            onClick: handleListItemClick,
          }}
        />
      );
    }
    return null;
  },
);

/**
 * The main content rendered within a Submenu.
 * It contains all items wrapped in a list.
 */
export const SubmenuContent = React.forwardRef<
  HTMLUListElement,
  Pick<
    Props,
    | 'className'
    | 'items'
    | 'anchorOriginHorizontal'
    | 'anchorOriginVertical'
    | 'transformOriginHorizontal'
    | 'transformOriginVertical'
    | 'isAnchorMode'
    | 'handleSetRecursiveItems'
    | 'anchorEl'
  > & {
    isPositioned?: boolean;
  }
>(
  (
    {
      className,
      items,
      isPositioned,
      isAnchorMode,
      anchorEl,
      handleSetRecursiveItems,
    },
    ref,
  ) => {
    return (
      <ul
        ref={ref}
        className={classNames('bs-fabrique-submenu__root', className, {
          'bs-fabrique-submenu__root--anchor': isAnchorMode,
          'bs-fabrique-submenu__root--unpositioned':
            isAnchorMode && !isPositioned && !anchorEl,
        })}
      >
        {(items ?? []).map((item, index) => (
          <SubmenuItemElement
            key={index}
            handleSetRecursiveItems={handleSetRecursiveItems}
            index={index}
            item={item}
          />
        ))}
      </ul>
    );
  },
);

/**
 * Submenu: a component made for list item display
 * Can be used anywhere: bottom drawers, navigation elements
 * By definition, a submenu is either standalone (plain display) or
 * using a anchor for floating position. It can also be recursive (contextual menus)
 */
const Submenu: React.FC<Props> = ({
  className,
  items,
  anchorOriginHorizontal,
  anchorOriginVertical,
  transformOriginHorizontal,
  transformOriginVertical,
  anchorEl,
  isAnchorMode,
  onClose,
  handleSetRecursiveItems,
}) => {
  const submenuRef = React.useRef<HTMLUListElement>(null);

  const {
    isPositioned,
    setIsPositioned,
    setPositioningStyles,
    setPositionedToFalse,
  } = usePopoverPositioning({
    anchorEl,
    ref: submenuRef,
    isOpen: !!anchorEl,
    anchorOriginHorizontal,
    anchorOriginVertical,
    transformOriginHorizontal,
    transformOriginVertical,
    margin: SUBMENU_MARGIN,
  });

  const handleOnClose = React.useCallback(() => {
    onClose?.();
    setIsPositioned(false);
  }, [onClose, setIsPositioned]);

  const { modalRef } = useCloseModal({
    onClose: handleOnClose,
    openMenuRef: submenuRef,
    setPositionedToFalse,
  });

  // Need this to recalculate the position when scrolling
  React.useEffect(() => {
    window.addEventListener('scroll', setPositioningStyles);

    return () => window.removeEventListener('scroll', setPositioningStyles);
  }, [anchorEl, setPositioningStyles]);

  React.useEffect(() => {
    if (anchorEl) {
      window.addEventListener('scroll', setPositioningStyles);
      setTimeout(setPositioningStyles, DELAY_DURATION);
    } else {
      window.removeEventListener('scroll', setPositioningStyles);
    }
  });

  if (!isAnchorMode) {
    return (
      <SubmenuContent
        className={className}
        handleSetRecursiveItems={handleSetRecursiveItems}
        items={items}
      />
    );
  }

  return (
    <PortalContainer wrapperId="bs-fabrique-submenu-portal-container">
      <div ref={modalRef} className="bs-fabrique-submenu-modal-ref">
        <SubmenuContent
          ref={submenuRef}
          isAnchorMode
          anchorEl={anchorEl}
          anchorOriginHorizontal={anchorOriginHorizontal}
          anchorOriginVertical={anchorOriginVertical}
          className={className}
          handleSetRecursiveItems={handleSetRecursiveItems}
          isPositioned={isPositioned}
          items={items}
          transformOriginHorizontal={transformOriginHorizontal}
          transformOriginVertical={transformOriginVertical}
        />
      </div>
    </PortalContainer>
  );
};

export default React.memo(Submenu);
