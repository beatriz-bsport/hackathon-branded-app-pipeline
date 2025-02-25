import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { colors } from '@bsport/common/lib/colors.js';
import Select, { components } from 'react-select';
import chroma from 'chroma-js';
import BlockIcon from '@material-ui/icons/Block';
import GroupIcon from '@material-ui/icons/Group';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import type { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import { DISSOCIATED_COACH_PAYMENT_RULE } from '#src/libs/coach-payment-rules/constants';
import type { MaterialStyleType } from '../../../../utils/types';

const getPaymentRuleOptions = (coachPaymentRule: Array<CoachPaymentRule>) =>
  coachPaymentRule.map((rule) => ({ value: rule.id, label: rule.name }));

const DropdownIndicator = (
  // @ts-expect-error
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
// @ts-expect-error
const SingleValue = ({ children, ...props }) => (
  // @ts-expect-error
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {props.selectProps.isGroupSelect ? (
        <GroupIcon fontSize="small" style={{ marginRight: '10px' }} />
      ) : null}
      {children}
    </div>
  </components.SingleValue>
);
// @ts-expect-error
const Placeholder = ({ children, ...props }) => (
  // @ts-expect-error
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
  // @ts-expect-error
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  // @ts-expect-error
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  // @ts-expect-error
  option: (styles, { isDisabled, isFocused, isSelected }) => {
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

type OwnProps = {
  // @ts-expect-error
  onChange: (Suggestion) => void;
  id?: string;
  coachPaymentRulesList: Array<CoachPaymentRule>;
  selectedRules: Array<number>;
  enableReset?: boolean;
  disabled?: boolean;
  placeholder: string;
  noMulti: boolean;
  closeMenuOnSelect: boolean;
  isClearable: boolean;
  isGroupSelect?: boolean;
  selectorClass?: string;
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
    selectorClass,
    id,
  } = props;
  const suggestions = (coachPaymentRulesList ?? []).map((s) => ({
    value: s.id,
    label: s.name,
  }));
  if (enableReset) {
    suggestions.push({
      value: DISSOCIATED_COACH_PAYMENT_RULE,
      // @ts-expect-error
      label: (
        <Typography color="error" variant="subtitle2">
          {t('select.reset')}
        </Typography>
      ),
    });
  }
  return (
    <Select
      className={clsx(selectorClass)}
      closeMenuOnSelect={closeMenuOnSelect}
      components={{ DropdownIndicator, SingleValue, Placeholder }}
      id={id}
      isClearable={isClearable}
      isDisabled={disabled}
      isGroupSelect={isGroupSelect}
      isMulti={!noMulti}
      menuPortalTarget={document.querySelector('body')}
      onChange={onChange}
      options={getPaymentRuleOptions(
        coachPaymentRulesList ? [...coachPaymentRulesList] : [],
      )}
      placeholder={placeholder || t('coach')}
      styles={ruleStyles}
      value={
        selectedRules && coachPaymentRulesList
          ? getPaymentRuleOptions([
              ...coachPaymentRulesList?.filter((rule) =>
                selectedRules.includes(rule.id),
              ),
            ])
          : undefined
      }
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
