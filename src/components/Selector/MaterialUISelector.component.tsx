import React, { useRef, useState } from 'react';
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
  NamedProps,
  components,
  MenuProps,
  MenuListComponentProps,
  OptionProps,
  PlaceholderProps,
  ValueContainerProps,
  ControlProps,
} from 'react-select';
import { NoticeProps } from 'react-select/src/components/Menu';
import { useTranslation } from 'react-i18next';
import { GroupHeadingProps } from 'react-select/src/components/Group';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

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
  leftIcon?: React.ReactNode;
  withoutPortal?: Boolean;
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
    onChange,
    inScrollBar,
    isMenuListPaddingDisabled,
    ...restProps
  } = props;
  const classes = useStyles();
  const uuid = useRef(uuidv4());

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
    <div id={`selector_${uuid.current}`} style={{ position: 'relative' }}>
      <Select
        id={id}
        value={value}
        isMulti={isMulti}
        inScrollBar={inScrollBar}
        isMenuListPaddingDisabled={isMenuListPaddingDisabled}
        classes={classes}
        onChange={handleChange}
        options={options}
        components={{
          Control,
          Menu,
          MenuList,
          Option: Option(itemRenderer),
          MultiValueContainer,
          MultiValueLabel,
          MultiValueRemove: MultiValueRemove(chipsRenderer),
          Placeholder,
          NoOptionsMessage,
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
      />
    </div>
  );
}

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
        ...selected.splice(0, indexOf),
        ...selected.splice(indexOf + 1),
      ]);
      return;
    }
    setSelected([...selected, data]);
  };

  const handleGlobalSelect = () => {
    if (selected.length > 0) {
      setSelected([]);
    } else {
      setSelected(displayedOption);
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
              >
                {selected?.length > 0
                  ? t('selector.unselectAll')
                  : t('selector.selectAll')}
              </Button>
              <Button
                className={classes.button}
                color="primary"
                onClick={handleSubmit}
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
    return (
      <components.MultiValueRemove getStyles={resetStyle}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div className={classes.chip} onMouseDown={catchFocusAndEvent}>
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
        </div>
      </components.MultiValueRemove>
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
      <div className={classes.control}>{props.children}</div>
    </components.Control>
  );
}

function MenuList<T extends OptionTypeBase>(
  props: MenuListComponentProps<T, boolean, any>,
) {
  return (
    <components.MenuList {...props} getStyles={resetStyle}>
      <MenuListMaterial
        disablePadding={props.selectProps.isMenuListPaddingDisabled}
        dense
      >
        {props.children}
      </MenuListMaterial>
    </components.MenuList>
  );
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
        <Typography color="textSecondary">{props.children}</Typography>
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
}));

export default MaterialUISelector;
