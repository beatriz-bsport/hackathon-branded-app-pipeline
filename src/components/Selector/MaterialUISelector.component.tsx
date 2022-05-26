import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Select, {
  NamedProps,
  components,
  MenuProps,
  MenuListComponentProps,
  OptionProps,
  PlaceholderProps,
  ValueContainerProps,
  ControlProps,
  SingleValueProps,
} from 'react-select';
import { NoticeProps } from 'react-select/src/components/Menu';
import { GroupHeadingProps } from 'react-select/src/components/Group';
import { CSSProperties } from '@emotion/serialize';

export type OptionTypeBase =
  | {
      label: string;
      value: string | number;
    }
  | {
      label: string;
      options: OptionTypeBase[];
    };

type BaseProps<T extends OptionTypeBase> = {
  id?: number | string;
  options: T[];
  inScrollBar?: boolean;
  isMenuListPaddingDisabled?: boolean;
  isMenuListVirtualized?: boolean;
  chipsRenderer?: (props: {
    data: T;
    onDelete: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }) => React.ReactNode;
  itemRenderer?: (props: {
    data: T;
    isSelected: boolean;
    children: React.ReactNode;
    isDisabled: boolean;
  }) => React.ReactNode;
  headerListRenderer?: () => React.ReactChild;
  leftIcon?: React.ReactNode;
  withoutPortal?: Boolean;
  defaultNumberShown?: number;
  classes?: Record<string, CSSProperties>;
} & Omit<NamedProps, 'options' | 'isMulti' | 'onChange' | 'value'>;

export type OwnProps<T extends OptionTypeBase> =
  | ({
      onChange: (values: T[]) => void;
      isMulti: true;
      value?: T[];
    } & BaseProps<T>)
  | ({
      isMulti?: false;
      value?: T | null;
      onChange: (value: T) => void;
    } & BaseProps<T>);

type Props<T extends OptionTypeBase> = OwnProps<T>;

