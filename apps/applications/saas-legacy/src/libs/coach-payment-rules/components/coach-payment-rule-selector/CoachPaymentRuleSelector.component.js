// @flow

import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Selector, { Suggestion } from '#src/components/Selector.component';
import { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import { DISSOCIATED_COACH_PAYMENT_RULE } from '#src/libs/coach-payment-rules/constants';

type Props = {
  t: TFunction,
  selected: number,
  onChange: (opt: Suggestion) => void,
  classes: { [string]: string },
  coachPaymentRulesList: Array<CoachPaymentRule>,
  isOverride?: boolean,
  id: string,
  enableReset?: boolean,
  disabled?: boolean,
};

export function CoachPaymentRuleSelector(props: Props) {
  const {
    t,
    coachPaymentRulesList,
    isOverride,
    selected,
    onChange,
    classes,
    enableReset,
    disabled,
  } = props;
  const suggestions = (coachPaymentRulesList ?? []).map((s) => ({
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
    <div>
      <Selector
        className={classes.root}
        id={props.id}
        isDisabled={disabled}
        nullCurrentValue={!selected}
        onChange={onChange}
        placeholder={
          isOverride ? t('select.placeholderOverride') : t('select.placeholder')
        }
        selected={selected}
        suggestions={suggestions}
      />
    </div>
  );
}

const styles = () => ({
  root: {
    minWidth: 200,
  },
});

export default withStyles(styles)(
  withTranslation(['paymentRules'])(CoachPaymentRuleSelector),
);
