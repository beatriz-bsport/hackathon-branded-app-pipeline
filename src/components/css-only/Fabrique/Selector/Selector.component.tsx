import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import {
  SelectorInput,
  SelectorInputClasses,
  SelectorValues,
  SelectorValuesClasses,
} from '.';
import Menu from '#Fabrique/Menu';
import MenuItem from '#Fabrique/MenuItem';
import MenuItemList from '#Fabrique/MenuItemList';
import Typography from '#Fabrique/Typography';
import type { SelectorSize } from './types';
import { SelectorSizeEnum } from './constants';
import { REQUIRED_SYMBOL } from '#Fabrique/constants';
import './styles.css';

export type SelectorClasses = {
  label?: string;
  captionText?: string;
  menu?: string;
  menuContent?: string;
  errorMessage?: string;
} & SelectorInputClasses &
  SelectorValuesClasses;

export type SelectorProps = {
  /**
   * Represents a caption text value.
   */
  captionText?: string;
  /**
   * The options you want to display inside the menu. Usually MenuItems or MenuItemList.
   */
  children?:
    | React.ReactElement<typeof MenuItem>
    | React.ReactElement<typeof MenuItem>[]
    | React.ReactElement<typeof MenuItemList>
    | React.ReactElement<typeof MenuItemList>[];
  /**
   *Override or extend the styles applied to the a targeted element.
   */
  classes?: SelectorClasses;
  /**
   *Override or extend the styles applied to the component.
   */
  className?: string;
  /**
   * In case of multiple select, it should be set to false.
   * In case of single select, it should be set within a state handler where the selector is called
   */
  closeOnSelect: boolean;
  /**
   * The state handler callback to update closeOnSelect. Used in Selector to reset the value to false.
   */
  setCloseOnSelect?: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   *Represents an error message.
   */
  errorMessage?: string;
  /**
   * Callback function to extract the value we want to display in the selector from an item
   */
  getSelectedItemLabel: (item: unknown) => string | number;
  /**
   * Callback function to extract the value from an item. This value will be used to remove a selected item
   */
  getSelectedItemValue: (item: unknown) => string | number;
  /**
   * The id of the selector input.
   */
  id: string;
  /**
   * If true the element is disabled.
   */
  isDisabled?: boolean;
  /**
   * If true, the element will indicate an error.
   */
  isError?: boolean;
  /**
   * If true, this field is required.
   */
  isRequired?: boolean;
  /**
   * Represents the selector label.
   */
  label?: string;
  /**
   * The icon displayed on the left of the selector.
   */
  leftIcon?: React.ReactNode;
  /**
   * The id of the menu.
   */
  menuId?: string;
  /**
   * If true, allow the user to select multiple values
   */
  multiple?: boolean;
  /**
   * The name of the field, will be used inside form
   */
  name?: string;
  /**
   * Callback fired when clicking on the chip's clear icon button.
   */
  onRemoveItem?: (value: number | string) => void;
  /**
   * Callback fired when clicking on the clear icon button.
   */
  onClear?: () => void;
  /**
   * Callback fired on change events.
   */
  onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Represents a placeholder text value.
   */
  placeholder?: string;
  /**
   * The value(s) represented in the selector input.
   */
  selectedItems: unknown;
  /**
   * The size of the element. Set to small by default.
   */
  size?: SelectorSize;
};

