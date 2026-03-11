import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Immutable from 'seamless-immutable';
import { FixedSizeList as VirtualizedList } from 'react-window';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuListMaterial from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import type { Theme } from '@material-ui/core/styles';

import Select, {
  // @ts-expect-error
  NamedProps,
  components,
  // @ts-expect-error
  MenuProps,
  // @ts-expect-error
  MenuListComponentProps,
  // @ts-expect-error
  OptionProps,
  // @ts-expect-error
  PlaceholderProps,
  // @ts-expect-error
  ValueContainerProps,
  // @ts-expect-error
  ControlProps,
  // @ts-expect-error
  SingleValueProps,
  // @ts-expect-error
  InputActionTypes,
} from 'react-select';
// @ts-expect-error
import type { NoticeProps } from 'react-select/src/components/Menu';
// @ts-expect-error
import { GroupHeadingProps } from 'react-select/src/components/Group';
import { ActionMeta } from 'react-select/lib/types';
// @ts-expect-error
import { CSSProperties } from '@emotion/serialize';
import useIsVisibleOnScreen from '../../hooks/useIsVisibleOnScreen';

export type OptionTypeBase =
  | {
      label: string;
      value: string;
      hasError?: boolean;
    }
  | {
      label: string;
      value: number;
    }
  | {
      label: string;
      options: OptionTypeBase[];
    };

type BaseProps<T extends OptionTypeBase> = {
  /** Placeholder to display when all the options available are selected */
  allOptionsPlaceholder?: string;
  blurOnSelect?: boolean;
  chipsRenderer?: (props: ChipsRendererProps<T>) => React.ReactNode;
  classes?: Record<string, CSSProperties>;
  closeMenuOnSelect?: boolean;
  defaultNumberShown?: number;
  error?: boolean;
  filterOption?: (option: T, inputValue: string) => boolean;
  headerListRenderer?: () => React.ReactChild;
  id?: number | string;
  inScrollBar?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isMenuListPaddingDisabled?: boolean;
  isMenuListVirtualized?: boolean;
  isSearchable?: boolean;
  itemRenderer?: (props: ItemRendererProps<T>) => React.ReactNode;
  leftIcon?: React.ReactNode;
  name?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onEndMenuListReach?: () => void;
  onInputChange?: (value: string, meta: { action: InputActionTypes }) => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  openMenuOnClear?: boolean;
  openMenuOnFocus?: boolean;
  options: T[] | Immutable.ImmutableArray<T>;
  placeholder?: string;
  removeIndicator?: boolean;
  onConfirm?: () => void;
  stopEventPropagationOnClickAway?: boolean;
  hideChips?: boolean;
  /** Placeholder to be displayed when the selector is searchable, and focused (ie. search is active) */
  searchPlaceholder?: string;
  withoutConfirmButton?: boolean;
  withoutNullValues?: boolean;
  withoutPortal?: Boolean;
  withoutSelectAll?: boolean;
  /**
   * @description Max amount of options you can select before other options are disabled
   */
  maxSelectedItems?: number;
  /**
   * @description If this component only handles selected value in options and maxSelectedItems is given,
   * selected count outside of component needs to be given
   */
  alreadySelectedCount?: number;
} & Omit<NamedProps, 'options' | 'isMulti' | 'onChange' | 'value'>;

export type ItemRendererProps<T extends OptionTypeBase> = {
  children: React.ReactNode;
  data: T;
  isDisabled: boolean;
  isSelected: boolean;
};

