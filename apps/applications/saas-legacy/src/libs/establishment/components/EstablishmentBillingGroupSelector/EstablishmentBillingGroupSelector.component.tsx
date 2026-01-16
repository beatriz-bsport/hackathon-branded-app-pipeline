import React, { useCallback, useMemo } from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import { colors } from '@bsport/common/lib/colors.js';
import Select, { components } from 'react-select';
import { styleFn, StylesConfig } from 'react-select/lib/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Checkbox, makeStyles, useTheme } from '@material-ui/core';
import { GroupProps } from 'react-select/lib/components/Group';
import { MenuProps } from 'react-select/lib/components/Menu';
import type { EstablishmentBillingGroup } from '../../types';

type SelectorOption = {
  value: number;
  label: string;
};

type EstablishmentBillingGroupByAddress = {
  label: string;
  options: SelectorOption[];
};

type OwnProps = {
  closeMenuOnSelect: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  isClearable?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isOptionDisabled?: boolean;
  placeholder?: string;
  requiredValueIsMissing?: boolean;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup | null;
  targetParentElement?: boolean;
  selectOption: (value: EstablishmentBillingGroup) => void;
};

export type Props = OwnProps;

/**
 * Groups establishment billing groups by address and sorts them by name.
 *
 * @param {EstablishmentBillingGroup[]} establishmentBillingGroups - An array of establishment billing groups.
 * @returns {EstablishmentBillingGroupByAddress[]} - An array of objects, each representing a group of establishment billing groups with the same address.
 */
const getGroupedEstablishmentBillingGroupOptions = (
  establishmentBillingGroups: EstablishmentBillingGroup[],
) => {
  if (!(establishmentBillingGroups && establishmentBillingGroups.length)) {
    return [];
  }
  establishmentBillingGroups.sort(
    (establishmentBillingGroup, establishmentBillingGroup_) => {
      if (
        establishmentBillingGroup.name.toUpperCase() <
        establishmentBillingGroup_.name.toUpperCase()
      ) {
        return -1;
      }
      return 1;
    },
  );
  const establishmentBillingGroupByAddress = establishmentBillingGroups.reduce<
    EstablishmentBillingGroupByAddress[]
  >((accumulator, establishmentBillingGroupItem) => {
    const temp = accumulator.findIndex(
      (group) =>
        group?.label?.toUpperCase() ===
        establishmentBillingGroupItem?.address?.toUpperCase(),
    );
    if (temp === -1) {
      accumulator.push({
        label: establishmentBillingGroupItem.address,
        options: [
          {
            value: establishmentBillingGroupItem.id,
            label: establishmentBillingGroupItem.name,
          },
        ],
      });
    } else {
      accumulator[temp].options.push({
        value: establishmentBillingGroupItem.id,
        label: establishmentBillingGroupItem.name,
      });
    }
    return accumulator;
  }, []);
  return establishmentBillingGroupByAddress;
};

/**
 * A functional component that renders a group heading with a location icon and a border.
 *
 * @param {React.PropsWithChildren<{}>} props - The properties passed to the component.
 * @returns {JSX.Element} - A JSX element representing the group heading.
 */
const GroupHeading: React.FC = ({ children, ...props }) => {
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

/**
 * A functional component that renders a Menu component from react-select.
 *
 * @param {React.PropsWithChildren<MenuProps<EstablishmentBillingGroupByAddress>>} props - The properties passed to the component.
 * @returns {JSX.Element} - A JSX element representing the Menu component.
 */
const Menu: React.FC<MenuProps<SelectorOption>> = ({ children, ...props }) => {
  if (props.selectProps.isLoading) {
    return <div />;
  }
  return <components.Menu {...props}>{children}</components.Menu>;
};

/**
 * A functional component that renders a group of establishment billing group options with a checkbox.
 *
 * @param {React.PropsWithChildren<GroupProps<EstablishmentBillingGroupByAddress>>} props - The properties passed to the component.
 * @returns {JSX.Element} - A JSX element representing the group of options.
 */
const Group: React.FC<GroupProps<SelectorOption>> = ({
  children,
  ...props
}) => {
  const groupOptionsValueList = props.options.map((opt) => opt.value);
  const checked = React.useMemo(
    () =>
      groupOptionsValueList.every(
        (item) =>
          props.selectProps.selectedEstablishments &&
          props.selectProps.selectedEstablishments.includes(item),
      ),
    [props.selectProps.selectedEstablishments, groupOptionsValueList],
  );

  const handleChange = useCallback(() => {
    if (!checked && props.selectProps.selectMultipleOptions) {
      props.selectProps.selectMultipleOptions(groupOptionsValueList);
    }
  }, [checked, props.selectProps, groupOptionsValueList]);
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
            onChange={handleChange}
            size="small"
          />
        </div>
      )}

      <components.Group {...props}>{children}</components.Group>
    </div>
  );
};

