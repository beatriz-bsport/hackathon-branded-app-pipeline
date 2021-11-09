// @flow
import React from 'react';
import chroma from 'chroma-js';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { colors } from '@bsport/common/lib/colors';
import Select, { components } from 'react-select';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { useTheme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import type { Establishment } from '../types';

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
            onChange={() => handleChange()}
            color="primary"
            size="small"
          />
        </div>
      )}

      <components.Group {...props}>{children}</components.Group>
    </div>
  );
};
const getGroupedEstablishmentOptions = (
  establishments: Array<Establishment>,
) => {
  establishments.sort((e, e_) => {
    if (e.title.toUpperCase() < e_.title.toUpperCase()) {
      return -1;
    }
    return 1;
  });
  const establishmentGroupByAddress = establishments.reduce(
    (accumulator, establishmentItem) => {
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
    },
    [],
  );
  return establishmentGroupByAddress;
};

const getEstablishmentList = (establishments: Array<Establishment>) => {
  return establishments.map((est) => {
    return {
      label: est.title,
      value: est.id,
    };
  });
};

const establishmentStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
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
      groupHeading: (base) => ({...base,margin: 0}),
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

type OwnProps = {
  establishments?: Array<Establishment>;
  selectOption: (Suggestion: {
    label: string;
    value: number | string;
    establishmentList?: Array<Establishment>;
  }) => void;
  selectMultipleOptions?: (itemsValueList: Array<number>) => void;
  selectedEstablishments: Array<number> | null;
  disabled?: boolean;
  noMulti: boolean;
  closeMenuOnSelect: boolean;
  isClearable: boolean;
  nullCurrentValue: boolean;
  isLoading?: boolean;
  isOptionDisabled?: boolean;
  targetParentElement?: boolean;
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
  } = props;
  const roomsSelected =
    selectedEstablishments && !nullCurrentValue
      ? getEstablishmentList(establishments).filter((est) =>
          selectedEstablishments.includes(est.value),
        )
      : null;
  return (
    <Select
      closeMenuOnSelect={!!closeMenuOnSelect}
      isMulti={!noMulti}
      placeholder={t('room')}
      options={getGroupedEstablishmentOptions([...establishments])}
      styles={establishmentStyles}
      onChange={selectOption}
      isDisabled={disabled}
      isClearable={isClearable}
      menuPortalTarget={!targetParentElement && document.querySelector('body')}
      value={roomsSelected}
      components={{ GroupHeading, Group, Menu }}
      selectedEstablishments={selectedEstablishments}
      isOptionDisabled={
        isOptionDisabled
          ? (option: { value: number; label: string }) =>
              (selectedEstablishments || []).includes(option.value)
          : null
      }
      selectMultipleOptions={selectMultipleOptions}
      isLoading={isLoading}
    />
  );
}

const EstablishmentSelectorComposed = compose<any, OwnProps>(
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
