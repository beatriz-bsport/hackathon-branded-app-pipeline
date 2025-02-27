import React, { FocusEventHandler } from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';
import { colors } from '@bsport/common/lib/colors.js';
import Select, { components } from 'react-select';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';
import type { SelectComponents } from 'react-select/lib/components';
import type { Establishment, EstablishmentSelectOption } from '../types';

// @ts-expect-error
export const GroupHeading = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <components.GroupHeading {...props}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.primary.main}`,
          width: '100%',
          paddingBottom: '4px',
        }}
      >
        <LocationOnIcon
          fontSize="small"
          style={{ marginRight: '10px', color: theme.palette.primary.main }}
        />
        {children}
      </div>
    </components.GroupHeading>
  );
};

// @ts-expect-error
const Menu = ({ children, ...props }) => {
  if (props.selectProps.isLoading) {
    return <div />;
  }
  // @ts-expect-error
  return <components.Menu {...props}>{children}</components.Menu>;
};

// @ts-expect-error
const Group = ({ children, ...props }) => {
  // @ts-expect-error
  const groupOptionsValueList = props.options.map((opt) => opt.data.value);
  const [checked] = React.useState(
    groupOptionsValueList.every(
      // @ts-expect-error
      (item) =>
        props.selectProps.selectedEstablishments &&
        props.selectProps.selectedEstablishments.includes(item),
    ),
  );
  const handleChange = () => {
    if (!checked && props.selectProps.selectMultipleOptions) {
      props.selectProps.selectMultipleOptions(groupOptionsValueList);
    }
  };
  return (
    <div>
      {props.selectProps.selectMultipleOptions && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
          }}
        >
          <Checkbox
            checked={checked}
            color="primary"
            onChange={() => handleChange()}
            size="small"
          />
        </div>
      )}
      {/* @ts-expect-error */}
      <components.Group {...props}>{children}</components.Group>
    </div>
  );
};

export const getGroupedEstablishmentOptions = (
  establishments: Establishment[],
) => {
  if (!(establishments && establishments.length)) {
    return [];
  }
  establishments.sort((establishment, establishment_) => {
    if (
      establishment.title.toUpperCase() < establishment_.title.toUpperCase()
    ) {
      return -1;
    }
    return 1;
  });
  const establishmentGroupByAddress = establishments.reduce<
    {
      label: string;
      options: [{ value: number; label: string }];
    }[]
  >((accumulator, establishmentItem) => {
    const temp = accumulator.findIndex(
      (group) =>
        group.label.toUpperCase() ===
        establishmentItem.location.address.toUpperCase(),
    );
    if (temp === -1) {
      accumulator.push({
        label: establishmentItem.location.address,
        options: [
          { value: establishmentItem.id, label: establishmentItem.title },
        ],
      });
    } else {
      accumulator[temp].options.push({
        value: establishmentItem.id,
        label: establishmentItem.title,
      });
    }
    return accumulator;
  }, []);
  return establishmentGroupByAddress;
};

const getEstablishmentList = (establishments: Array<Establishment>) => {
  return establishments
    ? establishments.map((est) => {
        return {
          label: est.title,
          value: est.id,
        };
      })
    : [];
};

const controlStyle = (controlError: boolean, colorError: string) => {
  return controlError
    ? {
        // @ts-expect-error
        control: (styles) => ({
          ...styles,
          backgroundColor: 'white',
          borderColor: colorError,
        }),
      }
    : {
        // @ts-expect-error
        control: (styles) => ({
          ...styles,
          backgroundColor: 'white',
        }),
      };
};

const establishmentStyles = {
  // @ts-expect-error
  menuPortal: (base) => {
    return {
      ...base,
      zIndex: 9999,
      display: 'flex',
      flexWrap: 'wrap',
    };
  },
  option: (
    // @ts-expect-error
    styles,
    {
      isDisabled,
      isFocused,
      isSelected,
    }: { isDisabled: boolean; isFocused: boolean; isSelected: boolean },
  ) => {
    const color = chroma(colors.secondary);

    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? colors.secondary
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : colors.secondary,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : color.alpha(0.3).css()),
      },
      // @ts-expect-error
      groupHeading: (base) => ({ ...base, margin: 0 }),
    };
  },
  // @ts-expect-error
  multiValue: (styles) => {
    const color = chroma(colors.secondary);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  // @ts-expect-error
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
  // @ts-expect-error
  multiValueRemove: (styles) => ({
    ...styles,
    color: colors.secondary,
    ':hover': {
      backgroundColor: colors.secondary,
      color: 'white',
    },
  }),
};

export type OwnProps = {
  closeMenuOnSelect?: boolean;
  disabled?: boolean;
  error?: boolean;
  establishments?:
    | Array<Establishment>
    | Immutable.ImmutableArray<Establishment>;
  hideError?: boolean;
  id?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  isOptionDisabled?: boolean;
  isRequired?: boolean;
  name?: string;
  noMulti?: boolean;
  nullCurrentValue?: boolean;
  placeholder?: string;
  requiredValueIsMissing?: boolean;
  selectComponents?: Partial<SelectComponents<any>>;
  selectedEstablishments: Array<number> | null;
  selectorClass?: string;
  targetParentElement?: boolean;
  selectOption: (
    suggestion:
      | EstablishmentSelectOption[]
      | EstablishmentSelectOption
      | number,
  ) => void;
  selectMultipleOptions?: (itemsValueList: Array<number>) => void;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
};

type Props = OwnProps;
export function EstablishmentSelector(props: Props) {
  const {
    closeMenuOnSelect,
    disabled,
    error,
    establishments,
    hideError,
    id,
    isClearable,
    isLoading,
    isOptionDisabled,
    isRequired,
    name,
    noMulti,
    nullCurrentValue,
    onBlur,
    placeholder,
    requiredValueIsMissing,
    selectComponents,
    selectedEstablishments,
    selectMultipleOptions,
    selectOption,
    selectorClass,
    targetParentElement,
  } = props;
  const { t } = useTranslation('establishment');
  const roomsSelected =
    selectedEstablishments && !nullCurrentValue
      ? // @ts-expect-error
        getEstablishmentList(establishments).filter((est) =>
          selectedEstablishments.includes(est.value),
        )
      : null;
  const theme = useTheme();
  return (
    <>
      <Select
        className={clsx(selectorClass)}
        closeMenuOnSelect={!!closeMenuOnSelect}
        components={{ GroupHeading, Group, Menu, ...selectComponents }}
        id={id}
        isClearable={!!isClearable}
        isDisabled={disabled}
        isLoading={isLoading}
        isMulti={!noMulti}
        isOptionDisabled={
          isOptionDisabled
            ? (option: { value: number; label: string }) =>
                (selectedEstablishments ?? []).includes(option.value)
            : null
        }
        menuPortalTarget={
          !targetParentElement && document.querySelector('body')
        }
        name={name}
        onBlur={onBlur}
        onChange={selectOption}
        options={getGroupedEstablishmentOptions(
          establishments ? [...establishments] : null,
        )}
        placeholder={placeholder || t(isRequired ? 'roomRequired' : 'room')}
        selectedEstablishments={selectedEstablishments}
        selectMultipleOptions={selectMultipleOptions}
        styles={{
          ...establishmentStyles,
          ...controlStyle(
            (isRequired && requiredValueIsMissing) || error,
            theme.palette.error.main,
          ),
        }}
        value={roomsSelected}
      />

      {isRequired && requiredValueIsMissing && !hideError && (
        <Typography color="error" variant="caption">
          {t('offer:form.errors.required')}
        </Typography>
      )}
    </>
  );
}

export default EstablishmentSelector;

export const EstablishmentSelectorControlled = (props: OwnProps) => {
  const [value, setValue] = React.useState(props.selectedEstablishments);
  return (
    <EstablishmentSelector
      {...props}
      selectedEstablishments={value}
      selectOption={(sList) => {
        if (!sList) setValue([]);
        // @ts-expect-error
        else if (props.noMulti) setValue([sList.value]);
        // @ts-expect-error
        else setValue(sList.map((s) => s.value));
      }}
    />
  );
};
