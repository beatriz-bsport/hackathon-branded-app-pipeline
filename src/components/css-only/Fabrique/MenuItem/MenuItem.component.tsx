import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Typography from '#Fabrique/Typography';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import Checkbox from '#Fabrique/Checkbox';
import RadioButton from '#Fabrique/RadioButtonV2';
import { MenuItemTypeEnum, MenuItemType, MenuItemClasses } from '.';
import './styles.css';

export type MenuItemProps = {
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the nested elements.
   */
  classes?: MenuItemClasses;
  /**
   * An optional link to redirect the user.
   */
  href?: string;
  /**
   *Indicates whether the ripple effect is enabled (true) or disabled (false).
   */
  isRippleEnabled?: boolean;
  /**
   * A required string representing the label or text associated with the item.
   */
  label: string;
  /**
   * An optional React element that represents an icon to be displayed on the left side of the component.
   */
  leftIcon?: React.ReactNode;
  /**
   * A callback function to be triggered when clicked.
   */
  onClick?: (
    event?: React.MouseEvent<
      HTMLAnchorElement | HTMLButtonElement | HTMLInputElement
    >,
  ) => void;
  /**
   * If true, the component is selected
   */
  selected?: boolean;
  /**
   * A string indicating the type of the component, which can be one of 'text', 'checkbox', or 'radio'.
   */
  type?: MenuItemType;
};

const MenuItem: React.FC<MenuItemProps> = ({
  className,
  classes,
  href,
  isRippleEnabled,
  label,
  leftIcon,
  onClick,
  selected,
  type = MenuItemTypeEnum.TEXT,
}) => {
  if (type === MenuItemTypeEnum.TEXT) {
    return (
      <li className={classNames('bs-fabrique-menu-item-root', className)}>
        <ButtonBase
          className={classNames(
            'bs-fabrique-menu-item__button',
            classes?.button,
          )}
          href={href}
          isRippleEnabled={isRippleEnabled}
          onClick={onClick}
          type="button"
        >
          {!!leftIcon && (
            <span
              className={classNames(
                'bs-fabrique-menu-item__left-icon',
                classes?.icon,
              )}
            >
              {leftIcon}
            </span>
          )}
          <Typography
            className={classNames(
              'bs-fabrique-menu-item__label',
              classes?.label,
            )}
            variant="body-sm"
          >
            {label}
          </Typography>
        </ButtonBase>
      </li>
    );
  }

  return (
    <li className={classNames('bs-fabrique-menu-item-root', className)}>
      <ButtonBase
        className={classNames(
          'bs-fabrique-menu-item__button',
          { 'bs-fabrique-menu-item__button--selected': selected },
          classes?.button,
        )}
        href={href}
        isRippleEnabled={isRippleEnabled}
        onClick={onClick}
        type="button"
      >
        {type === MenuItemTypeEnum.CHECKBOX ? (
          <Checkbox
            id={label}
            isChecked={selected}
            label={label}
            onClick={onClick}
          />
        ) : (
          <RadioButton
            id={label}
            isChecked={selected}
            label={label}
            onClick={onClick}
            size="sm"
          />
        )}
      </ButtonBase>
    </li>
  );
};

export const MenuItemStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof MenuItem>>()(MenuItem);

export default React.memo(MenuItem);
