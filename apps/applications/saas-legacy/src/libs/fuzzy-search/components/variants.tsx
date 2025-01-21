import React, {
  MouseEventHandler,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { components } from 'react-select';
//@ts-expect-error js
import type { GroupHeadingProps } from 'react-select/src/components/Group';

import type { ControlProps } from 'react-select/lib/components/Control';
import type {
  ObjectSelectOption,
  SelectOptions,
} from '#src/libs/fuzzy-search/types';
import {
  Paper,
  type InputBaseComponentProps,
  makeStyles,
  Theme,
  Button,
  Checkbox,
  MenuItem,
  Typography,
  Chip,
} from '@material-ui/core';
import type { Props as SelectProps } from 'react-select/lib/Select';

import type { OptionProps } from 'react-select/lib/components/Option';
import type { MenuProps, NoticeProps } from 'react-select/lib/components/Menu';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import type { SelectOption } from '#src/libs/types';
import type { ValueType } from 'react-select/lib/types';
import { flattenOptions } from '#src/libs/fuzzy-search/utils/formatOptions';

const UnderlinedSearchBarInputComponent: React.FC<{
  inputRef: React.LegacyRef<HTMLDivElement>;
  props: InputBaseComponentProps;
}> = ({ inputRef, ...props }) => (
  <div
    ref={inputRef}
    style={{ display: 'flex', alignItems: 'center' }}
    {...props}
  />
);

const UnderlinedSearchBarControl: React.FC<ControlProps<ObjectSelectOption>> = (
  props,
) => (
  <TextField
    fullWidth
    InputProps={{
      inputComponent: UnderlinedSearchBarInputComponent,
      startAdornment: <SearchIcon color="secondary" />,
      inputProps: {
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps,
      },
    }}
  />
);
export { UnderlinedSearchBarControl };

/**
 * MUI-Selector variant
 */

const DEFAULT_NUMBER_OF_DISPLAYED_CHIPS = 3;

const SelectContext = React.createContext<{
  selected: ValueType<SelectOption<number>>;
  onSelect: (option: SelectOption<number>) => void;
}>({
  selected: [],
  onSelect: () => {},
});

export const SelectorContext = createContext<{
  displayMore: boolean;
  setDisplayMore: (value: boolean) => void;
}>({
  displayMore: false,

  setDisplayMore: (_) => {},
});

const MaterialUISelectorMenu = (props: MenuProps<SelectOption<number>>) => {
  const classes = useMaterialUISelectorStyles();
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<ValueType<SelectOption<number>>>(
    props.selectProps?.value ?? [],
  );
  const flatOptions = useMemo(
    () => flattenOptions(props.options),
    [props.options],
  );
  const toggleSelect = useCallback(
    (item: SelectOption<number>) => {
      if (!Array.isArray(selected)) return;
      const index = selected.findIndex((s) => s.value === item.value);
      if (index !== -1) {
        setSelected([
          ...selected.slice(0, index),
          ...selected.slice(index + 1),
        ]);
      } else {
        setSelected([...selected, item]);
      }
    },
    [selected],
  );

  const handleSubmit = useCallback(() => {
    props.setValue(selected, 'set-value');
  }, [props, selected]);

  const selectAll = useCallback(() => setSelected(flatOptions), [flatOptions]);
  const unselectAll = useCallback(() => setSelected([]), []);

  const handleSelectAll = useCallback(() => {
    if (!Array.isArray(selected)) return;

    if (!selected.length) {
      selectAll();
    } else {
      unselectAll();
    }
  }, [selectAll, selected, unselectAll]);
  return (
    <SelectContext.Provider value={{ selected, onSelect: toggleSelect }}>
      <components.Menu {...props}>
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
              <Button
                className={clsx(classes.button, classes.selectButton)}
                color="secondary"
                onClick={handleSelectAll}
                onTouchEnd={handleSelectAll} // for compatibility with phones
              >
                {Array.isArray(selected) && selected?.length > 0
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
      </components.Menu>
    </SelectContext.Provider>
  );
};

const MaterialUISelectorOption = (
  props: OptionProps<SelectOptions[number]>,
) => {
  const { selected, onSelect } = useContext(SelectContext);

  const isSelected = useMemo(
    () =>
      Array.isArray(selected)
        ? selected.some((option) => option?.value === props.data?.value)
        : false,
    [props.data?.value, selected],
  );

  const handleClick = useCallback(
    (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (props.isMulti) {
        onSelect(props.data);
        return;
      }
      props.innerProps.onClick(ev);
    },
    [onSelect, props.data, props.innerProps, props.isMulti],
  );

  return (
    <components.Option
      {...props}
      getStyles={resetStyle}
      innerProps={{
        ...props.innerProps,
        onClick: handleClick,
      }}
    >
      <MenuItem
        dense
        disabled={props.isDisabled}
        selected={isSelected && !props.isMulti}
      >
        {props.isMulti && <Checkbox checked={isSelected} />}
        {props.children}
      </MenuItem>
    </components.Option>
  );
};

const getItemPositionData = (
  selectProps: SelectProps<SelectOption<number>>,
  data: SelectOption<number>,
) => {
  /**
  This function is used to get the index of the current item in the selected values. Makes sense only for multi-select.
  */
  if (!Array.isArray(selectProps.value)) return;
  const selectedValues = selectProps.value ?? [];
  const index = selectedValues.findIndex((item) => item.value === data.value);
  const overflowValues =
    selectedValues.length - DEFAULT_NUMBER_OF_DISPLAYED_CHIPS;

  return {
    data,
    index,
    overflowValues,
    selectedValues,
  };
};

const MUIMultiValueContainer = (props: {
  children: React.ReactNode[];
  data: SelectOption<number>;
  selectProps?: SelectProps<SelectOption<number>>;
}) => {
  const { displayAllOptionsPlaceholder, displaySearchPlaceholder } =
    props.selectProps ?? {};
  const classes = useMaterialUISelectorStyles();

  const { displayMore } = useContext(SelectorContext);

  const { index, data } = getItemPositionData(props.selectProps, props.data);

  const isHiddenItemChip =
    (index > DEFAULT_NUMBER_OF_DISPLAYED_CHIPS && !displayMore && !!data) ||
    displayAllOptionsPlaceholder ||
    displaySearchPlaceholder;

  const className = isHiddenItemChip ? classes.displayNone : classes.reset;

  return (
    <components.MultiValueContainer
      {...props}
      getStyles={resetStyle}
      innerProps={{ className }}
    >
      {props?.children?.[1]}
    </components.MultiValueContainer>
  );
};

const MUIMultiValueLabel = (): null => {
  return null;
};

const MUISelectorControl = (props: ControlProps<SelectOptions[number]>) => {
  const [displayMore, setDisplayMore] = useState(false);
  const classes = useMaterialUISelectorStyles();

  return (
    <SelectorContext.Provider value={{ displayMore, setDisplayMore }}>
      <components.Control className={classes.control} {...props}>
        {props.children}
      </components.Control>
    </SelectorContext.Provider>
  );
};

const MUIMultiValueRemove = (props: {
  data: SelectOption<number>;
  selectProps?: SelectProps<SelectOption<number>>;
  innerProps: { className: string; onClick: () => void };
}) => {
  const classes = useMaterialUISelectorStyles();
  const { displayMore } = useContext(SelectorContext);
  const catchFocusAndEvent = useCallback<MouseEventHandler<HTMLDivElement>>(
    (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    },
    [],
  );
  const { selectedValues, index, overflowValues } = getItemPositionData(
    props.selectProps,
    props.data,
  );

  const showDisplayLessButton =
    displayMore && overflowValues > 0 && index === selectedValues.length - 1;
  const showDisplayMoreButton =
    index === DEFAULT_NUMBER_OF_DISPLAYED_CHIPS && !displayMore;

  return (
    <div className={classes.row}>
      <components.MultiValueRemove getStyles={resetStyle}>
        <div className={classes.chip} onMouseDown={catchFocusAndEvent}>
          {props.data && (
            <Chip
              label={props.data.label}
              onDelete={props.innerProps.onClick}
            />
          )}
          {showDisplayMoreButton && (
            <ShowMoreButton overflowValues={overflowValues} />
          )}
        </div>
      </components.MultiValueRemove>
      {showDisplayLessButton && (
        <ShowMoreButton overflowValues={overflowValues} />
      )}
    </div>
  );
};

const ShowMoreButton: React.FC<{
  overflowValues: number;
}> = ({ overflowValues }) => {
  const { t } = useTranslation('common');
  const { displayMore, setDisplayMore } = useContext(SelectorContext);

  return (
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
  );
};

function MUINoOptionsMessage(props: NoticeProps<SelectOptions[number]>) {
  const classes = useMaterialUISelectorStyles();

  return (
    <components.NoOptionsMessage {...props} getStyles={resetStyle}>
      <div className={classes.emptyState}>
        <Typography color="textSecondary">{props.children}</Typography>
      </div>
    </components.NoOptionsMessage>
  );
}

const GroupHeading = (props: GroupHeadingProps<SelectOptions[number]>) => {
  const classes = useMaterialUISelectorStyles();

  return (
    <components.GroupHeading {...props} getStyles={resetStyle}>
      <div className={classes.groupHeader}>
        <Typography color="textSecondary">{props.children}</Typography>
      </div>
    </components.GroupHeading>
  );
};

export const MaterialUISelectorComponents = {
  Menu: MaterialUISelectorMenu,
  GroupHeading,
  Option: MaterialUISelectorOption,
  NoOptionsMessage: MUINoOptionsMessage,
  MultiValueContainer: MUIMultiValueContainer,
  MultiValueLabel: MUIMultiValueLabel,
  Control: MUISelectorControl,
  MultiValueRemove: MUIMultiValueRemove,
};

const resetStyle = () => ({});

const useMaterialUISelectorStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: theme.spacing(1),
  },
  chip: {
    marginRight: 4,
  },
  control: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    width: '100%',
  },
  displayNone: { display: 'none' },
  emptyState: {
    padding: theme.spacing(2),
    textAlign: 'center',
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
  reset: {
    all: 'unset',
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  selectButton: {
    textTransform: 'none',
  },
}));