function MaterialUISelector<T extends OptionTypeBase>(props: Props<T>) {
  const {
    id,
    isMulti,
    options,
    value,
    leftIcon,
    menuPortalTarget,
    withoutPortal = false,
    chipsRenderer,
    itemRenderer,
    headerListRenderer,
    onChange,
    inScrollBar,
    isMenuListPaddingDisabled,
    isMenuListVirtualized,
    defaultNumberShown,
    ...restProps
  } = props;
  const classes = useStyles();
  const uuid = useRef(uuidv4());
  const [displayMore, setDisplayMore] = useState(false);

  const handleChange = (data: T | T[]) => {
    if (!onChange) return;
    if (Array.isArray(data)) {
      if (isMulti) {
        onChange(data);
      }
    } else {
      onChange(data);
    }
  };

  let menuPortalTraget = withoutPortal
    ? undefined
    : menuPortalTarget || document.querySelector('body');
  if (inScrollBar) {
    menuPortalTraget = document.querySelector(`#selector_${uuid.current}`);
  }

  return (
    <SelectorContext.Provider
      value={{
        displayMore,
        setDisplayMore,
      }}
    >
      <div id={`selector_${uuid.current}`} style={{ position: 'relative' }}>
        <Select
          id={id}
          value={value}
          isMulti={isMulti}
          inScrollBar={inScrollBar}
          isMenuListPaddingDisabled={isMenuListPaddingDisabled}
          isMenuListVirtualized={isMenuListVirtualized}
          classes={{ ...classes, ...(props?.classes ?? {}) }}
          onChange={handleChange}
          options={options}
          components={{
            Control,
            Menu,
            MenuList: MenuList(headerListRenderer),
            Option: Option(itemRenderer),
            MultiValueContainer,
            MultiValueLabel,
            MultiValueRemove: MultiValueRemove(chipsRenderer),
            Placeholder,
            NoOptionsMessage,
            SingleValue: SingleValue(chipsRenderer),
            GroupHeading,
            ValueContainer: ValueContainer(leftIcon),
          }}
          hideSelectedOptions={false}
          tabSelectsValue={false}
          captureMenuScroll
          menuPortalTarget={menuPortalTraget}
          styles={{
            menuPortal: (base) => {
              if (inScrollBar) {
                return {
                  ...base,
                  zIndex: 9999,
                  position: 'absolute',
                  top: '100%',
                  left: '0px',
                };
              }
              return {
                ...base,
                zIndex: 9999,
              };
            },
          }}
          {...restProps}
          // Mandatory for multi selection use
          closeMenuOnSelect
          defaultNumberShown={defaultNumberShown}
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
    ...props.options.filter((opt) =>
      props.selectProps.filterOption(opt, props.selectProps.inputValue),
    ),
  ];

  const onSelect = (data: T) => {
    const indexOf = selected.findIndex((row) => row.value === data.value);
    if (indexOf !== -1) {
      setSelected([
        ...selected.slice(0, indexOf),
        ...selected.slice(indexOf + 1),
      ]);
      return;
    }
    setSelected([...selected, data]);
  };

  const handleGlobalSelect = () => {
    if (selected.length > 0) {
      setSelected([]);
    } else {
      setSelected(
        displayedOption.flatMap((o) => {
          if (o.value) {
            return o;
          }

          return o.options;
        }),
      );
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
        <Paper className={classes.menu} square>
          <div
            style={{
              maxHeight: props.maxMenuHeight,
            }}
            className={classes.list}
          >
            {props.children}
          </div>

          {props.isMulti && (
            <div className={classes.footer}>
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
              <Button
                className={classes.button}
                color="primary"
                onClick={handleSubmit}
                onTouchEnd={handleSubmit} // for compability with phones
              >
                {t('selector.validate')}
              </Button>
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
            (option) => option.value === props.data.value,
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
              innerProps={{
                ...props.innerProps,
                onClick: handleClick,
              }}
              getStyles={resetStyle}
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
                  disabled={props.isDisabled}
                  selected={isSelected && !props.isMulti}
                  dense
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
  const classes = useStyles();

  return (
    <SelectorContext.Consumer>
      {({ displayMore, setDisplayMore }) => (
        <div
          aria-hidden
          onMouseDown={(ev: React.MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
          }}
        >
          <Button
            className={classes.buttonShowMore}
            onClick={() => {
              setDisplayMore(!displayMore);
            }}
          >
            <DoubleArrowIcon
              className={classNames({
                [classes.rightIcon]: !displayMore,
                [classes.leftIcon]: displayMore,
              })}
            />
            {displayMore
              ? t('showLess')
              : t('showMore', {
                  count: overflowValues,
                })}
          </Button>
        </div>
      )}
    </SelectorContext.Consumer>
  );
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
    const selectedValues = props.selectProps?.value ?? [];
    const index =
      selectedValues.findIndex((value) => value.value === props.data.value) ??
      -1;

    const maxDisplay = props.selectProps?.defaultNumberShown ?? 4;
    const overflowValues = selectedValues.length - maxDisplay;

    return (
      <SelectorContext.Consumer>
        {({ displayMore }) => (
          <div className={classes.row}>
            <components.MultiValueRemove getStyles={resetStyle}>
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
              <div className={classes.chip} onMouseDown={catchFocusAndEvent}>
                {(index < maxDisplay || displayMore) && (
                  <>
                    {chipsRenderer &&
                      chipsRenderer({
                        data: props.data,
                        onDelete: props.innerProps.onClick,
                      })}
                    {!chipsRenderer && (
                      <Chip
                        label={props.data.label}
                        onDelete={props.innerProps.onClick}
                      />
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
function Control<T extends OptionTypeBase>(
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
) {
  return (props: MenuListComponentProps<T, boolean, any>) => {
    return (
      <components.MenuList {...props} getStyles={resetStyle}>
        {headerListRenderer && headerListRenderer()}
        {props.selectProps.isMenuListVirtualized ? (
          <VirtualizedList
            height={
              props.selectProps.options.length < 300
                ? props.selectProps.options.length * 50
                : 300
            }
            itemCount={props.selectProps.options.length}
            itemSize={48}
          >
            {({ index, style }) => (
              <div style={style}>{props.children[index]}</div>
            )}
          </VirtualizedList>
        ) : (
          <MenuListMaterial
            disablePadding={props.selectProps.isMenuListPaddingDisabled}
            dense
          >
            {props.children}
          </MenuListMaterial>
        )}
      </components.MenuList>
    );
  };
}

const MultiValueContainer = (props: { children: React.ReactNode[] }) => {
  const classes = useStyles();

  return (
    <components.MultiValueContainer
      {...props}
      innerProps={{ className: classes.reset }}
      getStyles={resetStyle}
    >
      {props?.children?.[1]}
    </components.MultiValueContainer>
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
          color="textSecondary"
          className={props?.selectProps?.classes?.placeholder}
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
    return (
      <components.ValueContainer {...props} getStyles={resetStyle}>
        <div className={classes.valueContainer}>
          {leftIcon && <div className={classes.icon}>{leftIcon}</div>}
          {props.hasValue && !props.isMulti ? (
            <div>{props.children} </div>
          ) : (
            props.children
          )}
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
const useStyles = makeStyles((theme: Theme) => ({
  container: {},
  menu: {
    marginTop: theme.spacing(1),
    borderRadius: 5,
    boxShadow: theme.shadows[2],
    zIndex: 1500,
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
}));

export default MaterialUISelector;