const establishmentBillingGroupStyles: StylesConfig = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma(colors.secondary);

    let backgroundColor;
    if (isDisabled) {
      backgroundColor = null;
    } else if (isSelected) {
      backgroundColor = colors.secondary;
    } else if (isFocused) {
      backgroundColor = color.alpha(0.1).css();
    } else {
      backgroundColor = null;
    }

    let colorValue;
    if (isDisabled) {
      colorValue = '#ccc';
    } else if (isSelected) {
      if (chroma.contrast(color, 'white') > 2) {
        colorValue = 'white';
      } else {
        colorValue = 'black';
      }
    } else {
      colorValue = colors.secondary;
    }

    return {
      ...styles,
      backgroundColor,
      color: colorValue,
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        // @ts-expect-error
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : color.alpha(0.3).css()),
      },
      groupHeading: ((base) => ({ ...base, margin: 0 })) as styleFn,
    };
  },
};

const controlStyle = (
  controlError: boolean,
  colorError: string,
): StylesConfig => {
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

// For storybook
const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

/**
 * A functional component that renders a Select component for establishment billing groups.
 *
 * @param {Props} props - The properties passed to the component.
 * @returns {JSX.Element} - A JSX element representing the Select component.
 * @see getGroupedEstablishmentBillingGroupOptions
 *
 * The component renders a `Select` component from react-select with the passed properties. It uses the `getGroupedEstablishmentBillingGroupOptions` function
 * to group the establishment billing groups by address and sort them by name. It also uses the `GroupHeading`, `Group`, and `Menu` components as custom components
 * for the item display.
 */
export function EstablishmentBillingGroupSelector(props: Props) {
  const {
    closeMenuOnSelect,
    establishmentBillingGroups,
    isClearable,
    isDisabled,
    isOptionDisabled,
    isRequired,
    placeholder,
    requiredValueIsMissing,
    selectedEstablishmentBillingGroup,
    targetParentElement,
    selectOption,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('establishment');

  const value: SelectorOption | null = useMemo(() => {
    if (selectedEstablishmentBillingGroup) {
      return {
        label: selectedEstablishmentBillingGroup.name,
        value: selectedEstablishmentBillingGroup.id,
      };
    }
    return null;
  }, [selectedEstablishmentBillingGroup]);

  const handleChange = useCallback(
    (option: SelectorOption) => {
      selectOption(
        establishmentBillingGroups?.find(
          (establishmentBillingGroup) =>
            establishmentBillingGroup.id === option.value,
        ),
      );
    },
    [selectOption, establishmentBillingGroups],
  );

  // Position fixed when portaling to document.body, which makes react-select compute placement
  // relative to the viewport and avoids the dropdown being stuck at the bottom of the modal.
  const menuPortalTarget = targetParentElement ? null : document.body;
  const menuPosition = targetParentElement ? 'absolute' : 'fixed';

  return (
    <Select
      className={classes.root}
      closeMenuOnSelect={closeMenuOnSelect}
      components={{ GroupHeading, Group, Menu }}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isOptionDisabled={
        isOptionDisabled
          ? (option: SelectorOption) =>
              selectedEstablishmentBillingGroup?.id === option.value
          : null
      }
      isRequired={isRequired}
      isSearchable={false}
      menuPlacement="auto"
      menuPortalTarget={menuPortalTarget}
      menuPosition={menuPosition}
      onChange={handleChange}
      options={getGroupedEstablishmentBillingGroupOptions([
        ...establishmentBillingGroups,
      ])}
      placeholder={
        placeholder || t(isRequired ? 'billingGroupRequired' : 'billingGroup')
      }
      styles={{
        ...establishmentBillingGroupStyles,
        ...controlStyle(
          isRequired && requiredValueIsMissing,
          theme.palette.error.main,
        ),
      }}
      value={value}
    />
  );
}

export default React.memo(EstablishmentBillingGroupSelector);
