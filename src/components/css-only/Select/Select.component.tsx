import React, {
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import ClearIcon from '@material-ui/icons/Clear';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import useOnClickOutside from '../../../hooks/useClickOutside';
import useOnScrollOutside from '../../../hooks/useScrollOutside';
import './style.css';

type Option = {
  label: string;
  value: string;
};

export type Props = {
  value: string | null;
  placeholder: string;
  options: Option[];
  isClearable?: boolean;
  onChange: (value: string) => void;
};

type SelectOptionProps = {
  option: Option;
  onClick: (option: string) => void;
};

const SelectOption: React.FC<SelectOptionProps> = React.memo(
  ({ option, onClick }) => {
    const handleOptionClick: MouseEventHandler<HTMLButtonElement> =
      useCallback(() => {
        option?.value && onClick(option.value);
      }, [option, onClick]);

    return (
      <li className="bs-select__dropdown__list__item">
        <button type="button" onClick={handleOptionClick}>
          {option?.label ?? ''}
        </button>
      </li>
    );
  },
);

const Select: React.FC<Props> = React.memo(
  ({ value, placeholder, options, isClearable, onChange }) => {
    const selectContainer = useRef(null);
    const [isOptionListOpen, setIsOptionListOpen] = useState(false);

    const handleCloseOptionList = useCallback(() => {
      setIsOptionListOpen(false);
    }, []);

    useOnScrollOutside(selectContainer, handleCloseOptionList);
    useOnClickOutside(selectContainer, handleCloseOptionList);

    const handleSelectOption = useCallback(
      (option: string | null) => {
        onChange(option);
        setIsOptionListOpen(false);
      },
      [onChange],
    );

    const handleClear: MouseEventHandler<HTMLButtonElement> = useCallback(
      (event) => {
        event.stopPropagation();
        handleSelectOption(null);
      },
      [handleSelectOption],
    );

    const toggleOpenOptionList: MouseEventHandler<HTMLButtonElement> =
      useCallback(() => {
        setIsOptionListOpen((prevState) => !prevState);
      }, []);

    const handleOnOptionClick = useCallback(
      (optionValue: string) => handleSelectOption(optionValue),
      [handleSelectOption],
    );

    const valueTitle = useMemo(
      () => options?.find((option) => option.value === value)?.label ?? null,
      [options, value],
    );

    return (
      <div className="bs-select__container" ref={selectContainer}>
        <button
          type="button"
          className={classNames('bs-select__button', {
            'bs-select__focused': value,
            'bs-select__text__primary': value,
          })}
          onClick={toggleOpenOptionList}
        >
          <div
            className={classNames('bs-select__input__container', {
              'bs-select__text__primary': value,
            })}
          >
            <span
              className={classNames('bs-select__input__container__text', {
                'bs-select__text__primary': value,
              })}
            >
              {valueTitle ?? placeholder}
            </span>

            <div
              className={classNames('bs-select__input__container__icons', {
                'bs-select__text__primary': value,
                'bs-select__idle__text': !value,
              })}
            >
              {isClearable && value && (
                <button type="button" onClick={handleClear}>
                  <ClearIcon />
                </button>
              )}
              <KeyboardArrowDown />
            </div>
          </div>
        </button>

        {isOptionListOpen && (
          <ul
            className={classNames(
              'bs-select__dropdown__list',
              'bs-select__idle__text',
            )}
          >
            {!!options.length &&
              options.map((option) => (
                <SelectOption
                  key={option.value}
                  onClick={handleOnOptionClick}
                  option={option}
                />
              ))}
          </ul>
        )}
      </div>
    );
  },
);

export const SelectForStorybook = marketplaceCssHoc()(Select);

export default Select;
