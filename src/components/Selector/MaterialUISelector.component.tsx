import React, { useEffect, useMemo, useRef, useState } from 'react';
import Immutable from 'seamless-immutable';
import { FixedSizeList as VirtualizedList } from 'react-window';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import {
  Theme,
  makeStyles,
  Paper,
  Checkbox,
  Chip,
  Button,
  MenuList as MenuListMaterial,
  MenuItem,
  Typography,
} from '@material-ui/core';
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
import { NoticeProps } from 'react-select/src/components/Menu';
// @ts-expect-error
import { GroupHeadingProps } from 'react-select/src/components/Group';
import { ActionMeta } from 'react-select/lib/types';
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
  id?: number | string;
  inScrollBar?: boolean;
  isMenuListPaddingDisabled?: boolean;
  isDisabled?: boolean;
  isMenuListVirtualized?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  withoutPortal?: Boolean;
  defaultNumberShown?: number;
  classes?: Record<string, CSSProperties>;
  error?: boolean;
  withoutSelectAll?: boolean;
  removeIndicator?: boolean;
  chipsRenderer?: (props: ChipsRendererProps<T>) => React.ReactNode;
  itemRenderer?: (props: ItemRendererProps<T>) => React.ReactNode;
  headerListRenderer?: () => React.ReactChild;
  onEndMenuListReach?: () => void;
  onInputChange?: (value: string, meta: { action: InputActionTypes }) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  blurOnSelect?: boolean;
  placeholder?: string;
  withoutConfirmButton?: boolean;
  filterOption?: (option: T, inputValue: string) => boolean;
  openMenuOnFocus?: boolean;
  openMenuOnClear?: boolean;
  onMenuOpen?: () => void;
  onMeuClose?: () => void;
  options: T[] | Immutable.ImmutableArray<T>;
  closeMenuOnSelect?: boolean;
  withoutNullValues?: boolean;
  /** Placeholder to display when all the options available are selected */
  allOptionsPlaceholder?: string;
} & Omit<NamedProps, 'options' | 'isMulti' | 'onChange' | 'value'>;

export type ItemRendererProps<T extends OptionTypeBase> = {
  data: T;
  isSelected: boolean;
  children: React.ReactNode;
  isDisabled: boolean;
};

