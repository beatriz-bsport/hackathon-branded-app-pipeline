// @flow

import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Selector, {
  Suggestion,
} from '../../../../components/Selector.component';
import { CoachPaymentRule } from '../../types';
import { DISSOCIATED_COACH_PAYMENT_RULE } from '../../utils';

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
    <div>
      <Selector
        id={props.id}
        className={classes.root}
        suggestions={suggestions}
        selected={selected}
        nullCurrentValue={!selected}
        placeholder={
          isOverride ? t('select.placeholderOverride') : t('select.placeholder')
        }
        onChange={onChange}
        isDisabled={disabled}
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
