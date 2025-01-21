import React from 'react';
import clsx from 'clsx';
import Typography from '#Fabrique/Typography';
import Chip from '#Fabrique/Chip';
import './selector-values-styles.css';
import type { SelectorSize } from '../types';

export type SelectorValuesClasses = {
  typography?: string;
  values?: string;
  chip?: string;
};

export type SelectorValuesProps = {
  /**
   * Override the style of the nested elements in this component
   */
  classes?: SelectorValuesClasses;
  /**
   * Callback function to extract the value we want to display in the selector from an item
   */
  getSelectedItemLabel: (item: unknown) => string | number;
  /**
   * Callback function to extract the value from an item. This value will be used to remove a selected item
   */
  getSelectedItemValue: (item: unknown) => string | number;
  /**
   * If true, values are displayed as chip.
   */
  multiple?: boolean;
  /**
   * Callback fired when clicking on the cross button of a chip element
   */
  onRemoveValue?: (value: number | string) => void;
  /**
   * The selected values.
   */
  selectedItems?: unknown;
  /**
   * Size of the component.
   */
  size: SelectorSize;
};

const SelectorValues: React.FC<SelectorValuesProps> = ({
  classes,
  getSelectedItemLabel,
  getSelectedItemValue,
  multiple = false,
  onRemoveValue,
  selectedItems,
  size,
}) => {
  const handleRemove = React.useCallback(
    (itemToRemove: number | string) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event?.stopPropagation();
        const value = getSelectedItemValue?.(itemToRemove);
        onRemoveValue?.(value);
      },
    [onRemoveValue, getSelectedItemValue],
  );

  if (!multiple && !Array.isArray(selectedItems)) {
    return (
      <Typography
        className={clsx('bs-fabrique-selector-values', classes?.typography)}
        variant="body-md"
      >
        {getSelectedItemLabel?.(selectedItems)}
      </Typography>
    );
  }
  if (Array.isArray(selectedItems)) {
    return (
      <div className={clsx('bs-fabrique-selector-values', classes?.values)}>
        {selectedItems.map((item) => {
          const itemLabel = getSelectedItemLabel?.(item);
          const itemValue = getSelectedItemValue?.(item);
          return (
            <Chip
              key={itemValue}
              className={clsx(
                'bs-fabrique-selector-values__chip',
                classes?.chip,
              )}
              color="grey"
              onClose={handleRemove?.(item)}
              size={size}
              variant="weak"
            >
              {itemLabel}
            </Chip>
          );
        })}
      </div>
    );
  }
  return null;
};

export default React.memo(SelectorValues);
