// @ts-nocheck
import React, { FocusEventHandler } from 'react';
import chroma from 'chroma-js';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';
import { colors } from '@bsport/common/lib/colors';
import Select, { components } from 'react-select';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import classNames from 'classnames';
import type { SelectComponents } from 'react-select/lib/components';
import type { Establishment, EstablishmentSelectOption } from '../types';

const GroupHeading = ({ children, ...props }) => {
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

const Menu = ({ children, ...props }) => {
  if (props.selectProps.isLoading) {
    return <div />;
  }
  return <components.Menu {...props}>{children}</components.Menu>;
};

const Group = ({ children, ...props }) => {
  const groupOptionsValueList = props.options.map((opt) => opt.data.value);
  const [checked] = React.useState(
    groupOptionsValueList.every(
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
        control: (styles) => ({
          ...styles,
          backgroundColor: 'white',
          borderColor: colorError,
        }),
      }
    : {
        control: (styles) => ({
          ...styles,
          backgroundColor: 'white',
        }),
      };
};

const establishmentStyles = {
  menuPortal: (base) => {
    return {
      ...base,
      zIndex: 9999,
      display: 'flex',
      flexWrap: 'wrap',
    };
  },
  option: (
    styles,
    {
      isDisabled,
      isFocused,
      isSelected,
    }: { isDisabled: boolean; isFocused: boolean; isSelected: boolean },
  ) => {
    const color = chroma(colors.secondary);
    /* eslint-disable */
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
      groupHeading: (base) => ({ ...base, margin: 0 }),
    };

    /* eslint-enable */
  },
  multiValue: (styles) => {
    const color = chroma(colors.secondary);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
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
  id?: string;
  establishments?:
    | Array<Establishment>
    | Immutable.ImmutableArray<Establishment>;
  selectOption: (
    suggestion:
      | EstablishmentSelectOption[]
      | EstablishmentSelectOption
      | number,
  ) => void;
  selectMultipleOptions?: (itemsValueList: Array<number>) => void;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
  selectedEstablishments: Array<number> | null;
  disabled?: boolean;
  noMulti?: boolean;
  closeMenuOnSelect?: boolean;
  isClearable?: boolean;
  nullCurrentValue?: boolean;
  isLoading?: boolean;
  isOptionDisabled?: boolean;
  targetParentElement?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  requiredValueIsMissing?: boolean;
  name?: string;
  selectorClass?: string;
  hideError?: boolean;
  selectComponents?: Partial<SelectComponents<any>>;
};

type Props = OwnProps & WithTranslation;
export function EstablishmentSelector(props: Props) {
  const {
    t,
    establishments,
    selectOption,
    selectMultipleOptions,
    selectedEstablishments,
    closeMenuOnSelect,
    nullCurrentValue,
    disabled,
    noMulti,
    isClearable,
    isLoading,
    isOptionDisabled,
    targetParentElement,
    placeholder,
    isRequired,
    requiredValueIsMissing,
    name,
    selectorClass,
    hideError,
    id,
    selectComponents,
    onBlur,
  } = props;
  const roomsSelected =
    selectedEstablishments && !nullCurrentValue
      ? getEstablishmentList(establishments).filter((est) =>
          selectedEstablishments.includes(est.value),
        )
      : null;
  const theme = useTheme();
  return (
    <>
      <Select
        className={classNames(selectorClass)}
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
                (selectedEstablishments || []).includes(option.value)
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
            isRequired && requiredValueIsMissing,
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

const EstablishmentSelectorComposed = compose<Props, OwnProps>(
  withTranslation(['establishment']),
)(EstablishmentSelector);

export default EstablishmentSelectorComposed;

export const EstablishmentSelectorControlled = (props: OwnProps) => {
  const [value, setValue] = React.useState(props.selectedEstablishments);
  return (
    <EstablishmentSelectorComposed
      {...props}
      selectedEstablishments={value}
      selectOption={(sList) => {
        if (!sList) setValue([]);
        else if (props.noMulti) setValue([sList.value]);
        else setValue(sList.map((s) => s.value));
      }}
    />
  );
};