export type ChipsRendererProps<T extends OptionTypeBase> = {
  data: T;
  onDelete: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type OwnProps<T extends OptionTypeBase> =
  | ({
      onChange?: (values: T[] | OptionTypeBase[]) => void;
      isMulti: true;
      value?: T[] | OptionTypeBase[];
    } & BaseProps<T>)
  | ({
      isMulti?: false;
      value?: T | OptionTypeBase | null;
      onChange?: (value: T | OptionTypeBase) => void;
    } & BaseProps<T>);

export type MuiSelectProps<T extends OptionTypeBase> = OwnProps<T>;

function MaterialUISelector<T extends OptionTypeBase>(
  props: MuiSelectProps<T>,
) {
  const {
    id,
    isMulti,
    options,
    value,
    leftIcon,
    menuPortalTarget,
    withoutPortal = false,
    isDisabled,
    inScrollBar,
    isMenuListPaddingDisabled,
    isMenuListVirtualized,
    isSearchable,
    defaultNumberShown,
    withoutSelectAll,
    removeIndicator,
    chipsRenderer,
    itemRenderer,
    headerListRenderer,
    onChange,
    onEndMenuListReach,
    onInputChange,
    defaultValue,
    onBlur,
    name,
    blurOnSelect,
    placeholder,
    withoutConfirmButton,
    openMenuOnFocus,
    openMenuOnClear,
    closeMenuOnSelect = true,
    withoutNullValues,
    allOptionsPlaceholder,
    ...restProps
  } = props;
  const classes = useStyles();
  const selectRef = useRef(null);
  const [containerRef, setContainerRef] = useState(null);
  const [displayMore, setDisplayMore] = useState(false);
  const handleChange = (data: T | T[], { action }: ActionMeta) => {
    if (!onChange) return;

    if (!withoutConfirmButton) {
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

    if (blurOnSelect && (action === 'clear' || action === 'remove-value')) {
      setTimeout(() => selectRef.current.select.blur(), 1);
    }
  };

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        e.target.name = name;
        onBlur(e);
      }
    },
    [onBlur, name],
  );

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
          zIndex: 9999,
          position: 'absolute',
          top: '100%',
          left: '0px',
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

  const emptyIndicatorsContainer = React.useCallback(() => null, []);

  const displayAllOptionsPlaceholder = useMemo(
    () =>
      !!isMulti &&
      !!allOptionsPlaceholder &&
      options?.length !== 0 &&
      options?.length === value?.length,
    [isMulti, allOptionsPlaceholder, options, value],
  );

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
        className={classNames(classes.relative, {
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
          defaultValue={defaultValue}
          hideSelectedOptions={false}
          id={id}
          inScrollBar={inScrollBar}
          isDisabled={isDisabled}
          isMenuListPaddingDisabled={isMenuListPaddingDisabled}
          isMenuListVirtualized={isMenuListVirtualized}
          isMulti={isMulti}
          isSearchable={isSearchable}
          menuPortalTarget={_menuPortalTarget}
          onChange={handleChange}
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
          closeMenuOnSelect={closeMenuOnSelect}
          defaultNumberShown={defaultNumberShown}
          displayAllOptionsPlaceholder={displayAllOptionsPlaceholder}
          onBlur={handleBlur}
          onInputChange={onInputChange}
          selectRef={selectRef}
          withoutConfirmButton={withoutConfirmButton}
        />
      </div>
    </SelectorContext.Provider>
  );
}

export const SelectorContext = React.createContext<{
  displayMore: boolean;
  setDisplayMore: (value: boolean) => void;
}>({
  displayMore: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDisplayMore: (_) => {},
});

/* ***** */
/* Overiding some behavior to fit with expected experiences */
/* ***** */
const SelectContext = React.createContext({
  selected: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelect: (data: any) => {},
});

function Menu<T extends OptionTypeBase>(props: MenuProps<T, boolean, any>) {
  const classes = useStyles();
  const [selected, setSelected] = useState<T[]>([...props.getValue()]);
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
      if (props.selectProps.withoutConfirmButton) {
        props.setValue(selectedValuesWithoutIndex);
        props.selectProps.openMenuOnFocus &&
          setTimeout(() => props.selectProps.selectRef.current.focus());
      }
      return;
    }
    const selectedValues = [...selected, data];
    setSelected(selectedValues);
    if (props.selectProps.withoutConfirmButton) {
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
        if (o.value !== null || o.value !== undefined) {
          return o;
        }

        return o.options;
      });
      setSelected(globalSelectedValues);
      if (props.selectProps.withoutConfirmButton) {
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

  return (
    <components.Menu {...props} getStyles={resetStyle}>
      <SelectContext.Provider
        value={{
          selected,
          onSelect,
        }}
      >
        <Paper square className={classes.menu}>
          <div
            className={classes.list}
            style={{
              maxHeight: props.maxMenuHeight,
            }}
          >
            {props.children}
          </div>

          {props.isMulti && (
            <div className={classes.footer}>
              {!props?.selectProps?.withoutSelectAll ? (
                <Button
                  className={classNames(classes.button, classes.selectButton)}
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
                  onClick={handleSubmit}
                  onTouchEnd={handleSubmit} // for compability with phones
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
    data: T;
    children: React.ReactNode;
    isSelected: boolean;
    isDisabled: boolean;
  }) => React.ReactNode,
) {
  return (props: OptionProps<OptionTypeBase, boolean, any>) => {
    return (
      <SelectContext.Consumer>
        {({ selected, onSelect }) => {
          const isSelected = selected.some(
            (option) => option?.value === props.data?.value,
          );

          const handleClick = (
            ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
          ) => {
            if (props.isMulti) {
              onSelect(props.data);
              return;
            }
            props.innerProps.onClick(ev);
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
                  isDisabled: props.isDisabled,
                })}
              {!itemRenderer && (
                <MenuItem
                  dense
                  disabled={props.isDisabled}
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
    index,
    maxDisplay,
    data,
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
        className={classNames(
          classes.control,
          props?.selectProps?.classes?.control,
        )}
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const MultiValueContainer = (props: { children: React.ReactNode[] }) => {
  // @ts-expect-error
  const { displayAllOptionsPlaceholder } = props?.selectProps;
  const classes = useStyles();

  const { index, maxDisplay, data } = getItemPositionData(
    // @ts-expect-error
    props.selectProps,
    // @ts-expect-error
    props.data,
  );

  return (
    <SelectorContext.Consumer>
      {({ displayMore }) => {
        const isHiddenItemChip =
          (index > maxDisplay && !displayMore && !!data) ||
          displayAllOptionsPlaceholder;

        const className = isHiddenItemChip
          ? classes.displayNone
          : classes.reset;

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
  return (
    <components.Placeholder {...props} getStyles={resetStyle}>
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
    if (props.selectProps?.displayAllOptionsPlaceholder) {
      content = (
        <>
          <Typography
            className={props?.selectProps?.classes?.placeholder}
            color="textSecondary"
          >
            {props.selectProps?.allOptionsPlaceholder}
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
  displayNone: {
    display: 'none',
  },
  container: {},
  menu: {
    marginTop: theme.spacing(1),
    borderRadius: 5,
    boxShadow: theme.shadows[2],
    zIndex: 1500,
    minWidth: 250,
    overflowX: 'auto',
  },
  reset: {
    all: 'unset',
  },
  chip: {
    marginRight: 4,
  },
  list: {
    overflowY: 'auto',
  },
  button: {
    padding: theme.spacing(1),
  },
  selectButton: {
    textTransform: 'none',
  },
  footer: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: `1px solid ${theme.palette.grey[200]}`,
  },
  emptyState: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  groupHeader: {
    paddingLeft: theme.spacing(1),
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },
  icon: {
    marginRight: 8,
  },
  control: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  buttonShowMore: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 'fit-content',
    alignSelf: 'flex-end',
    textTransform: 'none',
    borderRadius: '16px',
    boxSizing: 'border-box',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: '#eee',
    },
  },
  rightIcon: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    color: theme.palette.error.main,
    transform: 'rotate(180deg)',
    marginRight: theme.spacing(1),
  },
  relative: {
    position: 'relative',
  },
  error: {
    borderRadius: theme.spacing(1) / 2,
    boxShadow: `0 0 0 1px ${theme.palette.error.main}`,
  },
}));

export default MaterialUISelector;
