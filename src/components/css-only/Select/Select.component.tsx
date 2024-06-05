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

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import useOnClickOutside from '../../../hooks/useClickOutside';
import useOnScrollOutside from '../../../hooks/useScrollOutside';

import './style.css';

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectOptionWithMetaData<T = unknown> = SelectOption & T;

export type Props = {
  id?: string;
  fullWidth?: boolean;
  classes?: {
    buttonContainer?: string;
  };
  value: string | null;
  placeholder: string;
  options: SelectOption[];
  isClearable?: boolean;
  renderListItem?: (option: SelectOption) => React.ReactElement;
  onChange: (value: string) => void;
};

type SelectOptionProps = {
  option: SelectOption;
  renderListItem?: (option: SelectOption) => React.ReactElement;
  onClick: (option: string) => void;
};

const SelectOptionItem: React.FC<SelectOptionProps> = React.memo(
  ({ option, renderListItem, onClick }) => {
    const handleOptionClick: MouseEventHandler<HTMLButtonElement> =
      useCallback(() => {
        option?.value && onClick(option.value);
      }, [option, onClick]);

    const innerListItemRender = useCallback(() => {
      if (!!renderListItem && typeof renderListItem === 'function') {
        return renderListItem(option);
      }
      return option?.label ?? '';
    }, [option, renderListItem]);

    return (
      <li className="bs-select__dropdown__list__item">
        <button onClick={handleOptionClick} type="button">
          {innerListItemRender()}
        </button>
      </li>
    );
  },
);

const Select: React.FC<Props> = React.memo(
  ({
    value,
    placeholder,
    options,
    isClearable,
    fullWidth,
    classes,
    renderListItem,
    onChange,
    id,
  }) => {
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

    const optionsWithoutDuplicates = useMemo(
      () =>
        options?.reduce<SelectOption[]>((accumulator, current) => {
          if (!accumulator.find((item) => item.value === current.value)) {
            accumulator.push(current);
          }
          return accumulator;
        }, []) ?? [],
      [options],
    );

    return (
      <div
        ref={selectContainer}
        className={classNames('bs-select__container', {
          'bs-select--idle-width': !fullWidth,
          'bs-select--full-width': fullWidth,
        })}
        {...(id ? { id } : {})}
      >
        <button
          className={classNames(classes?.buttonContainer, {
            'bs-select__button': !classes?.buttonContainer,
            'bs-select__focused': value && !classes?.buttonContainer,
            'bs-select__text__primary': value && !classes?.buttonContainer,
          })}
          onClick={toggleOpenOptionList}
          type="button"
        >
          <div
            className={classNames('bs-select__input__container', {
              'bs-select__text__primary': value && !classes?.buttonContainer,
            })}
          >
            <span
              className={classNames('bs-select__input__container__text', {
                'bs-select__text__primary': value && !classes?.buttonContainer,
              })}
            >
              {valueTitle ?? placeholder}
            </span>

            <div
              className={classNames('bs-select__input__container__icons', {
                'bs-select__text__primary': value && !classes?.buttonContainer,
                'bs-select__idle__text': !value,
              })}
            >
              {isClearable && value && (
                <button onClick={handleClear} type="button">
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
              {
                'bs-select--idle-width': !fullWidth,
                'bs-select--full-width': fullWidth,
              },
            )}
          >
            {!!optionsWithoutDuplicates.length &&
              optionsWithoutDuplicates.map((option) => (
                <SelectOptionItem
                  key={option.value}
                  onClick={handleOnOptionClick}
                  option={option}
                  renderListItem={renderListItem}
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
