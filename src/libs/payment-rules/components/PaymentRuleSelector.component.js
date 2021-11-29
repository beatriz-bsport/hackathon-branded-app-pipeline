// @flow

import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import Selector, { Suggestion } from '../../../components/Selector.component';

import { PaymentRule } from '../types';

type Props = {
  t: TFunction,
  selected: number,
  onChange: (Suggestion) => void,
  classes: { [string]: string },
  paymentRules: PaymentRule[],
  isOverride?: boolean,
  id: string,
};

export function PaymentRuleSelector(props: Props) {
  const { t, paymentRules, isOverride, selected, onChange, classes } = props;
  const suggestions = (paymentRules || []).map((s) => ({
    value: s.id,
    label: s.name,
  }));
  return (
    <div>
      <Selector
        id={props.id}
        className={classes.root}
        suggestions={suggestions}
        selected={selected}
        placeholder={
          isOverride ? t('select.placeholderOverride') : t('select.placeholder')
        }
        onChange={onChange}
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
  withTranslation(['paymentRules'])(PaymentRuleSelector),
);
