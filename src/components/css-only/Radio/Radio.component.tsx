import React, { useCallback } from 'react';

import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  name: string;
  label: string;
  isChecked: boolean;
  value: string;
  className?: string;
  disabled?: boolean;
  onClick: (value: string) => void;
  labelRight?: boolean;
};

const Checkbox: React.FC<Props> = React.memo(
  ({
    isChecked,
    label,
    name,
    value,
    className,
    disabled,
    onClick,
    labelRight,
  }) => {
    const handleOnClick = useCallback(() => {
      onClick(value);
    }, [value, onClick]);

    const labelClass = labelRight
      ? 'bs-radio__label--right'
      : 'bs-radio__label--default';

    return (
      <div className={classNames('bs-radio__container', className)}>
        <label className={labelClass} htmlFor={name}>
          <input
            checked={isChecked}
            className="bs-radio__input"
            disabled={disabled}
            id={name}
            onClick={handleOnClick}
            type="radio"
          />

          {isChecked ? (
            <RadioButtonCheckedIcon
              className={classNames('bs-radio--checked', {
                'bs-radio--disabled': disabled,
              })}
            />
          ) : (
            <RadioButtonUncheckedIcon
              className={classNames('bs-radio--unchecked', {
                'bs-radio--disabled': disabled,
              })}
            />
          )}
          <span className="bs-radio__text">{label}</span>
        </label>
      </div>
    );
  },
);

export const RadioForStorybook = marketplaceCssHoc()(Checkbox);

export default Checkbox;
