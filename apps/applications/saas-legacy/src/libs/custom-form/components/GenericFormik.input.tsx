import React, { ReactNode, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import MuiTextField from '@material-ui/core/TextField';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Field, useField } from 'formik';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Switch } from '@material-ui/core';
import MaterialUISelector, {
  // @ts-expect-error
  itemRendererProps,
  // @ts-expect-error
  chipsRendererProps,
  // @ts-expect-error
  Props as MaterialUISelectorProps,
  OptionTypeBase,
} from '#src/components/Selector/MaterialUISelector.component';
import ObjectSearchComponent, {
  OwnProps as ObjectSearchComponentProps,
} from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { SelectOption } from '#src/libs/types';
import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';
import { getLabelFromItem } from '#src/libs/fuzzy-search/utils/labelExtractor';

export type BaseFieldProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  name: string;
};
const useTextFieldStyles = makeStyles(() => ({
  field: {
    width: '100%',
  },
}));

type TextFieldProps = {
  variant: 'filled' | 'standard' | 'outlined';
  label: string;
  required: boolean;
  disabled: boolean;
} & BaseFieldProps;
export const TextField = (props: TextFieldProps) => {
  const { variant, label, required, disabled } = props;
  const [field, meta] = useField(props);
  const classes = useTextFieldStyles();

  return (
    <Field>
      {() => (
        <MuiTextField
          className={classes.field}
          disabled={disabled}
          error={!!meta.error}
          inputProps={{
            'data-testid': 'input-test',
          }}
          label={label}
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          required={required}
          value={field.value}
          variant={variant}
        />
      )}
    </Field>
  );
};

type CheckboxFieldProps = BaseFieldProps & {
  disabled?: boolean;
  label?: string | ReactNode;
  reverted?: boolean;
  classes?: { [key: string]: any };
  onChange?: (newValue: boolean) => void;
};
export const CheckboxField = (props: CheckboxFieldProps) => {
  const { reverted, disabled, label, classes, onChange } = props;
  const [field, meta, helpers] = useField(props.name);
  return (
    <Field {...props}>
      {() => (
        <FormControlLabel
          classes={classes}
          control={
            <Checkbox
              checked={reverted ? !field.value : field.value}
              disabled={!!disabled}
              {...props}
              {...field}
              // @ts-expect-error
              error={!!(meta.touched && meta.error)}
              onChange={() => {
                onChange && onChange(!field.value);
                helpers.setValue(!field.value);
              }}
            />
          }
          id="checkbox"
          label={label}
        />
      )}
    </Field>
  );
};

type SwitchFieldProps = {
  id?: string;
  name: string;
  disabled?: boolean;
  label: string;
  switchColor?: 'default' | 'primary' | 'secondary';
  revertValue?: boolean;
  onChange?: () => void;
};
export const SwitchField = (props: SwitchFieldProps) => {
  const { name, disabled, label, switchColor, revertValue, id, onChange } =
    props;

  const [field, _meta, helpers] = useField<number>(name);

  const handleFieldOnChange = React.useCallback(
    (fieldValue) => () => {
      // @ts-expect-error
      onChange ? onChange() : helpers.setValue(!fieldValue);
    },
    [onChange, helpers],
  );

  return (
    <Field name={name}>
      {() => {
        return (
          <FormControlLabel
            id={id}
            {...field}
            // @ts-expect-error
            checked={revertValue ? !field.value : field.value}
            control={<Switch color={switchColor ?? 'primary'} />}
            disabled={disabled}
            label={label}
            onChange={handleFieldOnChange(field.value)}
            value=""
          />
        );
      }}
    </Field>
  );
};

type MaterialUiSingleSelectorOwnProps = {
  options: Array<{ label: string; value: number }>;
  title?: ReactNode;
  onChange?: (value: { label: string; value: any }) => void;
  forceError?: boolean;
  withoutNullValues?: boolean;
} & Partial<
  Pick<
    MaterialUISelectorProps<{
      label: string;
      value: string;
    }>,
    | 'chipsRenderer'
    | 'isMenuListVirtualized'
    | 'itemRenderer'
    | 'inScrollBar'
    | 'placeholder'
    | 'isDisabled'
  >
