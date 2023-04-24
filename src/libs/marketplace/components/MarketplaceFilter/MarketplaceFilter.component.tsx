// @ts-nocheck
import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  CSSProperties,
} from 'react';
import classNames from 'classnames';
import { Checkbox } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import throttle from 'lodash/throttle';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import './MarketplaceFilter.css';

type Option = { value: number; label: string };
export type Props = {
  text: string;
  options: (
    | Option
    | {
        label: string;
        icon?: boolean;
        options: Option[];
      }
  )[];
  selectedOptions: number[];
  onSelect: (selected: number[]) => void;
  levelVariant: boolean;
};

const MarketplaceFilterCSSOnly: React.FC<Props> = ({
  text,
  options,
  selectedOptions = [],
  onSelect,
  levelVariant,
}) => {
  const { t } = useTranslation(['common']);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedOptions);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const handleCloseMenu = useCallback(() => {
    setSelected(selectedOptions);
    setIsOpen(false);
  }, [selectedOptions]);

  const handleOpenMenu = useCallback(() => {
    setSelected(selectedOptions);
    setIsOpen(true);
  }, [selectedOptions]);

  // Close menu on scroll outside of the menu
  useEffect(() => {
    const onScroll = throttle((ev: Event) => {
      if (
        isOpen &&
        !ev.target?.className?.includes('bs-marketplace-filter__menu__list')
      ) {
        handleCloseMenu();
      }
    }, 500);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [handleCloseMenu, isOpen]);

  const handleSelect = useCallback(
    (value: number) => () => {
      const indexOf = selected.indexOf(value);
      if (indexOf === -1) {
        setSelected([...selected, value]);
        return;
      }
      setSelected([
        ...selected.slice(0, indexOf),
        ...selected.slice(indexOf + 1),
      ]);
    },
    [selected],
  );

  const handleSelectAll = useCallback(() => {
    if (selected.length > 0) {
      setSelected([]);
      return;
    }
    setSelected(
      options
        .flatMap((opt) => (opt.options ? opt.options : opt))
        .filter((opt) => opt?.value !== undefined)
        .map((opt) => opt.value),
    );
  }, [options, selected.length]);

  const handleValidate = useCallback(() => {
    onSelect(selected);
    setIsOpen(false);
  }, [onSelect, selected]);

  return (
    <>
      <button
        ref={anchorRef}
        className={classNames('bs-marketplace-filter', {
          'bs-marketplace-filter--open': isOpen,
          'bs-marketplace-filter--selected': selectedOptions.length > 0,
        })}
        onClick={handleOpenMenu}
        type="button"
      >
        <div
          className={classNames('bs-marketplace-filter__placeholder', {
            'bs-marketplace-filter__placeholder--open': isOpen,
          })}
        >
          {text}
        </div>

        <div className="bs-marketplace-filter__right">
          {selectedOptions.length > 0 && (
            <div className="bs-marketplace-filter__right__chip">
              {selectedOptions.length}
            </div>
          )}
          <KeyboardArrowDownIcon
            color="inherit"
            classes={{
              root: classNames(
                'bs-marketplace-filter__right__placeholder-icon',
                {
                  'bs-marketplace-filter__right__placeholder-icon--open':
                    isOpen,
                },
              ),
            }}
          />
        </div>
      </button>

      <Popper
        open={!!anchorRef.current && isOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        style={{
          zIndex: 'var(--z-index-modal)',
        }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'left top',
            }}
          >
            <ClickAwayListener onClickAway={handleCloseMenu} disableReactTree>
              <div className="bs-marketplace-filter__menu">
                <div
                  className={classNames('bs-marketplace-filter__menu__list', {
                    'bs-marketplace-filter__menu__list--level': levelVariant,
                  })}
                >
                  {options.map((opt) => {
                    if (opt?.options) {
                      const newOpt = opt as {
                        label: string;
                        icon?: boolean;
                        options: Option[];
                      };
                      return (
                        <React.Fragment key={newOpt.label}>
                          <div className="bs-marketplace-filter__menu__list__item-group">
                            {newOpt.icon && (
                              <LocationOnIcon className="bs-marketplace-filter__menu__list__item-group__icon" />
                            )}
                            {opt.label}
                          </div>
                          {newOpt.options.map((subOption) => {
                            return (
                              <div
                                className="bs-marketplace-filter__menu__list__sub-item"
                                key={subOption.value}
                              >
                                <Checkbox
                                  color="primary"
                                  checked={selected.includes(subOption.value)}
                                  onClick={handleSelect(subOption.value)}
                                  className="bs-marketplace-filter__menu__list__sub-item__checkbox"
                                />
                                {subOption.label}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      );
                    }

                    const simpleOption = opt as Option;
                    return (
                      <div
                        className="bs-marketplace-filter__menu__list__item"
                        key={simpleOption.value}
                        style={
                          {
                            '--levelChipColor':
                              simpleOption?.levelColor ?? '#f00',
                          } as CSSProperties
                        }
                      >
                        {levelVariant && (
                          <div className="bs-marketplace-filter__menu__list__item__chip__level" />
                        )}
                        <Checkbox
                          color="primary"
                          checked={selected.includes(simpleOption.value)}
                          onClick={handleSelect(simpleOption.value)}
                          className="bs-marketplace-filter__menu__list__item__checkbox"
                        />
                        {simpleOption.label}
                      </div>
                    );
                  })}
                </div>
                <div className="bs-marketplace-filter__menu__buttons">
                  <button
                    onClick={handleSelectAll}
                    className="bs-marketplace-filter__menu__buttons__select"
                    type="button"
                  >
                    {selected?.length > 0
                      ? t('selector.unselectAll')
                      : t('selector.selectAll')}
                  </button>
                  <button
                    onClick={handleValidate}
                    className="bs-marketplace-filter__menu__buttons__confirm"
                    type="button"
                  >
                    {t('selector.validate')}
                  </button>
                </div>
              </div>
            </ClickAwayListener>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default MarketplaceFilterCSSOnly;
