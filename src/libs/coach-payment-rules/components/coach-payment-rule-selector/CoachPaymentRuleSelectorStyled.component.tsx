// @flow

import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { colors } from '@bsport/common/lib/colors';
import Select, { components } from 'react-select';
import chroma from 'chroma-js';
import BlockIcon from '@material-ui/icons/Block';
import GroupIcon from '@material-ui/icons/Group';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { CoachPaymentRule } from '../../types';
import type { MaterialStyleType } from '../../../../utils/types';
import { DISSOCIATED_COACH_PAYMENT_RULE } from '../../utils';

const getPaymentRuleOptions = (coachPaymentRule: Array<CoachPaymentRule>) =>
  coachPaymentRule.map((rule) => ({ value: rule.id, label: rule.name }));

const DropdownIndicator = (
  props: ReturnType<typeof components.DropdownIndicator>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      {props.selectProps.isDisabled ? (
        <BlockIcon fontSize="small" />
      ) : (
        <ExpandMoreIcon fontSize="small" />
      )}
    </components.DropdownIndicator>
  );
};
const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {props.selectProps.isGroupSelect ? (
        <GroupIcon fontSize="small" style={{ marginRight: '10px' }} />
      ) : null}
      {children}
    </div>
  </components.SingleValue>
);
const Placeholder = ({ children, ...props }) => (
  <components.Placeholder {...props}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {props.selectProps.isGroupSelect ? (
        <GroupIcon fontSize="small" style={{ marginRight: '10px' }} />
      ) : null}
      {children}
    </div>
  </components.Placeholder>
);
const ruleStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
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
  onChange: (Suggestion) => void;
  coachPaymentRulesList: Array<CoachPaymentRule>;
  selectedRules: Array<number>;
  enableReset?: boolean;
  disabled?: boolean;
  placeholder: string;
  noMulti: boolean;
  closeMenuOnSelect: boolean;
  isClearable: boolean;
  isGroupSelect: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export function CoachPaymentRuleSelectorStyled(props: Props) {
  const {
    t,
    coachPaymentRulesList,
    selectedRules,
    closeMenuOnSelect,
    noMulti,
    placeholder,
    onChange,
    isClearable,
    enableReset,
    disabled,
    isGroupSelect,
  } = props;
  const suggestions = (coachPaymentRulesList || []).map((s) => ({
    value: s.id,
    label: s.name,
  }));
  if (enableReset) {
    suggestions.push({
      value: DISSOCIATED_COACH_PAYMENT_RULE,
      label: (
        <Typography color="error" variant="subtitle2">
          {t('select.reset')}
        </Typography>
      ),
    });
  }
  return (
    <Select
      closeMenuOnSelect={closeMenuOnSelect}
      isMulti={!noMulti}
      placeholder={placeholder || t('coach')}
      options={getPaymentRuleOptions(
        coachPaymentRulesList ? [...coachPaymentRulesList] : [],
      )}
      onChange={onChange}
      isDisabled={disabled}
      styles={ruleStyles}
      isClearable={isClearable}
      menuPortalTarget={document.querySelector('body')}
      value={
        selectedRules
          ? getPaymentRuleOptions([
              ...coachPaymentRulesList?.filter((rule) =>
                selectedRules.includes(rule.id),
              ),
            ])
          : undefined
      }
      isGroupSelect={isGroupSelect}
      components={{ DropdownIndicator, SingleValue, Placeholder }}
    />
  );
}

const styles = () => ({
  root: {
    minWidth: 200,
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['paymentRules']),
)(CoachPaymentRuleSelectorStyled);
