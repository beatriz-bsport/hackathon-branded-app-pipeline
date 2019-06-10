// @flow

import React from 'react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import type { TFunction } from 'react-i18next';

import Selector from '../../../components/Selector.component';
import type { Suggestion } from '../../../components/Selector.component';

import type { PaymentRuleSet } from '../types';

type Props = {
  t: TFunction,
  selected: number,
  onChange: (Suggestion) => void,
  classes: { [string]: string },
  paymentRules: PaymentRuleSet[],
  isOverride?: boolean,
};

export function PaymentRuleSelector(props: Props) {
  const { t, paymentRules, isOverride, selected, onChange, classes } = props;
  const suggestions = (paymentRules || []).map((s) => ({
    value: s.id,
    label: s.name,
  }));
  return (
    <Selector
      className={classes.root}
      suggestions={suggestions}
      selected={selected}
      placeholder={
        isOverride ? t('select.placeholderOverride') : t('select.placeholder')
      }
      onChange={onChange}
    />
  );
}

const styles = () => ({
  root: {
    minWidth: 200,
  },
});

export default withStyles(styles)(
  withNamespaces(['paymentRules'])(PaymentRuleSelector),
);