>;

type MaterialUiSingleSelectorProps = BaseFieldProps &
  MaterialUiSingleSelectorOwnProps & {
    className?: string;
  };

const useMaterialUiSingleSelectStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
  },
}));

export const MaterialUiSingleSelectorField: React.FC<
  MaterialUiSingleSelectorProps
> = (props) => {
  const [field, meta, helpers] = useField<number>(props.name);
  const value = props.options.find((option) => option.value === field.value);
  const classes = useMaterialUiSingleSelectStyles();

  const handleChange = React.useCallback(
    (option) => {
      option &&
        (props.onChange
          ? props.onChange(option)
          : helpers.setValue(option.value));
      helpers.setTouched(true, false);
    },
    [helpers, props],
  );

  return (
    <div className={clsx(classes.container, props.className)}>
      {!!props.title && props.title}
      <Field {...props}>
        {() => (
          <MaterialUISelector
            chipsRenderer={props.chipsRenderer}
            error={!!(meta.touched && meta.error) || props.forceError}
            inScrollBar={props.inScrollBar}
            isDisabled={props.isDisabled}
            isMenuListVirtualized={props.isMenuListVirtualized}
            isMulti={false}
            itemRenderer={props.itemRenderer}
            onChange={handleChange}
            options={props.options}
            placeholder={props.placeholder}
            value={value}
            withoutNullValues={props.withoutNullValues}
          />
        )}
      </Field>
    </div>
  );
};

type MaterialUiMultiSelectorProps = {
  options: Array<{ label: string; value: number }>;
  title?: ReactNode;
  placeholder?: string;
  inScrollBar?: boolean;
  isDisabled?: boolean;
  isMenuListVirtualized?: boolean;
  className?: string;
  defaultNumberShown?: number;
  forceError?: boolean;
  withoutConfirmButton?: boolean;
  itemRenderer?: (props: itemRendererProps) => React.ReactNode;
  chipsRenderer?: (props: chipsRendererProps) => React.ReactNode;
  openMenuOnFocus?: boolean;
  openMenuOnClear?: boolean;
  closeMenuOnSelect?: boolean;
  /**
   * @description onInputChange props from React Select
   *
   * Function that is triggered when user types in the input
   * @param text
   * @returns
   */
  onInputChange?: (text: string) => void;
  /**
   * @description Boolean which decides if "Select all" button needs to be hidden
   */
  withoutSelectAll?: boolean;
  /**
   * @description filterOption props of React select.
   *
   * If overriden, it will filter options based on your function instead of the one built-in
   */
  filterOption?: (option: any) => boolean;
  /**
   * @description isLoading props of React select.
   */
  isLoading?: boolean;
  /**
   * @description isOptionDisabled props of React select.
   *
   * If given, 'isDisabled' props of option will be true based on your function return value
   * for each option
   */
  isOptionDisabled?: (option: { label: string; value: number }) => boolean;
  /**
   * @description Boolean which decides if we want to force an empty selector
   *
   * If true and you still want to display selected values, it needs to be handled by another component !
   */
  forceEmptySelector?: boolean;
  /**
   * @description optionFormatter props of React select.
   *
   * Option default format is {value:string, label:string}, but you can format it the way you want it to
   */
  optionFormatter?: () => any;
  /**
   * @description Custom component props.
   *
   * If given, corresponds to onChange props of MaterialUISelector
   * Else it will set the given formik field a list of value from options
   */
  onChange?: (option: any) => void;

  /**
   * @description MaterialUISelector props
   *
   * If given without forceBlurOnSelect, will focus out of the component depending on React Select action
   */
  blurOnSelect?: boolean;
  /**
   * @description MaterialUISelector props
   *
   * Coupled with blurOnSelect, it will focus out the component when selecting
   */
  forceBlurOnSelect?: boolean;
  maxSelectedItems?: number;
  alreadySelectedCount?: number;
};

type Props = BaseFieldProps & MaterialUiMultiSelectorProps;

const useMaterialUiMultiSelectStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export const MaterialUiMultiSelectorField: React.FC<Props> = (props) => {
  const [field, meta, helpers] = useField<Array<number>>(props.name);
  const value = field.value.map((val) =>
    props.options.find((option) => option.value === val),
  );
  const classes = useMaterialUiMultiSelectStyles();

  const { onChange } = props;

  const handleOnChange = React.useCallback(
    (optionList: any[] | OptionTypeBase[]) => {
      if (onChange) {
        onChange?.(optionList);
      } else {
        const valueList = (optionList ?? []).map((option) => option.value);
        helpers.setValue(valueList);
        helpers.setTouched(true, false);
      }
    },
    [helpers, onChange],
  );

  return (
    <div className={clsx(classes.container, props.className)}>
      {!!props.title && props.title}
      <Field {...props}>
        {() => (
          <MaterialUISelector
            isMulti
            alreadySelectedCount={props.alreadySelectedCount}
            blurOnSelect={props.blurOnSelect}
            chipsRenderer={props.chipsRenderer}
            closeMenuOnSelect={props.closeMenuOnSelect}
            defaultNumberShown={props.defaultNumberShown}
            error={!!(meta.touched && meta.error) || props.forceError}
            filterOption={props.filterOption}
            forceBlurOnSelect={props.forceBlurOnSelect}
            inScrollBar={props.inScrollBar}
            isDisabled={props.isDisabled}
            isLoading={props.isLoading}
            isMenuListVirtualized={props.isMenuListVirtualized}
            isOptionDisabled={props.isOptionDisabled}
            itemRenderer={props.itemRenderer}
            maxSelectedItems={props.maxSelectedItems}
            onChange={handleOnChange}
            onInputChange={props.onInputChange}
            openMenuOnClear={props.openMenuOnClear}
            openMenuOnFocus={props.openMenuOnFocus}
            optionFormatter={props.optionFormatter}
            options={props.options}
            placeholder={props.placeholder}
            value={props.forceEmptySelector ? [] : value}
            withoutConfirmButton={props.withoutConfirmButton}
            withoutSelectAll={props.withoutSelectAll}
          />
        )}
      </Field>
    </div>
  );
};

type ObjectSearchFieldProps = BaseFieldProps & ObjectSearchComponentProps;

export const ObjectSearchField: React.FC<ObjectSearchFieldProps> = ({
  name,
  ...selectProps
}) => {
  const { getResultsById } = useObjectSearch();
  const [field, , helpers] = useField<number[]>(name);

  const getMultiOptionsValue = useCallback(
    (options: SelectOption<number>[]) => {
      return options.map((option) => option.value);
    },
    [],
  );

  const rawValues = useMemo(
    () =>
      field.value
        // @ts-expect-error union type restriction on resultsById (necessary for smooth use in component)
        .map((id) => getResultsById([selectProps.searchedObjectType])[id])
        .filter((option) => !!option),
    [field.value, getResultsById, selectProps.searchedObjectType],
  );

  const selectValues = useMemo(() => {
    if (selectProps.optionsFormatter) {
      let selectValuesAcc: SelectOption<number>[] = [];
      // @ts-expect-error expected union type error
      const potentiallyGroupedOptions = selectProps.optionsFormatter(rawValues);
      for (const optionOrGroup of potentiallyGroupedOptions) {
        if ('options' in optionOrGroup) {
          selectValuesAcc = selectValuesAcc.concat(optionOrGroup.options);
        } else {
          selectValuesAcc.push(optionOrGroup);
        }
      }
      return selectValuesAcc;
    }
    return rawValues.map((option) => ({
      label: getLabelFromItem({
        item: option,
        searchedObjectType: selectProps.searchedObjectType,
      }),
      value: option.id,
    }));
  }, [rawValues, selectProps]);

  const handleChange = useCallback(
    (options: SelectOption<number>[]) => {
      helpers.setValue(getMultiOptionsValue(options));
      helpers.setTouched(true, false);
    },
    [getMultiOptionsValue, helpers],
  );

  return (
    <Field name={name}>
      {() => (
        <ObjectSearchComponent
          isMulti
          hideSelectedOptions={false}
          onChange={handleChange}
          value={selectValues}
          {...selectProps}
        />
      )}
    </Field>
  );
};
