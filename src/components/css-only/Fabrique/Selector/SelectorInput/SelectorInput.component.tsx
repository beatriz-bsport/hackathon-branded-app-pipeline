import React from 'react';
import classNames from 'classnames';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import { ChevronDown, ChevronUp, XClose } from '#components/untitledui';
import Typography from '#Fabrique/Typography';
import { SelectorSizeEnum } from '../constants';
import { SelectorSize } from '../types';
import './selector-input-styles.css';

export type SelectorInputClasses = {
  clearButton?: string;
  container?: string;
  leftIcon?: string;
  placeholder?: string;
  rightIcon?: string;
  valuesContainer?: string;
};

export type SelectorInputProps = {
  /**
   * Selector contents, usually the selected values represented as string or chips
   */
  children?: React.ReactNode;
  /**
   * If `true` the arrow will not have any animation on input click
   */
  noAnimate?: boolean;
  /**
   *Override or extend the styles applied to the a targeted element.
   */
  classes?: SelectorInputClasses;
  /**
   *Override or extend the styles applied to the component.
   */
  className?: string;
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
   * If true the menu with the options is open.
   */
  isMenuOpen: boolean;
  /**
   * The icon displayed on the left of the selector.
   */
  leftIcon?: React.ReactNode;
  /**
   * Callback fired when clicking on the clear icon button.
   */
  onClear?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * Represents a placeholder text value.
   */
  placeholder?: string;
  selectedItems: unknown;
  size?: SelectorSize;
  selectorRef: React.MutableRefObject<HTMLDivElement | null>;
} & React.AnchorHTMLAttributes<HTMLDivElement>;

const SelectorInput: React.FC<SelectorInputProps> = ({
  children,
  noAnimate,
  classes,
  className,
  id,
  isDisabled,
  isError,
  isMenuOpen,
  leftIcon,
  onClear,
  placeholder,
  selectedItems,
  size = SelectorSizeEnum.SM,
  selectorRef,
  ...anchorDivProps
}) => {
  const isSmall = size === SelectorSizeEnum.SM;
  const isLarge = size === SelectorSizeEnum.LG;

  const shouldDisplayValues = Array.isArray(selectedItems)
    ? selectedItems.length > 0
    : !!selectedItems;

  return (
    <div
      className={classNames(
        'bs-fabrique-selector-input',
        {
          'bs-fabrique-selector-input--small': isSmall,
          'bs-fabrique-selector-input--large': isLarge,
          'bs-fabrique-selector-input--disabled': isDisabled,
          'bs-fabrique-selector-input--selected': isMenuOpen,
          'bs-fabrique-selector-input--error': isError,
        },
        className,
      )}
      id={id}
      {...anchorDivProps}
      ref={selectorRef}
    >
      <span
        className={classNames(
          'bs-fabrique-selector-input__icon--base',
          {
            'bs-fabrique-selector-input__icon--small': isSmall,
            'bs-fabrique-selector-input__icon--large': isLarge,
            'bs-fabrique-selector-input__icon--hidden': !leftIcon,
          },
          'bs-fabrique-selector-input__left-icon',
          classes?.leftIcon,
        )}
      >
        {leftIcon}
      </span>
      <div
        className={classNames(
          'bs-fabrique-selector-input__values-container',
          classes?.valuesContainer,
        )}
      >
        {shouldDisplayValues ? (
          children
        ) : (
          <Typography
            className={classNames(
              'bs-fabrique-selector-input__placeholder',
              classes?.placeholder,
            )}
            variant={isSmall ? 'body-sm' : 'body-md'}
          >
            {placeholder ?? ''}
          </Typography>
        )}
      </div>
      <div className="bs-fabrique-selector-input__right-icons-wrapper">
        <ButtonBase
          className={classNames(
            'bs-fabrique-selector-input__icon--base',
            {
              'bs-fabrique-selector-input__icon--small': isSmall,
              'bs-fabrique-selector-input__icon--large': isLarge,
              'bs-fabrique-selector-input__clear-button--hidden':
                !shouldDisplayValues || !onClear,
            },
            'bs-fabrique-selector-input__clear-button',
            classes?.clearButton,
          )}
          isDisabled={isDisabled || !selectedItems}
          onClick={onClear}
          type="button"
        >
          <XClose stroke="currentColor" />
        </ButtonBase>
        <span
          className={classNames('bs-fabrique-selector-input__icon-separator', {
            'bs-fabrique-selector-input__icon-separator--small': isSmall,
            'bs-fabrique-selector-input__icon-separator--large': isLarge,
          })}
        />
        <span
          className={classNames(
            'bs-fabrique-selector-input__icon--base',
            {
              'bs-fabrique-selector-input__icon--small': isSmall,
              'bs-fabrique-selector-input__icon--large': isLarge,
              'bs-fabrique-selector-input__right-icon--menu-open':
                isMenuOpen && !noAnimate,
              'bs-fabrique-selector-input__right-icon--menu-close':
                !isMenuOpen && !noAnimate,
              'bs-fabrique-selector-input__right-icon--disabled': isDisabled,
            },
            'bs-fabrique-selector-input__right-icon',
            classes?.rightIcon,
          )}
        >
          {!isMenuOpen ? (
            <ChevronDown stroke="currentColor" />
          ) : (
            <ChevronUp stroke="currentColor" />
          )}
        </span>
      </div>
    </div>
  );
};

export default React.memo(SelectorInput);