export type ChipsRendererProps<T extends OptionTypeBase> = {
  data: T;
  onDelete: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type OwnProps<T extends OptionTypeBase> =
  | ({
      isMulti: true;
      onChange?: (values: T[] | OptionTypeBase[]) => void;
      value?: T[] | OptionTypeBase[];
    } & BaseProps<T>)
  | ({
      isMulti?: false;
      onChange?: (value: T | OptionTypeBase) => void;
      value?: T | OptionTypeBase | null;
    } & BaseProps<T>);

export type MuiSelectProps<T extends OptionTypeBase> = OwnProps<T>;

function MaterialUISelector<T extends OptionTypeBase>(
  props: MuiSelectProps<T>,
) {
  const {
    allOptionsPlaceholder,
    blurOnSelect,
    chipsRenderer,
    closeMenuOnSelect = true,
    defaultNumberShown,
    defaultValue,
    headerListRenderer,
    id,
    inScrollBar,
    isDisabled,
    isMenuListPaddingDisabled,
    isMenuListVirtualized,
    isMulti,
    isSearchable,
    itemRenderer,
    leftIcon,
    menuPortalTarget,
    name,
    onBlur,
    onChange,
    onEndMenuListReach,
    onFocus,
    onMenuClose: onClose,
    onMenuOpen: onOpen,
    stopEventPropagationOnClickAway = false,
    onInputChange,
    onConfirm,
    openMenuOnClear,
    openMenuOnFocus,
    options,
    placeholder,
    removeIndicator,
    searchPlaceholder,
    value,
    withoutConfirmButton,
    withoutNullValues,
    withoutPortal = false,
    withoutSelectAll,
    hideChips = false,
    forceBlurOnSelect = false,
    isOptionDisabled,
    maxSelectedItems,
    alreadySelectedCount,
    ...restProps
  } = props;

  const classes = useStyles();

  const selectRef = useRef(null);

  const [containerRef, setContainerRef] = useState(null);
  const [displayMore, setDisplayMore] = useState(false);
  /** Keeps track of the focus state of the inner Select component */
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (data: T | T[], { action }: ActionMeta) => {
    if (!onChange) return;

    if (!withoutConfirmButton && !onConfirm) {
      // needed as it conflict with formik sometine
      selectRef.current?.select?.blur();
    }

    if (Array.isArray(data)) {
      if (isMulti) {
        onChange(data);
      }
    } else {
      // @ts-expect-error
      onChange(data);
    }

    /* when clearing the values, the selected items gets updated properly (asynchronous behavior) and the
    menu reopens with empty values instead of closing the menu */
    if (openMenuOnClear && action === 'clear') {
      selectRef.current.select.blur();
    }

    if (blurOnSelect && forceBlurOnSelect) {
      selectRef.current.select.blur();
    }

    if (blurOnSelect && (action === 'clear' || action === 'remove-value')) {
      setTimeout(() => selectRef.current.select.blur(), 1);
    }
  };

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) {
        e.target.name = name;
        onBlur(e);
      }
    },
    [onBlur, name],
  );

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const onMenuOpen = React.useCallback(() => {
    setMenuIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const onMenuClose = React.useCallback(() => {
    setMenuIsOpen(false);
    onClose?.();
  }, [onClose]);

  const handleConfirm = React.useCallback(() => {
    onConfirm?.();
    setMenuIsOpen(false);
    onClose?.();
  }, [onClose, onConfirm]);

  let _menuPortalTarget = withoutPortal
    ? undefined
    : menuPortalTarget || document.querySelector('body');
  if (inScrollBar) {
    _menuPortalTarget = containerRef;
  }

  const getStyles = () => {
    if (inScrollBar) {
      return {
        menuPortal: (base: CSSProperties) => ({
          ...base,
          left: '0px',
          position: 'absolute',
          top: '100%',
          zIndex: 9999,
        }),
      };
    }
    return {
      menuPortal: (base: CSSProperties) => ({
        ...base,
        zIndex: 9999,
      }),
    };
  };

  useEffect(() => {
    // Manually enforce focus on the input on asyncrhounous select
    if (selectRef?.current?.state?.menuIsOpen && onInputChange) {
      selectRef?.current?.select?.focusInput();
    }
  }, [options, onInputChange]);

  const emptyIndicatorsContainer = useCallback(() => null, []);

  const displayAllOptionsPlaceholder = useMemo(
    () =>
      !isFocused &&
      !!isMulti &&
      !!allOptionsPlaceholder &&
      options?.length !== 0 &&
      options?.length === value?.length,
    [isFocused, isMulti, allOptionsPlaceholder, options, value],
  );

  const displaySearchPlaceholder =
    isSearchable && isFocused && !!searchPlaceholder;

  // When the selector is inside a modal (e.g. a Dialog), this intercepts the backdrop events
  // and only closes the menu instead of closing the modal as well.
  const menuRef = useRef(null);
  const controlRef = useRef(null);
  useEffect(() => {
    if (!stopEventPropagationOnClickAway) return () => {};

    const listener = (event: Event) => {
      if (!menuRef.current || !controlRef.current) return;

      if (
        (event.type === 'touchstart' || event.type === 'mousedown') &&
        (controlRef.current.contains(event.target) ||
          menuRef.current.contains(event.target))
      )
        return;

      if (event.type === 'keydown' && (event as KeyboardEvent).key !== 'Escape')
        return;

      onMenuClose();
      event.stopPropagation();
    };
    document.addEventListener('mousedown', listener, { capture: true });
    document.addEventListener('touchstart', listener, { capture: true });
    document.addEventListener('keydown', listener, { capture: true });

    return () => {
      document.removeEventListener('mousedown', listener, { capture: true });
      document.removeEventListener('touchstart', listener, { capture: true });
      document.removeEventListener('keydown', listener, { capture: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!onMenuClose, stopEventPropagationOnClickAway]);

  useEffect(() => {
    if (!withoutConfirmButton || !onConfirm) return () => {};

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onConfirm?.();
      }
    };

    document.addEventListener('keydown', listener, { capture: true });
    return () => {
      document.removeEventListener('keydown', listener, { capture: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!onConfirm, withoutConfirmButton]);

  return (
    <SelectorContext.Provider
      value={{
        displayMore,
        setDisplayMore,
      }}
    >
      <div
        ref={(ref) => {
          if (inScrollBar) {
            setContainerRef(ref);
          }
        }}
        className={clsx(classes.relative, {
          [classes.error]: props.error,
        })}
      >
        {/* @ts-expect-error */}
        <Select
          captureMenuScroll
          classes={{ ...classes, ...(props?.classes ?? {}) }}
          components={{
            Control,
            Menu,
            MenuList: MenuList(headerListRenderer, onEndMenuListReach),
            Option: Option(itemRenderer),
            MultiValueContainer,
            MultiValueLabel,
            MultiValueRemove: MultiValueRemove(chipsRenderer),
            Placeholder,
            NoOptionsMessage,
            SingleValue: SingleValue(chipsRenderer),
            GroupHeading,
            ValueContainer: ValueContainer(leftIcon),
            ...(removeIndicator
              ? { IndicatorsContainer: emptyIndicatorsContainer }
              : {}),
          }}
          controlRef={controlRef}
          defaultValue={defaultValue}
          hideChips={hideChips}
          hideSelectedOptions={false}
          id={id}
          inScrollBar={inScrollBar}
          isDisabled={isDisabled}
          isMenuListPaddingDisabled={isMenuListPaddingDisabled}
          isMenuListVirtualized={isMenuListVirtualized}
          isMulti={isMulti}
          isOptionDisabled={isOptionDisabled}
          isSearchable={isSearchable}
          menuIsOpen={menuIsOpen}
          menuPortalTarget={_menuPortalTarget}
          menuRef={menuRef}
          onChange={handleChange}
          onFocus={handleFocus}
          onMenuClose={onMenuClose}
          onMenuOpen={onMenuOpen}
          openMenuOnFocus={openMenuOnFocus}
          options={options}
          placeholder={placeholder}
          styles={getStyles()}
          tabSelectsValue={false}
          value={withoutNullValues ? !!value && value : value}
          withoutSelectAll={withoutSelectAll}
          {...restProps}
          // Mandatory for multi selection use
          ref={selectRef}
          allOptionsPlaceholder={allOptionsPlaceholder}
          alreadySelectedCount={alreadySelectedCount}
          closeMenuOnSelect={closeMenuOnSelect}
          customConfirmButton={!!onConfirm}
          defaultNumberShown={defaultNumberShown}
          displayAllOptionsPlaceholder={displayAllOptionsPlaceholder}
          displaySearchPlaceholder={displaySearchPlaceholder}
          maxSelectedItems={maxSelectedItems}
          onBlur={handleBlur}
          onConfirm={handleConfirm}
          onInputChange={onInputChange}
          searchPlaceholder={searchPlaceholder}
          selectRef={selectRef}
          withoutConfirmButton={withoutConfirmButton}
        />
      </div>
    </SelectorContext.Provider>
  );
}

export const SelectorContext = createContext<{
  displayMore: boolean;
  setDisplayMore: (value: boolean) => void;
}>({
  displayMore: false,
  setDisplayMore: (_) => {},
});

/* ***** */
/* Overiding some behavior to fit with expected experiences */
/* ***** */
const SelectContext = createContext({
  selected: [],
  onSelect: (_: any) => {},
});

function Menu<T extends OptionTypeBase>(props: MenuProps<T, boolean, any>) {
  const DEFAULT_MAX_HEIGHT = props.maxMenuHeight ?? 300;

  const classes = useStyles();
  const [selected, setSelected] = useState<T[]>([...props.getValue()]);
  const [computedMaxHeight, setComputedMaxHeight] =
    useState(DEFAULT_MAX_HEIGHT);
  const { t } = useTranslation(['common']);
  const displayedOption = [
    // @ts-expect-error
    ...props.options.filter((opt) =>
      props.selectProps.filterOption(opt, props.selectProps.inputValue),
    ),
  ];

  const onSelect = (data: T) => {
    // @ts-expect-error
    const indexOf = selected.findIndex((row) => row.value === data.value);
    if (indexOf !== -1) {
      const selectedValuesWithoutIndex = [
        ...selected.slice(0, indexOf),
        ...selected.slice(indexOf + 1),
      ];
      setSelected(selectedValuesWithoutIndex);
      if (
        props.selectProps.withoutConfirmButton ||
        props.selectProps.customConfirmButton
      ) {
        props.setValue(selectedValuesWithoutIndex);
        props.selectProps.openMenuOnFocus &&
          setTimeout(() => props.selectProps.selectRef.current.focus());
      }
      return;
    }
    const selectedValues = [...selected, data];
    setSelected(selectedValues);
    if (
      props.selectProps.withoutConfirmButton ||
      props.selectProps.customConfirmButton
    ) {
      props.setValue(selectedValues);
      props.selectProps.openMenuOnFocus &&
        setTimeout(() => props.selectProps?.selectRef?.current?.focus());
    }
  };

  const handleGlobalSelect = () => {
    if (selected.length > 0) {
      setSelected([]);
      props.setValue([]);
    } else {
      const globalSelectedValues = displayedOption.flatMap((o) => {
        if (o.value !== null && o.value !== undefined) {
          return o;
        }

        return o.options;
      });
      setSelected(globalSelectedValues);
      if (
        props.selectProps.withoutConfirmButton ||
        props.selectProps.customConfirmButton
      ) {
        props.setValue(globalSelectedValues);
        // trick to keep the menu open while selecting options
        props.selectProps.openMenuOnFocus &&
          setTimeout(() => props.selectProps.selectRef.current.focus());
      }
    }
  };

  const handleSubmit = () => {
    props.setValue(selected, 'select-option');
  };

  useEffect(() => {
    if (props.selectProps.menuRef?.current) {
      const menuElement = props.selectProps.menuRef.current;
      const menuRect = menuElement.getBoundingClientRect();

      // Calculate the available space under the input
      const buttonInFooterHeight = 58;
      const footerHeight = props.isMulti ? buttonInFooterHeight : 0;
      const availableSpace = window.innerHeight - menuRect.top - footerHeight;

      // Cap the height at the available space or DEFAULT_MAX_HEIGHT
      const MINIMAL_MAX_HEIGHT = 100;
      const maxHeightComputed = Math.min(
        Math.max(availableSpace, MINIMAL_MAX_HEIGHT),
        DEFAULT_MAX_HEIGHT,
      );

      setComputedMaxHeight(maxHeightComputed);
    }
  }, [
    props.children,
    props.isMulti,
    props.selectProps.menuRef,
    DEFAULT_MAX_HEIGHT,
  ]);

  return (
    <components.Menu {...props} getStyles={resetStyle}>
      <SelectContext.Provider
        value={{
          selected,
          onSelect,
        }}
      >
        <Paper ref={props.selectProps.menuRef} square className={classes.menu}>
          <div
            className={classes.list}
            style={{
              maxHeight: computedMaxHeight,
            }}
          >
            {props.children}
          </div>

          {props.isMulti && (
            <div className={classes.footer}>
              {!props?.selectProps?.withoutSelectAll ? (
                <Button
                  className={clsx(classes.button, classes.selectButton)}
                  color="secondary"
                  onClick={handleGlobalSelect}
                  onTouchEnd={handleGlobalSelect} // for Compatibility with phones
                >
                  {selected?.length > 0
                    ? t('selector.unselectAll')
                    : t('selector.selectAll')}
                </Button>
              ) : (
                <div />
              )}
              {!props.selectProps.withoutConfirmButton && (
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={
                    props.selectProps.customConfirmButton
                      ? props.selectProps.onConfirm
                      : handleSubmit
                  }
                  onTouchEnd={
                    props.selectProps.customConfirmButton
                      ? props.selectProps.onConfirm
                      : handleSubmit
                  } // for compatibility with phones
                >
                  {t('selector.validate')}
                </Button>
              )}
            </div>
          )}
        </Paper>
      </SelectContext.Provider>
    </components.Menu>
  );
}

function Option<T extends OptionTypeBase>(
  itemRenderer?: (props: {
    children: React.ReactNode;
    data: T;
    isDisabled: boolean;
    isSelected: boolean;
  }) => React.ReactNode,
) {
  return (props: OptionProps<OptionTypeBase, boolean, any>) => {
    return (
      <SelectContext.Consumer>
        {({ selected, onSelect }) => {
          const isSelected = selected.some(
            (option) => option?.value === props.data?.value,
          );

          // alreadySelectedCount is necessary if items selected are outside of options
          const isSelectedItemLimitReached = props.selectProps.maxSelectedItems
            ? selected.length + (props.selectProps.alreadySelectedCount || 0) >=
              props.selectProps.maxSelectedItems
            : false;

          const isDisabledBecauseOfMaxLimit = isSelectedItemLimitReached
            ? !isSelected
            : false;

          const handleClick = (
            ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
          ) => {
            if (!props.isDisabled && !isDisabledBecauseOfMaxLimit) {
              if (props.isMulti) {
                onSelect(props.data);
                return;
              }
              props.innerProps.onClick(ev);
            }
          };

          return (
            <components.Option
              {...props}
              getStyles={resetStyle}
              innerProps={{
                ...props.innerProps,
                onClick: handleClick,
              }}
            >
              {itemRenderer &&
                itemRenderer({
                  data: props.data,
                  children: props.children,
                  isSelected,
                  isDisabled:
                    props.isDisabled ||
                    (!isSelected && isDisabledBecauseOfMaxLimit),
                })}
              {!itemRenderer && (
                <MenuItem
                  dense
                  disabled={
                    props.isDisabled ||
                    (!isSelected && isDisabledBecauseOfMaxLimit)
                  }
                  selected={isSelected && !props.isMulti}
                >
                  {props.isMulti && <Checkbox checked={isSelected} />}
                  {props.children}
                </MenuItem>
              )}
            </components.Option>
          );
        }}
      </SelectContext.Consumer>
    );
  };
}

const ShowMoreButton: React.FC<{
  overflowValues: number;
}> = ({ overflowValues }) => {
  const { t } = useTranslation('common');

  return (
    <SelectorContext.Consumer>
      {({ displayMore, setDisplayMore }) => (
        <Chip
          aria-hidden
          color="secondary"
          label={
            displayMore
              ? t('showLess')
              : t('showMore', {
                  count: overflowValues,
                })
          }
          onClick={() => {
            setDisplayMore(!displayMore);
          }}
          onMouseDown={(ev: React.MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
          }}
          variant="outlined"
        />
      )}
    </SelectorContext.Consumer>
  );
};

// @ts-expect-error
const getItemPositionData = (selectProps, data) => {
  /**
  This function is used to get the index of the current item in the selected values
  */
  const selectedValues = selectProps?.value ?? [];
  const index =
    // @ts-expect-error
    selectedValues.findIndex((value) => value?.value === data?.value) ?? -1;
  const maxDisplay = selectProps?.defaultNumberShown ?? 4;
  const overflowValues = selectedValues.length - maxDisplay;

  return {
    data,
    index,
    maxDisplay,
    overflowValues,
    selectedValues,
  };
};

function MultiValueRemove<T extends OptionTypeBase>(
  chipsRenderer?: (props: {
    data: T;
    onDelete: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    selector?: any;
  }) => React.ReactNode,
) {
  const classes = useStyles();
  const catchFocusAndEvent = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  return (props: any) => {
    const { selectedValues, index, maxDisplay, overflowValues } =
      getItemPositionData(props.selectProps, props.data);

    const handleDelete = (...args: any) => {
      props.innerProps.onClick(...args);
      // Dirty trick gettting the ref pass as props for manual trigger of blur
      props?.selectProps?.selectRef?.current?.select?.blur();
    };

    return (
      <SelectorContext.Consumer>
        {({ displayMore }) => (
          <div className={classes.row}>
            <components.MultiValueRemove getStyles={resetStyle}>
              <div className={classes.chip} onMouseDown={catchFocusAndEvent}>
                {(index < maxDisplay || displayMore) && props.data && (
                  <>
                    {chipsRenderer &&
                      chipsRenderer({
                        data: props.data,
                        onDelete: handleDelete,
                      })}
                    {!chipsRenderer && (
                      <Chip label={props.data.label} onDelete={handleDelete} />
                    )}
                  </>
                )}
                {index === maxDisplay && !displayMore && (
                  <ShowMoreButton overflowValues={overflowValues} />
                )}
              </div>
            </components.MultiValueRemove>
            {displayMore &&
              overflowValues > 0 &&
              index === selectedValues.length - 1 && (
                <ShowMoreButton overflowValues={overflowValues} />
              )}
          </div>
        )}
      </SelectorContext.Consumer>
    );
  };
}

/* ***** */
/* From here only styling with material UI */
/* ***** */
export function Control<T extends OptionTypeBase>(
  props: ControlProps<T, boolean, any>,
) {
  const classes = useStyles();

  return (
    <components.Control {...props}>
      <div
        ref={props.selectProps.controlRef}
        className={clsx(classes.control, props?.selectProps?.classes?.control)}
      >
        {props.children}
      </div>
    </components.Control>
  );
}

function MenuList<T extends OptionTypeBase>(
  headerListRenderer: (() => React.ReactChild) | null = null,
  onEndMenuListReach: () => void,
) {
  const [_, currentElement, scrollRef] = useIsVisibleOnScreen<HTMLDivElement>(
    60,
    500,
    onEndMenuListReach,
  );

  return (props: MenuListComponentProps<T, boolean, any>) => {
    const displayedOption = [
      // @ts-expect-error
      ...props.selectProps.options.filter((opt) =>
        props.selectProps.filterOption(opt, props.selectProps.inputValue),
      ),
    ];
    const hasValue = displayedOption?.length > 0;

    return (
      <div ref={scrollRef}>
        <components.MenuList {...props} getStyles={menuOptionListStyle}>
          {headerListRenderer && headerListRenderer()}
          {props.selectProps.isMenuListVirtualized && hasValue ? (
            // @ts-expect-error
            <VirtualizedList
              height={
                displayedOption.length < 300 ? displayedOption.length * 50 : 300
              }
              itemCount={displayedOption.length}
              itemSize={48}
            >
              {({ index, style }) => (
                <div style={style}>{props.children[index]}</div>
              )}
            </VirtualizedList>
          ) : (
            <MenuListMaterial
              dense
              disablePadding={props.selectProps.isMenuListPaddingDisabled}
            >
              {props.children}
            </MenuListMaterial>
          )}
          {hasValue && <div ref={currentElement} />}
        </components.MenuList>
      </div>
    );
  };
}

const MultiValueContainer = (props: {
  children: React.ReactNode[];
  data: any;
  selectProps?: {
    displayAllOptionsPlaceholder: boolean;
    displaySearchPlaceholder: boolean;
    hideChips: boolean;
  };
}) => {
  const { displayAllOptionsPlaceholder, displaySearchPlaceholder, hideChips } =
    props.selectProps ?? {};
  const classes = useStyles();

  const { index, maxDisplay, data } = getItemPositionData(
    props.selectProps,
    props.data,
  );

  return (
    <SelectorContext.Consumer>
      {({ displayMore }) => {
        const noPlaceLeftForChip =
          (index > maxDisplay && !displayMore && !!data) ||
          displayAllOptionsPlaceholder ||
          displaySearchPlaceholder;

        const className =
          noPlaceLeftForChip || hideChips ? classes.displayNone : classes.reset;

        return (
          <components.MultiValueContainer
            {...props}
            getStyles={resetStyle}
            innerProps={{ className }}
          >
            {props?.children?.[1]}
          </components.MultiValueContainer>
        );
      }}
    </SelectorContext.Consumer>
  );
};

// Don't display the label as the hack we only shwo the remove as it the
// only one to have delete function
const MultiValueLabel = (): null => {
  return null;
};

function NoOptionsMessage<T extends OptionTypeBase>(
  props: NoticeProps<T, boolean, any>,
) {
  const classes = useStyles();

  return (
    <components.NoOptionsMessage {...props} getStyles={resetStyle}>
      <div className={classes.emptyState}>
        <Typography color="textSecondary">{props.children}</Typography>
      </div>
    </components.NoOptionsMessage>
  );
}

function Placeholder<T extends OptionTypeBase>(
  props: PlaceholderProps<T, boolean, any>,
) {
  const classes = useStyles();
  return (
    <components.Placeholder
      {...props}
      className={props.selectProps?.hideChips ? classes.displayNone : ''}
      getStyles={resetStyle}
    >
      {!props.isFocused && (
        <Typography
          className={props?.selectProps?.classes?.placeholder}
          color="textSecondary"
        >
          {props.children}
        </Typography>
      )}
    </components.Placeholder>
  );
}

function GroupHeading<T extends OptionTypeBase>(
  props: GroupHeadingProps<T, boolean, any>,
) {
  const classes = useStyles();

  return (
    <components.GroupHeading {...props} getStyles={resetStyle}>
      <div className={classes.groupHeader}>
        <Typography color="textSecondary">{props.children}</Typography>
      </div>
    </components.GroupHeading>
  );
}

function ValueContainer<T extends OptionTypeBase>(leftIcon: React.ReactNode) {
  const classes = useStyles();

  return (props: ValueContainerProps<T, boolean, any>) => {
    let content;

    const {
      displayAllOptionsPlaceholder,
      displaySearchPlaceholder,
      allOptionsPlaceholder,
      searchPlaceholder,
    } = props.selectProps;

    let customPlaceholder;
    if (displayAllOptionsPlaceholder && allOptionsPlaceholder) {
      customPlaceholder = allOptionsPlaceholder;
    } else if (displaySearchPlaceholder && searchPlaceholder) {
      customPlaceholder = searchPlaceholder;
    }

    if (customPlaceholder) {
      content = (
        <div className={classes.relative}>
          {!props.selectProps?.inputValue && (
            <Typography
              className={clsx(
                props?.selectProps?.classes?.placeholder,
                classes.placeholderAbsolutePosition,
              )}
              color="textSecondary"
            >
              {customPlaceholder}
            </Typography>
          )}
          {/* This is a hack to make the entire select clickable
          Make sure the children components are under display: none rule */}
          {props.children}
        </div>
      );
    } else if (props.selectProps?.hideChips) {
      content = (
        <>
          <Typography
            className={props?.selectProps?.classes?.placeholder}
            color="textSecondary"
          >
            {props.selectProps?.placeholder}
          </Typography>
          {/* This is a hack to make the entire select clickable
          Make sure the children components are under display: none rule */}
          {props.children}
        </>
      );
    } else if (props.hasValue && !props.isMulti) {
      content = <div>{props.children}</div>;
    } else {
      content = props.children;
    }

    return (
      <components.ValueContainer {...props} getStyles={resetStyle}>
        <div className={classes.valueContainer}>
          {leftIcon && <div className={classes.icon}>{leftIcon}</div>}
          {content}
        </div>
      </components.ValueContainer>
    );
  };
}

function SingleValue<T extends OptionTypeBase>(
  chipsRenderer?: (props: { data: T; onDelete: () => void }) => React.ReactNode,
) {
  return (props: SingleValueProps<T, any>) => {
    return (
      <components.SingleValue {...props}>
        {chipsRenderer &&
          chipsRenderer({
            data: props.data,
            onDelete: props.clearValue,
          })}
        {!chipsRenderer && props.children}
      </components.SingleValue>
    );
  };
}

const resetStyle = () => ({});
const menuOptionListStyle = () => ({
  minWidth: 250,
  overflowX: 'auto',
});
const useStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: theme.spacing(1),
  },
  buttonShowMore: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: '16px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    textTransform: 'none',
    width: 'fit-content',
    '&:hover': {
      backgroundColor: '#eee',
    },
  },
  chip: {
    marginRight: 4,
  },
  container: {},
  control: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    width: '100%',
  },
  displayNone: { display: 'none' },
  emptyState: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  error: {
    borderRadius: theme.spacing(1) / 2,
    boxShadow: `0 0 0 1px ${theme.palette.error.main}`,
  },
  footer: {
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.grey[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(1),
  },
  groupHeader: {
    paddingLeft: theme.spacing(1),
  },
  icon: { marginRight: 8 },
  leftIcon: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(1),
    transform: 'rotate(180deg)',
  },
  list: {
    overflowY: 'auto',
  },
  menu: {
    borderRadius: 5,
    boxShadow: theme.shadows[2],
    marginTop: theme.spacing(1),
    minWidth: 250,
    overflowX: 'auto',
    zIndex: 1500,
  },
  placeholderAbsolutePosition: {
    left: 3,
    position: 'absolute',
    textWrap: 'nowrap',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  relative: {
    position: 'relative',
  },
  reset: {
    all: 'unset',
  },
  rightIcon: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(1),
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  selectButton: {
    textTransform: 'none',
  },
  valueContainer: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
}));

export default MaterialUISelector;