const Selector: React.FC<SelectorProps> = ({
  captionText,
  children,
  classes,
  className,
  closeOnSelect,
  setCloseOnSelect,
  errorMessage,
  getSelectedItemLabel,
  getSelectedItemValue,
  id,
  isDisabled,
  isError,
  isRequired,
  label,
  leftIcon,
  menuId,
  multiple,
  name,
  onRemoveItem,
  onClear,
  placeholder,
  selectedItems,
  size = SelectorSizeEnum.SM,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);

  const selectorRef = React.useRef<HTMLDivElement | null>(null);

  const isSmall = size === SelectorSizeEnum.SM;

  React.useEffect(() => {
    if (closeOnSelect && !multiple) {
      setIsOpen(false);
      setCloseOnSelect?.(false);
    }
  }, [closeOnSelect, setCloseOnSelect, multiple]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      const currentTarget = event.currentTarget;
      setAnchorEl((prevState) =>
        prevState === currentTarget ? null : currentTarget,
      );
      setIsOpen((prevState) => !prevState);
    },
    [],
  );

  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      const currentTarget = event.currentTarget as HTMLElement;
      setAnchorEl((prevState) =>
        prevState === currentTarget ? null : currentTarget,
      );
      setIsOpen(true);
    }
  }, []);

  const handleOnClose = React.useCallback(() => {
    setAnchorEl(null);
    setIsOpen(false);
    !multiple && setCloseOnSelect?.(false);
  }, [setCloseOnSelect, multiple]);

  const handleClear = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onClear();
    },
    [onClear],
  );

  if (!multiple && Array.isArray(selectedItems)) {
    throw new Error(
      'The `value` prop must not be an array when using the `Select` component without `multiple`',
    );
  }

  return (
    <div className={classNames('bs-fabrique-selector', className)} id={id}>
      <Typography
        className={classNames(
          'bs-fabrique-selector__label',
          {
            'bs-fabrique-selector__label--hidden': !label,
            'bs-fabrique-selector__label--disabled': isDisabled,
          },
          classes?.label,
        )}
        variant={isSmall ? 'body-sm' : 'body-md'}
      >
        {label}
        {isRequired && (
          <span className="bs-fabrique-textfield__label--required">
            {REQUIRED_SYMBOL}
          </span>
        )}
      </Typography>
      <SelectorInput
        aria-disabled={isDisabled && 'true'}
        aria-expanded={!isDisabled && isOpen ? 'true' : 'false'}
        aria-haspopup="listbox"
        classes={classes}
        isDisabled={isDisabled}
        isError={isError}
        isMenuOpen={!isDisabled && isOpen}
        leftIcon={leftIcon}
        name={name}
        onChange={!isDisabled && onChange}
        onClear={!isDisabled && handleClear}
        onClick={!isDisabled && handleClick}
        // @ts-ignore
        onKeyDown={!isDisabled && handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        selectedItems={selectedItems}
        selectorRef={selectorRef}
        size={size}
        tabIndex={0}
      >
        <SelectorValues
          classes={classes}
          getSelectedItemLabel={getSelectedItemLabel}
          getSelectedItemValue={getSelectedItemValue}
          multiple={multiple}
          onRemoveValue={onRemoveItem}
          selectedItems={selectedItems}
          size={size}
        />
      </SelectorInput>
      <Typography
        className={classNames(
          'bs-fabrique-selector__caption-text',
          {
            'bs-fabrique-selector__caption-text--hidden': !captionText,
          },
          classes?.captionText,
        )}
        variant={isSmall ? 'body-xs' : 'body-sm'}
      >
        {captionText}
      </Typography>
      <Typography
        className={classNames(
          'bs-fabrique-selector__error-message',
          {
            'bs-fabrique-selector__error-message--hidden':
              !isError || !errorMessage,
          },
          classes?.errorMessage,
        )}
        color="error"
        variant={isSmall ? 'body-xs' : 'body-sm'}
      >
        {errorMessage}
      </Typography>
      <Menu
        anchorEl={anchorEl}
        classes={{ menuContent: classes?.menuContent }}
        className={classes?.menu}
        id={menuId}
        isOpen={!isDisabled && isOpen}
        onClose={!isDisabled && handleOnClose}
        openMenuRef={selectorRef}
      >
        {children}
      </Menu>
    </div>
  );
};

export const SelectorStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Selector>>()(Selector);

export default React.memo(Selector);
